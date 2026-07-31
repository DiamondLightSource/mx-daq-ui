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

/** Stand in for blueapi: /plans, /worker/state, and a task submission that succeeds. */
function mockBlueapi(workerState: () => string) {
  const fetchMock = vi.fn((url: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    if (url.endsWith("/plans")) {
      return jsonResponse(PLANS_RESPONSE);
    }
    if (url.endsWith("/worker/state")) {
      return jsonResponse(workerState());
    }
    if (url.endsWith("/tasks") && method === "POST") {
      return jsonResponse({ task_id: "task-1" });
    }
    if (url.endsWith("/worker/task") && method === "PUT") {
      return jsonResponse({ task_id: "task-1" });
    }
    throw new Error(`Unexpected request ${method} ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
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
    mockBlueapi(() => "RUNNING");
    renderButton();
    await waitFor(() => expect(darksButton()).toBeDisabled());
  });

  it("explains why it is disabled rather than silently doing nothing", async () => {
    mockBlueapi(() => "RUNNING");
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
    const fetchMock = mockBlueapi(() => "RUNNING");
    renderButton();
    await waitFor(() => expect(darksButton()).toBeDisabled());
    // Force the click past the disabled attribute so the handler's own guard is what
    // is under test: nothing must reach blueapi even if a press gets through.
    await forceClick(darksButton());
    expect(taskSubmissions(fetchMock)).toBe(0);
  });

  it("re-enables the button once the worker returns to idle", async () => {
    let state = "RUNNING";
    mockBlueapi(() => state);
    renderButton();
    await waitFor(() => expect(darksButton()).toBeDisabled());
    state = "IDLE";
    await waitFor(() => expect(darksButton()).toBeEnabled(), { timeout: 3000 });
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
    // The worker stays IDLE throughout: the poll never sees the plan, so only the
    // button's own in-progress state can stop the extra presses.
    const fetchMock = mockBlueapi(() => "IDLE");
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
    let state = "IDLE";
    mockBlueapi(() => state);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await user.click(darksButton());
    state = "RUNNING";
    await waitFor(() =>
      expect(screen.getByRole("progressbar")).toBeInTheDocument(),
    );
  });

  it("releases the button if the worker is never seen busy", async () => {
    // A plan shorter than the poll interval must not leave the button stuck.
    mockBlueapi(() => "IDLE");
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderButton();
    await waitFor(() => expect(darksButton()).toBeEnabled());

    await user.click(darksButton());
    await waitFor(() => expect(darksButton()).toBeDisabled());

    vi.advanceTimersByTime(6000);
    await waitFor(() => expect(darksButton()).toBeEnabled());
  });
});
