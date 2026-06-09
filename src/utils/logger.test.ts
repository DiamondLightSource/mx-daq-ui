import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { logger } from "./logger";

describe("Logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  type LoggerMethod = keyof typeof logger;
  it.each<[LoggerMethod, string]>([
    ["log", "Test log message"],
    ["info", "Test info message"],
    ["debug", "Test debug message"],
    ["warn", "Test warn message"],
    ["error", "Test error message"],
  ])(
    "should call the correct console method for logger.%s",
    (method, message) => {
      logger[method](message);

      expect(console[method]).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`^\\[${method.toUpperCase()}\\] .+: ${message}$`),
        ),
      );
    },
  );

  it("should include a timestamp in the log output", () => {
    logger.log("hello");
    const call = vi.mocked(console.log).mock.calls[0][0];
    expect(call).toMatch(/^\[LOG\] .+: hello$/);

    const timestampPart = call.split("] ")[1].split(":")[0];
    console.log(timestampPart);
    expect(new Date(timestampPart).toString()).not.toBe("Invalid Date");
  });
});
