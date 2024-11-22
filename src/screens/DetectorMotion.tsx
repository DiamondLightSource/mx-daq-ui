import { Button, Stack, useTheme } from "@mui/material";

export function DetectorMotionTabPanel() {
  const _theme = useTheme();
  return (
    <div>
      <Stack spacing={0}>
        {/* <PollingRoPvBox
          label="Selected detector"
          pv="ME14E-MO-IOC-01:GP101"
          dType={PvDTypes.String}
          preTransformValue={makeStringTransform({ "1": "Eiger", "0": "Pilatus" })}
        />
        <PollingRoPvBox label="Detector stage position" pv="BL24I-EA-DET-01:Y" /> */}
        <Button>Move stage!</Button>
      </Stack>
    </div>
  );
}
