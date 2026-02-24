import { Grid2, useTheme } from "@mui/material";
import { OAVSideBar } from "./OAVSideBar";
import { submitAndRunPlanImmediately } from "#/blueapi/blueapi.ts";
import { readVisitFromPv, parseInstrumentSession } from "#/blueapi/visit.ts";
import { OavVideoStream } from "#/components/OavVideoStream.tsx";
import { useConfigCall } from "#/config_server/configServer.ts";
import { forceString, useParsedPvConnection } from "#/pv/util.ts";
import { ZoomLevels } from "#/pv/enumPvValues.ts";
import { useMemo, useEffect } from "react";

const DISPLAY_CONFIG_ENDPOINT =
  "/dls_sw/i24/software/daq_configuration/domain/display.configuration";

export function OavMover() {
  const beamCenterQuery = useConfigCall(DISPLAY_CONFIG_ENDPOINT);
  const currentZoomValue = String(
    useParsedPvConnection({
      pv: "ca://BL24I-EA-OAV-01:FZOOM:MP:SELECT",
      label: "zoom-level",
      transformValue: forceString,
    }),
  );
  useEffect(() => {
    beamCenterQuery.refetch();
  }, [currentZoomValue]);
  const zoomIndex = ZoomLevels.findIndex(
    (element: string) => element == currentZoomValue,
  );

  const [crosshairX, crosshairY] = useMemo(() => {
    if (!beamCenterQuery.data || zoomIndex < 0) {
      return [NaN, NaN];
    }

    const lines = beamCenterQuery.data.split("\n");
    const xLine = lines[zoomIndex * 7 + 1];
    const yLine = lines[zoomIndex * 7 + 2];

    if (!xLine || !yLine) {
      return [NaN, NaN];
    }

    return [Number(xLine.split(" ")[2]), Number(yLine.split(" ")[2])];
  }, [beamCenterQuery.data, zoomIndex]);

  const theme = useTheme();
  const bgColor = theme.palette.background.paper;

  const fullVisit = readVisitFromPv();

  function onCoordClick(x: number, y: number) {
    submitAndRunPlanImmediately({
      planName: "move_on_oav_view_click",
      planParams: { position: [x, y] },
      instrumentSession: parseInstrumentSession(fullVisit),
    }).catch((error) => {
      console.log(
        `Failed to run plan , see console and logs for full error. Reason: ${error}`,
      );
    });
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
