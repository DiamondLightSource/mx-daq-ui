import {
  KeyboardDoubleArrowLeft,
  KeyboardArrowLeft,
  KeyboardDoubleArrowUp,
  KeyboardArrowUp,
  KeyboardArrowRight,
  KeyboardArrowDown,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { Box, useTheme, Tab, Tabs, Grid2 } from "@mui/material";
import { SelectionWithPlanRunner } from "../../components/SelectionControl";
import { BacklightPositions, ZoomLevels } from "../../pv/enumPvValues";
import { PvDescription } from "../../pv/types";
import { useState } from "react";
import { RunPlanButton } from "blueapi/BlueapiComponents";
import { CoordinateSystem } from "./CoordinateSystem";
import { PresetPositionsSideDrawer } from "./PresetDrawer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const arrowsBoxStyle = {
  maxWidth: 400,
  mx: "auto",
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "10px",
};

function BlockMove(props: TabPanelProps) {
  if (props.value !== props.index) return null;

  return (
    <Box sx={arrowsBoxStyle}>
      <Box /> <Box />
      <RunPlanButton
        btnLabel={"Y - Y"}
        planName={"move_block_on_arrow_click"}
        planParams={{ direction: "up" }}
        btnVariant="outlined"
      />
      <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={"X - X"}
        planName={"move_block_on_arrow_click"}
        planParams={{ direction: "left" }}
        btnVariant="outlined"
      />
      <Box />
      <RunPlanButton
        btnLabel={"X + X"}
        planName={"move_block_on_arrow_click"}
        planParams={{ direction: "right" }}
        btnVariant="outlined"
      />
      <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={"Y + Y"}
        planName={"move_block_on_arrow_click"}
        planParams={{ direction: "down" }}
        btnVariant="outlined"
      />
      <Box /> <Box />
    </Box>
  );
}

function NudgeMove(props: TabPanelProps) {
  if (props.value !== props.index) return null;

  return (
    <Box sx={arrowsBoxStyle}>
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowUp />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "up", size_of_move: "big" }}
        btnVariant="outlined"
      />
      <Box /> <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowUp />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "up", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowLeft />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "left", size_of_move: "big" }}
        btnVariant="outlined"
      />
      <RunPlanButton
        btnLabel={<KeyboardArrowLeft />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "left", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowRight />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "right", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowRight />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "right", size_of_move: "big" }}
        btnVariant="outlined"
      />
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowDown />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "down", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <Box /> <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowDown />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "down", size_of_move: "big" }}
        btnVariant="outlined"
      />
    </Box>
  );
}

function WindowMove(props: TabPanelProps) {
  if (props.value !== props.index) return null;

  return (
    <Box sx={arrowsBoxStyle}>
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowUp />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "up", size_of_move: "big" }}
        btnVariant="outlined"
      />
      <Box /> <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowUp />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "up", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowLeft />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "left", size_of_move: "big" }}
        btnVariant="outlined"
      />
      <RunPlanButton
        btnLabel={<KeyboardArrowLeft />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "left", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowRight />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "right", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowRight />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "right", size_of_move: "big" }}
        btnVariant="outlined"
      />
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowDown />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "down", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <Box /> <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowDown />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "down", size_of_move: "big" }}
        btnVariant="outlined"
      />
    </Box>
  );
}

export function OAVSideBar() {
  return (
    <Grid2
      size={3}
      sx={{
        height: "95vh", // Height set to 95vh to span height of screen but to also leave 5vh space for the top navigation header.
        overflowY: "auto",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      <MoveArrows />
      <Grid2 size={3} padding={1} />
      <BacklightControl
        label="backlight-pos"
        pv="ca://BL24I-MO-BL-01:MP:SELECT"
      />
      <ZoomControl
        label="zoom-level"
        pv="ca://BL24I-EA-OAV-01:FZOOM:MP:SELECT"
      />
      <hr />
      <CoordinateSystem />
      <hr />
      <PresetPositionsSideDrawer />
    </Grid2>
  );
}

export function MoveArrows() {
  const theme = useTheme();

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            "& .MuiTab-root.Mui-selected": {
              color: theme.palette.secondary.main,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
          centered
        >
          <Tab label="Nudge" />
          <Tab label="Window" />
          <Tab label="Block" />
        </Tabs>
      </Box>
      <NudgeMove value={value} index={0} />
      <WindowMove value={value} index={1} />
      <BlockMove value={value} index={2} />
    </Box>
  );
}

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
