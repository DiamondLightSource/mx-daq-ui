import { Grid2 } from "@mui/material";
import { CoordinateSystem } from "./OAVCoordinateSystem";
import { PresetPositionsSideDrawer } from "./OAVPresetDrawer";
import { MoveArrows } from "./OAVMoveController";
import { BacklightControl, ZoomControl } from "./OAVDeviceSettings";

export function OAVSideBar() {
  return (
    <>
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
    </>
  );
}
