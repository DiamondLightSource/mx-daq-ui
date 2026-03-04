import { Grid2, useTheme } from "@mui/material";
import { useContext, useRef } from "react";
import { OAVSideBar } from "./OAVSideBar";
import { submitAndRunPlanImmediately } from "#/blueapi/blueapi.ts";
import { readVisitFromPv, parseInstrumentSession } from "#/blueapi/visit.ts";
import { OavVideoStream } from "#/components/OavVideoStream.tsx";
import { forceString, useParsedPvConnection } from "#/pv/util.ts";
import { ZoomLevels } from "#/pv/enumPvValues.ts";
import { useMemo, useEffect } from "react";
import { BeamCenterContext } from "#/context/beamcenter/BeamCenterContext.ts";

const ZOOM_PV = "ca://BL24I-EA-OAV-01:FZOOM:MP:SELECT";
const BEAM_CENTER_LINES_PER_ZOOM = 7;

export function useZoomAndCrosshair() {
  const beamCenterQuery = useContext(BeamCenterContext);
  const currentZoomValue = String(
    useParsedPvConnection({
      pv: ZOOM_PV,
      label: "zoom-level",
      transformValue: forceString,
    }),
  );

  const beamCenterQueryRef = useRef(beamCenterQuery);

  useEffect(() => {
    beamCenterQueryRef.current.refetch();
  }, [currentZoomValue]);

  const zoomIndex = ZoomLevels.findIndex(
    (element: string) => element == currentZoomValue,
  );

  const [crosshairX, crosshairY] = useMemo(() => {
    if (!beamCenterQuery.data || zoomIndex < 0) {
      return [NaN, NaN];
    }

    const lines = beamCenterQuery.data.split("\n");
    const xLine = lines[zoomIndex * BEAM_CENTER_LINES_PER_ZOOM + 1];
    const yLine = lines[zoomIndex * BEAM_CENTER_LINES_PER_ZOOM + 2];

    if (!xLine || !yLine) {
      return [NaN, NaN];
    }

    return [Number(xLine.split(" ")[2]), Number(yLine.split(" ")[2])];
  }, [beamCenterQuery.data, zoomIndex]);

  return { crosshairX, crosshairY };
}

export function OavMover() {
  const { crosshairX, crosshairY } = useZoomAndCrosshair();

  const theme = useTheme();
  const bgColor = theme.palette.background.paper;

  const fullVisit = readVisitFromPv();
  const beamCenterQuery = useContext(BeamCenterContext);

  function onCoordClick(x: number, y: number) {
    submitAndRunPlanImmediately({
      planName: "move_on_oav_view_click",
      planParams: { position: [x, y] },
      instrumentSession: parseInstrumentSession(fullVisit),
    }).catch((error) => {
      console.log(
        `Failed to run plan, see console and logs for full error. Reason: ${error}`,
      );
    });

    beamCenterQuery.refetch();
  }

  return (
    <Grid2 container spacing={2} columns={12}>
      <Grid2 size={{ xs: 12, lg: 8 }} sx={{ bgcolor: bgColor }}>
        <OavVideoStream
          pv="ca://BL24I-DI-OAV-01:"
          label="I24 OAV image stream"
          crosshairX={crosshairX}
          crosshairY={crosshairY}
          onCoordClick={onCoordClick}
        />
      </Grid2>

      <Grid2
        size={{ xs: 12, lg: 4 }}
        sx={{
          height: "95vh", // Height set to 95vh to span height of screen but to also leave 5vh space for the top navigation header.
          overflowY: "auto",
          padding: 2,
          boxSizing: "border-box",
        }}
      >
        <OAVSideBar />
      </Grid2>
    </Grid2>
  );
}

/**
 * Responsive layout strategy:
 *
 * Breakpoints: xs, sm, md, lg, xl
 *
 * - < lg (below 1200px):
 *   Single-column layout.
 *   The sidebar stacks below the video stream.
 *
 * - lg (>= 1200px):
 *   Two-column layout.
 *   Main content: 8/12 columns
 *   Sidebar: 4/12 columns
 *   Sidebar uses a compact layout (e.g. focus tab arranged in a 2x2 grid).
 *
 * - xl and above:
 *   Two-column layout maintained.
 *   Sidebar can use a full-width layout (e.g. focus tab arranged in a 4-button row).
 *
 * Note:
 * Extremely large screens are not specially optimized beyond xl for now;
 * layout simply scales with the standard MUI grid behaviour.
 */
