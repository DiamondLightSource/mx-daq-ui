import { Box, Grid2, useTheme } from "@mui/material";
import { OAVSideBar } from "./OAVSideBar";
import { submitAndRunPlanImmediately } from "#/blueapi/blueapi.ts";
import { readVisitFromPv, parseInstrumentSession } from "#/blueapi/visit.ts";
import { OavVideoStream } from "#/components/OavVideoStream.tsx";

export function OavMover() {
  // #Issue 86: Remove these constants - https://github.com/DiamondLightSource/mx-daq-ui/issues/86
  const crosshairX = 200;
  const crosshairY = 200;
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
