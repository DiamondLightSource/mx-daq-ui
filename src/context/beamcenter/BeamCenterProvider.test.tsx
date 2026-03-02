import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { useContext } from "react";
import "@testing-library/jest-dom/vitest";
import { BeamCenterProvider } from "./BeamCenterProvider";
import { BeamCenterContext } from "./BeamCenterContext";
import { useConfigCall } from "#/config_server/configServer.ts";
import type { UseQueryResult } from "react-query";

vi.mock("#/config_server/configServer.ts", () => ({
  useConfigCall: vi.fn(),
}));

const TestConsumer = () => {
  const value = useContext(BeamCenterContext);
  return (
    <>
      <div data-testid="context-value">{value.data}</div>
      <button data-testid="refetch-button" onClick={() => value.refetch()}>
        Refetch
      </button>
    </>
  );
};

describe("BeamCenterProvider", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mockRefetch = vi.fn();
  const mockQueryResult = {
    data: "mock config text",
    refetch: mockRefetch,
  };

  beforeEach(() =>
    vi
      .mocked(useConfigCall)
      .mockReturnValue(
        mockQueryResult as unknown as UseQueryResult<string, unknown>,
      ),
  );

  it("calls useConfigCall with the correct endpoint", () => {
    render(
      <BeamCenterProvider>
        <TestConsumer />
      </BeamCenterProvider>,
    );

    expect(useConfigCall).toHaveBeenCalledWith(
      "/dls_sw/i24/software/daq_configuration/domain/display.configuration",
    );
  });

  it("provides the data to consumers via context", () => {
    render(
      <BeamCenterProvider>
        <TestConsumer />
      </BeamCenterProvider>,
    );

    expect(screen.getByTestId("context-value")).toHaveTextContent(
      "mock config text",
    );
  });

  it("passes refetch function through context and it can be called", () => {
    render(
      <BeamCenterProvider>
        <TestConsumer />
      </BeamCenterProvider>,
    );

    fireEvent.click(screen.getByTestId("refetch-button"));
    expect(mockRefetch).toHaveBeenCalled();
  });
});
