import { Grid2 } from "@mui/material";
import { CoordinateSystem } from "./OAVCoordinateSystem";
import { PresetPositionsSideDrawer } from "./OAVPresetDrawer";
import { MoveArrows } from "./OAVMoveController";
import { BacklightControl, ZoomControl } from "./OAVDeviceSettings";

export function OAVSideBar() {
  return (
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
  );
}
