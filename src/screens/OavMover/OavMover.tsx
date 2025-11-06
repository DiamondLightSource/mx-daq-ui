import { Box, Grid2, useTheme } from "@mui/material";
import { OavVideoStream } from "../../components/OavVideoStream";
import { useState, createContext } from "react";

import { submitAndRunPlanImmediately } from "../../blueapi/blueapi";
import { parseInstrumentSession, readVisitFromPv } from "../../blueapi/visit";
import { BeamCentre, PixelsToMicrons } from "./OavControlHelper";
import { CoordinateSystem } from "./CoordinateSystem";
import { PresetPositionsSideDrawer } from "./PresetDrawer";
import { BacklightControl, MoveArrows, ZoomControl } from "./OavSideBar";

interface CrosshairContextType {
  crosshairX: number;
  crosshairY: number;
  setCrosshairX: React.Dispatch<React.SetStateAction<number>>;
  setCrosshairY: React.Dispatch<React.SetStateAction<number>>;
}

export const crosshairContext = createContext<CrosshairContextType | null>(
  null,
);

export function OavMover() {
  const [crosshairX, setCrosshairX] = useState<number>(200);
  const [crosshairY, setCrosshairY] = useState<number>(200);
  const [pixelsPerMicron, setPixelsPerMicron] = useState<number>(1.25);
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
        <Grid2
          size={3}
          sx={{
            height: "95vh", // Height set to 95vh to span height of screen but to also leave 5vh space for the top navigation header.
            overflowY: "auto",
            padding: 2,
            boxSizing: "border-box",
          }}
        >
          <MoveArrows />
          <Grid2 size={3} padding={1} />
          <crosshairContext.Provider
            value={{ crosshairX, crosshairY, setCrosshairX, setCrosshairY }}
          >
            <BeamCentre />
          </crosshairContext.Provider>
          <PixelsToMicrons setPixelsPerMicron={setPixelsPerMicron} />
          <BacklightControl
            label="backlight-pos"
            pv="ca://BL24I-MO-BL-01:MP:SELECT"
          />
          <ZoomControl
            label="zoom-level"
            pv="ca://BL24I-EA-OAV-01:FZOOM:MP:SELECT"
          />
          <hr />
          <CoordinateSystem />
          <hr />
          <PresetPositionsSideDrawer />
        </Grid2>
      </Grid2>
    </div>
  );
}
