import { Grid2, useTheme } from "@mui/material";
import { OAVSideBar } from "./OAVSideBar";
import { submitAndRunPlanImmediately } from "#/blueapi/blueapi.ts";
import { readVisitFromPv, parseInstrumentSession } from "#/blueapi/visit.ts";
import { OavVideoStream } from "#/components/OavVideoStream.tsx";
import { useConfigCall } from "#/config_server/configServer.ts";
import { forceString, useParsedPvConnection } from "#/pv/util.ts";
import { ZoomLevels } from "#/pv/enumPvValues.ts";
import { useMemo } from "react";

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

  // #Issue 86: Remove these constants - https://github.com/DiamondLightSource/mx-daq-ui/issues/86
  const pixelsPerMicron = 1.25;
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;

  const fullVisit = readVisitFromPv();

  return (
    <Grid2 container spacing={2} columns={12}>
      <Grid2 size={8} sx={{ bgcolor: bgColor }}>
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
              console.log("Not submitting plan while disconnected from PVs!");
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
      </Grid2>

      <Grid2
        size={4}
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

/*

xs, sm, md, lg, xl

Anything below lg (1200px) will be one column.
Lg and above will have a side bar.
Lg will still have a compact side bar like focus tab being 2x2 grid.
XL can afford to be normal like 4 button wide focus tab.
Anything larger will just have to deal with it for now.

*/
