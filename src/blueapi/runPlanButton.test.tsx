import { ReactNode } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { it, describe, vi, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { RunPlanButton } from "./BlueapiComponents";

const PLANS_RESPONSE = {
  plans: [
    {
      name: "do_pedestal_darks",
      schema: {
        properties: {
          exp_time_s: { title: "Exp Time S", type: "number" },
          jungfrau: {
            enum: ["jungfrau"],
            title: "Jungfrau",
            type: "dodal.devices.beamlines.i24.commissioning_jungfrau.CommissioningJungfrauDetector",
          },
        },
        title: "do_pedestal_darks",
        type: "object",
      },
    },
  ],
};

const TASK_ID = "task-1";

/** The blueapi task record the frontend polls; tests move it on to model an outcome. */
type FakeTask = {
  task_id: string;
  is_complete: boolean;
  is_pending: boolean;
  errors: string[];
  outcome?: object | null;
};

const RUNNING_TASK: FakeTask = {
  task_id: TASK_ID,
  is_complete: false,
  is_pending: false,
  errors: [],
  outcome: null,
};

/** Shaped like the real record for the MotorLimitsError failure, message and all. */
const FAILED_TASK: FakeTask = {
  task_id: TASK_ID,
  is_complete: true,
  is_pending: false,
  errors: ["<WatchableAsyncStatus, device: detector_motion-z, errored: ...>"],
  outcome: {
    outcome: "error",
    type: "FailedStatus",
    message:
      "detector_motion-z motor trajectory for requested fly/move is from 1300.0mm to 200mm but motor limits are 215.8mm <= x <= 1510.0mm",
  },
};

const SUCCEEDED_TASK: FakeTask = {
  task_id: TASK_ID,
  is_complete: true,
  is_pending: false,
  errors: [],
  outcome: { outcome: "success", type: "NoneType", result: null },
};

type BlueapiMockOptions = {
  workerState?: () => string;
  task?: () => FakeTask;
  taskReadable?: () => boolean;
  /** Reject PUT /worker/task with a 409, as blueapi does for a non-idle worker. */
  conflictOnStart?: () => boolean;
};

/** Stand in for blueapi: /plans, /worker/state, task submission, and task follow-up. */
function mockBlueapi(options: BlueapiMockOptions = {}) {
  const workerState = options.workerState ?? (() => "IDLE");
  const task = options.task ?? (() => RUNNING_TASK);
  const taskReadable = options.taskReadable ?? (() => true);
  const conflictOnStart = options.conflictOnStart ?? (() => false);
  const fetchMock = vi.fn((url: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    if (url.endsWith("/plans")) {
      return jsonResponse(PLANS_RESPONSE);
    }
    if (url.endsWith("/worker/state")) {
      return jsonResponse(workerState());
    }
    if (url.endsWith("/tasks") && method === "POST") {
      return jsonResponse({ task_id: TASK_ID });
    }
    if (url.endsWith("/worker/task") && method === "PUT") {
      return conflictOnStart()
        ? errorResponse(409, "Conflict")
        : jsonResponse({ task_id: TASK_ID });
    }
    if (url.endsWith(`/tasks/${TASK_ID}`)) {
      return taskReadable()
        ? jsonResponse(task())
        : errorResponse(500, "Internal Server Error");
    }
    throw new Error(`Unexpected request ${method} ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function errorResponse(status: number, statusText: string) {
  return Promise.resolve({
    ok: false,
    status: status,
    statusText: statusText,
    json: () => Promise.resolve({}),
  });
}

function jsonResponse(body: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(body),
  });
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function renderButton() {
  return render(
    <RunPlanButton
      btnLabel="Pedestal darks"
      planName="do_pedestal_darks"
      currentVisit="/dls/i24/data/2026/cm12345-1"
    />,
    { wrapper },
  );
}

function darksButton() {
  return screen.getByRole("button", { name: /Pedestal darks/ });
}

/** Click regardless of the disabled attribute, to test the handler guard behind it. */
function forceClick(element: HTMLElement) {
  return userEvent.click(element, { pointerEventsCheck: 0 });
}

/** Every POST /tasks leaves a task in blueapi's store, so count them, not just the PUTs. */
function taskSubmissions(fetchMock: ReturnType<typeof mockBlueapi>) {
  return fetchMock.mock.calls.filter(
    ([url, init]) =>
      String(url).endsWith("/tasks") && (init?.method ?? "GET") === "POST",
  ).length;
}

describe("RunPlanButton while a plan is running", () => {
  afterEach(() => {
    // This project does not enable vitest globals, so RTL's auto-cleanup never
    // registers and renders would otherwise pile up between tests.
    cleanup();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("disables the button when the worker is already running a plan", async () => {
    mockBlueapi({ workerState: () => "RUNNING" });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeDisabled());
  });

  it("explains why it is disabled rather than silently doing nothing", async () => {
    mockBlueapi({ workerState: () => "RUNNING" });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeDisabled());
    // The tooltip lives on the wrapper span, since a disabled button has no pointer events.
    await userEvent.hover(darksButton().parentElement!);
    await waitFor(() =>
      expect(
        screen.getByText("A plan is already running (worker is RUNNING)"),
      ).toBeInTheDocument(),
    );
  });

  it("submits no task when the worker is busy", async () => {
    const fetchMock = mockBlueapi({ workerState: () => "RUNNING" });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeDisabled());
    // Force the click past the disabled attribute so the handler's own guard is what
    // is under test: nothing must reach blueapi even if a press gets through.
    await forceClick(darksButton());
    expect(taskSubmissions(fetchMock)).toBe(0);
  });

  it("re-enables the button once the worker returns to idle", async () => {
    let state = "RUNNING";
    mockBlueapi({ workerState: () => state });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeDisabled());
    state = "IDLE";
    await waitFor(() => expect(darksButton()).toBeEnabled(), { timeout: 3000 });
  });
});

describe("RunPlanButton when blueapi refuses to start the plan", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  /** A plan started elsewhere between the readiness poll and the press: the worker is
   * busy and the start is refused, both for the same reason. */
  function mockBeatenToIt() {
    let state = "IDLE";
    return mockBlueapi({
      workerState: () => state,
      conflictOnStart: () => {
        state = "RUNNING";
        return true;
      },
    });
  }

  it("says another plan is running rather than pointing at the logs", async () => {
    mockBeatenToIt();
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await userEvent.click(darksButton());
    await waitFor(() =>
      expect(
        screen.getByText(
          "Cannot run do_pedestal_darks: a plan is already running",
        ),
      ).toBeInTheDocument(),
    );
  });

  it("re-reads the worker state at once instead of waiting for the idle poll", async () => {
    // The refusal proves the cached IDLE is wrong. Without an immediate re-read the
    // button stays enabled for a whole idle interval, and every further press leaves
    // another orphan task in blueapi's store.
    mockBeatenToIt();
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await userEvent.click(darksButton());
    await waitFor(() => expect(darksButton()).toBeDisabled(), {
      timeout: 2000,
    });
  });

  it("does not follow a task that was never started", async () => {
    const fetchMock = mockBeatenToIt();
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await userEvent.click(darksButton());
    await waitFor(() =>
      expect(screen.getByText(/a plan is already running/)).toBeInTheDocument(),
    );
    // No task id was kept, so nothing should be polling /tasks/<id> for an outcome.
    expect(
      fetchMock.mock.calls.filter(([url]) =>
        String(url).endsWith(`/tasks/${TASK_ID}`),
      ),
    ).toHaveLength(0);
  });
});

describe("RunPlanButton double presses", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("submits only one task when pressed repeatedly before the worker state updates", async () => {
    // The worker stays IDLE throughout, so the 500ms state poll never reports the plan.
    // Only the button's own in-progress state can stop the extra presses.
    const fetchMock = mockBlueapi();
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
      pointerEventsCheck: 0,
    });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await user.click(darksButton());
    await waitFor(() => expect(darksButton()).toBeDisabled());
    await user.click(darksButton());
    await user.click(darksButton());

    expect(taskSubmissions(fetchMock)).toBe(1);
  });

  it("shows an in-progress marker on the button that started the plan", async () => {
    mockBlueapi();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await user.click(darksButton());
    await waitFor(() =>
      expect(screen.getByRole("progressbar")).toBeInTheDocument(),
    );
  });
});

describe("RunPlanButton reporting how a plan ended", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("reports a plan that failed after it had started", async () => {
    // The failure blueapi actually recorded for the rotation scan: the plan was accepted
    // and only died later, in the setup move.
    mockBlueapi({ task: () => FAILED_TASK });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await userEvent.click(darksButton());
    await waitFor(() =>
      expect(
        screen.getByText(/Plan do_pedestal_darks failed/),
      ).toBeInTheDocument(),
    );
    // The reason has to be in the message, not just "it failed".
    expect(
      screen.getByText(/motor limits are 215.8mm <= x <= 1510.0mm/),
    ).toBeInTheDocument();
  });

  it("leaves a failure on screen instead of auto-hiding it", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      mockBlueapi({ task: () => FAILED_TASK });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderButton();
      await waitFor(() => expect(darksButton()).toBeEnabled());

      await user.click(darksButton());
      await waitFor(() =>
        expect(
          screen.getByText(/Plan do_pedestal_darks failed/),
        ).toBeInTheDocument(),
      );

      vi.advanceTimersByTime(30000);
      expect(
        screen.getByText(/Plan do_pedestal_darks failed/),
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("reports a plan that finished cleanly", async () => {
    mockBlueapi({ task: () => SUCCEEDED_TASK });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await userEvent.click(darksButton());
    await waitFor(() =>
      expect(
        screen.getByText("Plan do_pedestal_darks finished"),
      ).toBeInTheDocument(),
    );
  });

  it("treats a completed task carrying errors as a failure", async () => {
    // Belt and braces: report the errors list even without an error outcome.
    mockBlueapi({
      task: () => ({
        ...RUNNING_TASK,
        is_complete: true,
        errors: ["something went wrong in the plan"],
        outcome: null,
      }),
    });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await userEvent.click(darksButton());
    await waitFor(() =>
      expect(
        screen.getByText(/something went wrong in the plan/),
      ).toBeInTheDocument(),
    );
  });

  it("says the outcome is unknown if the task cannot be read", async () => {
    mockBlueapi({ taskReadable: () => false });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await userEvent.click(darksButton());
    await waitFor(() =>
      expect(
        screen.getByText(
          /Cannot tell whether plan do_pedestal_darks succeeded/,
        ),
      ).toBeInTheDocument(),
    );
  });

  it("re-enables the button once the plan has finished", async () => {
    let task = RUNNING_TASK;
    mockBlueapi({ task: () => task });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await userEvent.click(darksButton());
    await waitFor(() => expect(darksButton()).toBeDisabled());
    task = SUCCEEDED_TASK;
    await waitFor(() => expect(darksButton()).toBeEnabled(), { timeout: 3000 });
  });
});
