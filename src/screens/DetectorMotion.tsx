import { Box, Button, Stack } from "@mui/material";
import { PvComponent, PvDescription, PvItem } from "../pv/PvComponent";
import { forceString } from "../pv/util";
import { submitAndRunPlanImmediately } from "../blueapi/blueapi";

function RoPvBox(props: PvDescription) {
  return PvComponent({
    ...props,
    render: (props: PvItem) => {
      return (
        <Box>
          <p>
            {props.label} : {forceString(props.value)}
          </p>
        </Box>
      );
    },
  });
}

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
            onClick={() =>
              submitAndRunPlanImmediately("gui_move_detector", { det: "eiger" })
            }
          >
            Move to Eiger!
          </Button>
          <Button
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
