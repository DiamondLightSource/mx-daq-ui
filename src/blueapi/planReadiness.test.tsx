import { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { it, describe, vi, expect, beforeEach, afterEach } from "vitest";
import { usePlanReadiness } from "./blueapi";

// Captured verbatim from a live blueapi /plans response, so the shapes under test are
// the real ones: an injected device carries a dotted type plus an enum of the connected
// devices of that type, while an ordinary choice (GainMode) is a $ref into $defs.
const PLANS_RESPONSE = {
  plans: [
    {
      name: "block_check",
      schema: {
        additionalProperties: false,
        properties: {
          pmac: {
            enum: ["pmac"],
            title: "Pmac",
            type: "dodal.devices.beamlines.i24.pmac.PMAC",
          },
        },
        title: "block_check",
        type: "object",
      },
    },
    {
      name: "do_pedestal_darks",
      schema: {
        additionalProperties: false,
        properties: {
          exp_time_s: { title: "Exp Time S", type: "number" },
          pedestal_frames: { title: "Pedestal Frames", type: "integer" },
          pedestal_loops: { title: "Pedestal Loops", type: "integer" },
          filename: { title: "Filename", type: "string" },
          jungfrau: {
            enum: [],
            title: "Jungfrau",
            type: "dodal.devices.beamlines.i24.commissioning_jungfrau.CommissioningJungfrauDetector",
          },
        },
        title: "do_pedestal_darks",
        type: "object",
      },
    },
    {
      name: "do_non_pedestal_darks",
      schema: {
        $defs: {
          GainMode: {
            enum: ["Dynamic", "ForceSwitchG1", "FixG0"],
            title: "GainMode",
            type: "string",
          },
        },
        additionalProperties: false,
        properties: {
          gain_mode: { $ref: "#/$defs/GainMode" },
          exp_time_s: { title: "Exp Time S", type: "number" },
          filename: { title: "Filename", type: "string" },
          jungfrau: {
            enum: [],
            title: "Jungfrau",
            type: "dodal.devices.beamlines.i24.commissioning_jungfrau.CommissioningJungfrauDetector",
          },
        },
        required: ["gain_mode"],
        title: "do_non_pedestal_darks",
        type: "object",
      },
    },
  ],
};

/** Stub fetch for both endpoints usePlanReadiness consults: /plans and /worker/state. */
function mockBlueapiFetch(
  plansBody: object,
  workerState: string = "IDLE",
  plansOk = true,
) {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      const isPlans = url.endsWith("/plans");
      const ok = isPlans ? plansOk : true;
      return Promise.resolve({
        ok: ok,
        status: ok ? 200 : 500,
        statusText: ok ? "OK" : "Internal Server Error",
        json: () => Promise.resolve(isPlans ? plansBody : workerState),
      });
    }),
  );
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("usePlanReadiness", () => {
  beforeEach(() => {
    mockBlueapiFetch(PLANS_RESPONSE);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("blocks a plan whose injected device is not connected", async () => {
    const { result } = renderHook(() => usePlanReadiness("do_pedestal_darks"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.runnable).toBe(false));
    expect(result.current.reason).toBe("Not connected in blueapi: jungfrau");
  });

  it("allows a plan whose devices are all connected", async () => {
    const { result } = renderHook(() => usePlanReadiness("block_check"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.runnable).toBe(true));
    expect(result.current.reason).toBeUndefined();
  });

  it("does not mistake an ordinary enum parameter for a device", async () => {
    const { result } = renderHook(
      () => usePlanReadiness("do_non_pedestal_darks"),
      { wrapper },
    );
    await waitFor(() => expect(result.current.runnable).toBe(false));
    // gain_mode has an enum too, but only jungfrau is a device.
    expect(result.current.reason).toBe("Not connected in blueapi: jungfrau");
  });

  it("blocks a plan blueapi has not registered", async () => {
    const { result } = renderHook(() => usePlanReadiness("not_a_plan"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.runnable).toBe(false));
    expect(result.current.reason).toBe(
      "Plan not_a_plan is not registered with blueapi",
    );
  });

  it("allows the plan through while the plan list is still loading", () => {
    const { result } = renderHook(() => usePlanReadiness("do_pedestal_darks"), {
      wrapper,
    });
    // Synchronous first render, before the fetch resolves.
    expect(result.current.runnable).toBe(true);
  });

  it("allows the plan through if the plan list cannot be fetched", async () => {
    mockBlueapiFetch({}, "IDLE", false);
    const { result } = renderHook(() => usePlanReadiness("do_pedestal_darks"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.runnable).toBe(true));
  });

  it.each(["RUNNING", "PAUSED", "ABORTING"])(
    "blocks a runnable plan while the worker is %s",
    async (state) => {
      mockBlueapiFetch(PLANS_RESPONSE, state);
      const { result } = renderHook(() => usePlanReadiness("block_check"), {
        wrapper,
      });
      await waitFor(() => expect(result.current.runnable).toBe(false));
      expect(result.current.workerBusy).toBe(true);
      expect(result.current.reason).toBe(
        `A plan is already running (worker is ${state})`,
      );
    },
  );

  it("reports a busy worker rather than a disconnected device", async () => {
    // Busy takes priority: waiting is the answer, not restarting blueapi.
    mockBlueapiFetch(PLANS_RESPONSE, "RUNNING");
    const { result } = renderHook(() => usePlanReadiness("do_pedestal_darks"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.workerBusy).toBe(true));
  });

  it("blocks a plan when the worker has panicked", async () => {
    mockBlueapiFetch(PLANS_RESPONSE, "PANICKED");
    const { result } = renderHook(() => usePlanReadiness("block_check"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.runnable).toBe(false));
    expect(result.current.workerBusy).toBe(false);
    expect(result.current.reason).toBe(
      "The blueapi worker has panicked and needs restarting",
    );
  });

  it("allows a runnable plan while the worker is idle", async () => {
    const { result } = renderHook(() => usePlanReadiness("block_check"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.runnable).toBe(true));
    expect(result.current.workerBusy).toBe(false);
  });
});
