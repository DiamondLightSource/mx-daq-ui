import { Divider } from "@mui/material";
import { CoordinateSystem } from "./OAVCoordinateSystem";
import { PresetPositionsSideDrawer } from "./OAVPresetDrawer";
import { MoveArrows } from "./OAVMoveController";
import { BacklightControl, ZoomControl } from "./OAVDeviceSettings";

export function OAVSideBar() {
  return (
    <>
      <Divider sx={{ my: 1 }}>OAV Movement Controller</Divider>
      <MoveArrows />
      <Divider sx={{ my: 1 }}>OAV Stats</Divider>
      <BacklightControl
        label="backlight-pos"
        pv="ca://BL24I-MO-BL-01:MP:SELECT"
      />
      <ZoomControl
        label="zoom-level"
        pv="ca://BL24I-EA-OAV-01:FZOOM:MP:SELECT"
      />
      <CoordinateSystem />
      <Divider sx={{ my: 1 }}>Preset Positions</Divider>
      <PresetPositionsSideDrawer />
    </>
  );
}
