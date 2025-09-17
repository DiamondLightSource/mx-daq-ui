import { Stack, Box, useTheme } from "@mui/material";
import { RoPvBox } from "../pv/PvComponent";
import { RunPlanButton } from "../blueapi/BlueapiComponents";

function DetectorState() {
  const theme = useTheme();
  return (
    <Stack spacing={2} direction={"row"}>
      <Box color={theme.palette.info.main}>
        <p>Detector State</p>
      </Box>
      <RoPvBox label="P6M" pv="ca://BL24I-EA-PILAT-01:cam1:DetectorState_RBV" />
      <RoPvBox label="E9M" pv="ca://BL24I-EA-EIGER-01:CAM:DetectorState_RBV" />
    </Stack>
  );
}

export function DetectorMotionTabPanel() {
  return (
    <Box>
      <Stack spacing={2} alignItems={"center"}>
        <RoPvBox label="Selected detector" pv="ca://ME14E-MO-IOC-01:GP101" />
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
          <RunPlanButton
            btnLabel="Move to Pilatus!"
            planName="gui_move_detector"
            planParams={{ det: "pilatus" }}
            title="Move the detector stage for Pilatus collection"
            btnVariant="contained"
          />
        </Stack>
        <DetectorState />
      </Stack>
    </Box>
  );
}
