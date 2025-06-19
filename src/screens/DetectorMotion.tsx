import { Button, Stack } from "@mui/material";
import { RoPvBox } from "../pv/PvComponent";
import { submitAndRunPlanImmediately } from "../blueapi/blueapi";

export function DetectorMotionTabPanel() {
  return (
    <div>
      <Stack spacing={1}>
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
      </Stack>
    </div>
  );
}
