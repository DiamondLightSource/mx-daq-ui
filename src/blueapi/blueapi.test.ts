import { describe, expect, it, vi } from "vitest";
import { abortCurrentPlan, submitAndRunPlanImmediately } from "./blueapi";

describe("Blueapi Logging", () => {
  it("should log abort message to the console when abort is pressed", () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    abortCurrentPlan();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Aborting current plan"),
    );
    consoleWarnSpy.mockRestore();
  });

  it("should log a success message when the plan runs successfully", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ task_id: "12345" }),
    } as Response);

    await submitAndRunPlanImmediately({
      planName: "test_plan",
      planParams: {},
      instrumentSession: "test_session",
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Plan submitted and running successfully"),
    );
    consoleLogSpy.mockRestore();
  });
});
