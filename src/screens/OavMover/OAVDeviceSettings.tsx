import { SelectionWithPlanRunner } from "#/components/SelectionControl.tsx";
import { BacklightPositions, ZoomLevels } from "#/pv/enumPvValues.ts";
import { PvDescription } from "#/pv/types.ts";
import { Box, useTheme } from "@mui/material";

export function BacklightControl(props: PvDescription) {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <SelectionWithPlanRunner
        pv={props.pv}
        label={props.label}
        id="Backlight"
        plan_name="gui_move_backlight"
        choices={BacklightPositions}
      />
    </Box>
  );
}

export function ZoomControl(props: PvDescription) {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <SelectionWithPlanRunner
        pv={props.pv}
        label={props.label}
        id="ZoomControl"
        plan_name="gui_set_zoom_level"
        choices={ZoomLevels}
      />
    </Box>
  );
}
