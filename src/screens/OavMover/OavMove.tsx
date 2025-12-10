import {
  KeyboardDoubleArrowUp,
  KeyboardArrowUp,
  KeyboardDoubleArrowLeft,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowRight,
  KeyboardArrowDown,
  KeyboardDoubleArrowDown,
} from "@mui/icons-material";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import { RunPlanButton } from "blueapi/BlueapiComponents";
import { useState } from "react";

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

function FocusMove(props: TabPanelProps) {
  if (props.value !== props.index) return null;

  return (
    <Box
      sx={{ ...arrowsBoxStyle, py: 2, gridTemplateColumns: "repeat(4, 1fr)" }}
    >
      <RunPlanButton
        btnLabel={"IN x3"}
        planName={"focus_on_oav_view"}
        planParams={{ direction: "in", size_of_move: "big" }}
        btnVariant="outlined"
      />
      <RunPlanButton
        btnLabel={"IN"}
        planName={"focus_on_oav_view"}
        planParams={{ direction: "in", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <RunPlanButton
        btnLabel={"OUT"}
        planName={"focus_on_oav_view"}
        planParams={{ direction: "out", size_of_move: "small" }}
        btnVariant="outlined"
      />
      <RunPlanButton
        btnLabel={"OUT x3"}
        planName={"focus_on_oav_view"}
        planParams={{ direction: "out", size_of_move: "big" }}
        btnVariant="outlined"
      />
    </Box>
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
          <Tab label="Focus" />
        </Tabs>
      </Box>
      <NudgeMove value={value} index={0} />
      <WindowMove value={value} index={1} />
      <BlockMove value={value} index={2} />
      <FocusMove value={value} index={3} />
    </Box>
  );
}
