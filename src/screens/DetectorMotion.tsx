import { Button, Stack, Box, useTheme } from "@mui/material";
import { RoPvBox } from "../pv/PvComponent";
import { submitAndRunPlanImmediately } from "../blueapi/blueapi";

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
          <Button
            color="custom"
            onClick={() =>
              submitAndRunPlanImmediately("gui_move_detector", { det: "eiger" })
            }
          >
            Move to Eiger!
          </Button>
          <Button
            color="custom"
            onClick={() =>
              submitAndRunPlanImmediately("gui_move_detector", {
                det: "pilatus",
              })
            }
          >
            Move to Pilatus!
          </Button>
        </Stack>
        <DetectorState />
      </Stack>
    </Box>
  );
}
