import { Stack, Box, useTheme } from "@mui/material";
import { RoPvBox } from "pv/PvComponent";
import { RunPlanButton } from "blueapi/BlueapiComponents";

function DetectorState() {
  const theme = useTheme();
  return (
    <Stack spacing={2} direction={"row"}>
      <Box color={theme.palette.info.main}>
        <p>Detector State</p>
      </Box>
      <RoPvBox label="E9M" pv="ca://BL24I-EA-EIGER-01:CAM:DetectorState_RBV" />
    </Stack>
  );
}

export function DetectorMotionTabPanel() {
  return (
    <Box>
      <Stack spacing={2} alignItems={"center"}>
        <RoPvBox label="Selected detector" pv="ca://BL24I-MO-IOC-13:GP101" />
        <RoPvBox
          label="Detector stage y position"
          pv="ca://BL24I-EA-DET-01:Y"
        />
        <RoPvBox
          label="Detector stage z position"
          pv="ca://BL24I-EA-DET-01:Z"
        />
        <Stack direction={"row"} spacing={5} justifyContent={"center"}>
          <RunPlanButton
            btnLabel="Move to Eiger!"
            planName="gui_move_detector"
            planParams={{ det: "eiger" }}
            title="Move the detector stage for Eiger collection"
            btnVariant="contained"
          />
        </Stack>
        <DetectorState />
      </Stack>
    </Box>
  );
}
