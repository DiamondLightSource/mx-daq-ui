import { Box, Grid2, useTheme } from "@mui/material";
import { OAVSideBar } from "./OAVSideBar";
import { submitAndRunPlanImmediately } from "#/blueapi/blueapi.ts";
import { readVisitFromPv, parseInstrumentSession } from "#/blueapi/visit.ts";
import { OavVideoStream } from "#/components/OavVideoStream.tsx";
import { useConfigCall } from "../../config_server/config_server";
import { forceString, useParsedPvConnection } from "pv/util";
import { ZoomLevels } from "pv/enumPvValues";
import { useMemo } from "react";

export function OavMover() {
  const DISPLAY_CONFIG_ENDPOINT =
    "/dls_sw/i24/software/daq_configuration/display.configuration";
  const beamCenterQuery = useConfigCall(DISPLAY_CONFIG_ENDPOINT);
  const currentZoomValue = String(
    useParsedPvConnection({
      pv: "ca://BL24I-EA-OAV-01:FZOOM:MP:SELECT",
      label: "zoom-level",
      transformValue: forceString,
    }),
  );
  const zoomIndex = ZoomLevels.findIndex(
    (element) => element == currentZoomValue,
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

  // #Issue 86: Remove these constants - https://github.com/DiamondLightSource/mx-daq-ui/issues/86
  const pixelsPerMicron = 1.25;
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;

  const fullVisit = readVisitFromPv();

  return (
    <div>
      <Grid2 container spacing={2} columns={12}>
        <Grid2 size={9} sx={{ bgcolor: bgColor }}>
          <Box width={"100%"}>
            <OavVideoStream
              pv="ca://BL24I-DI-OAV-01:"
              label="I24 OAV image stream"
              crosshairX={crosshairX}
              crosshairY={crosshairY}
              onCoordClick={(x: number, y: number) => {
                const [x_um, y_um] = [x / pixelsPerMicron, y / pixelsPerMicron];
                console.log(
                  `Clicked on position (${x}, ${y}) (px relative to beam centre) in original stream. Relative position in um (${x_um}, ${y_um}). Submitting to BlueAPI...`,
                );
                const [x_int, y_int] = [Math.round(x), Math.round(y)];
                if (Number.isNaN(x_um) || Number.isNaN(y_um)) {
                  console.log(
                    "Not submitting plan while disconnected from PVs!",
                  );
                } else {
                  // This is an example but not useful for actual production use.
                  submitAndRunPlanImmediately({
                    planName: "gui_gonio_move_on_click",
                    planParams: { position_px: [x_int, y_int] },
                    instrumentSession: parseInstrumentSession(fullVisit),
                  }).catch((error) => {
                    console.log(
                      `Failed to run plan gui_gonio_move_on_click, see console and logs for full error. Reason: ${error}`,
                    );
                  });
                }
              }}
            />
          </Box>
        </Grid2>
        <OAVSideBar />
      </Grid2>
    </div>
  );
}
