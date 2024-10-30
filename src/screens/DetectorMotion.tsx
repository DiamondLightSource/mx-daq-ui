import { Button, Stack, useTheme } from "@mui/material";
import { PollingRoPvBox } from "../pv/Pv";
import { PvDTypes } from "../pv/PvUtils";

export function DetectorMotionTabPanel() {
  const _theme = useTheme();
  return (
    <div>
      <Stack spacing={2}>
        <PollingRoPvBox label="Detector" pv="ME14E-MO-IOC-01:GP101" dType={PvDTypes.String} />
        <PollingRoPvBox label="Detector stage position" pv="BL24I-EA-DET-01:Y" />
        <Button>Move stage!</Button>
      </Stack>
    </div>
  );
}
