import { renderHook } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { useZoomAndCrosshair } from "./OAVStageController";
import { useParsedPvConnection } from "#/pv/util.ts";
import { BeamCenterContext } from "#/context/beamcenter/BeamCenterContext.ts";
import type { RawValue } from "#/pv/types.ts";

vi.mock("#/pv/util.ts", () => ({
  ...vi.importActual("#/pv/util.ts"),
  useParsedPvConnection: vi.fn(),
  forceString: (x: RawValue | string | number) => String(x),
}));

type validateZoomTestType = {
  zoomLevel: string;
  expectedX: number;
  expectedY: number;
};

describe("useZoomAndCrosshair", () => {
  const mockRefetch = vi.fn();
  const mockBeamCenterData = [
    "zoomLevel = 1.0",
    "crosshairX = 561",
    "crosshairY = 321",
    "topLeftX = 611",
    "topLeftY = 441",
    "bottomRightX = 631",
    "bottomRightY = 461",
    "zoomLevel = 2.0",
    "crosshairX = 562",
    "crosshairY = 322",
    "topLeftX = 612",
    "topLeftY = 442",
    "bottomRightX = 632",
    "bottomRightY = 462",
    "zoomLevel = 3.0",
    "crosshairX = 563",
    "crosshairY = 323",
    "topLeftX = 613",
    "topLeftY = 443",
    "bottomRightX = 633",
    "bottomRightY = 463",
  ].join("\n");

  beforeEach(() => {
    vi.mocked(useParsedPvConnection).mockReturnValue("2.0");
  });

  it.each`
    zoomLevel | expectedX | expectedY
    ${"1.0"}  | ${561}    | ${321}
    ${"2.0"}  | ${562}    | ${322}
    ${"3.0"}  | ${563}    | ${323}
  `(
    "returns ( $expectedX , $expectedY ) for zoom level '$zoomLevel'",
    ({ zoomLevel, expectedX, expectedY }: validateZoomTestType) => {
      vi.mocked(useParsedPvConnection).mockReturnValue(zoomLevel);
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <BeamCenterContext.Provider
          value={{
            data: mockBeamCenterData,
            refetch: mockRefetch,
          }}
        >
          {children}
        </BeamCenterContext.Provider>
      );

      const { result } = renderHook(() => useZoomAndCrosshair(), { wrapper });

      expect(result.current.crosshairX).toBe(expectedX);
      expect(result.current.crosshairY).toBe(expectedY);
    },
  );

  it("returns NaN for crosshair if zoomIndex is not found", () => {
    vi.mocked(useParsedPvConnection).mockReturnValue("99.0");
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BeamCenterContext.Provider
        value={{ data: mockBeamCenterData, refetch: mockRefetch }}
      >
        {children}
      </BeamCenterContext.Provider>
    );

    const { result } = renderHook(() => useZoomAndCrosshair(), { wrapper });

    expect(result.current.crosshairX).toBeNaN();
    expect(result.current.crosshairY).toBeNaN();
  });

  it("returns NaN if beamCenter data is missing", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BeamCenterContext.Provider value={{ data: null, refetch: mockRefetch }}>
        {children}
      </BeamCenterContext.Provider>
    );

    const { result } = renderHook(() => useZoomAndCrosshair(), { wrapper });

    expect(result.current.crosshairX).toBeNaN();
    expect(result.current.crosshairY).toBeNaN();
  });

  it("calls refetch when zoom level changes", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BeamCenterContext.Provider
        value={{ data: mockBeamCenterData, refetch: mockRefetch }}
      >
        {children}
      </BeamCenterContext.Provider>
    );

    renderHook(() => useZoomAndCrosshair(), { wrapper });
    vi.mocked(useParsedPvConnection).mockReturnValue("3.0");
    expect(mockRefetch).toHaveBeenCalled();
  });
});
