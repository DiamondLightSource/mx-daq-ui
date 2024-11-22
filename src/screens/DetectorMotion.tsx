import { Box, Button, Stack, useTheme } from "@mui/material";
import { forceString, PvComponent, PvDescription, PvItem } from "../pv/PvComponent";

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
  const _theme = useTheme();
  return (
    <div>
      <Stack spacing={0}>
        <RoPvBox label="Selected detector" pv="ca://ME14E-MO-IOC-01:GP101" />
        <RoPvBox label="Detector stage position" pv="ca://BL24I-EA-DET-01:Y" />
        <Button>Move stage!</Button>
      </Stack>
    </div>
  );
}
