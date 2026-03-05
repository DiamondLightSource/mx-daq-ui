import { RunPlanButton } from "#/blueapi/BlueapiComponents.tsx";
import { useContext } from "react";
import { BeamCenterContext } from "#/context/beamcenter/BeamCenterContext.ts";
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
import { Box, Tabs, Tab, useTheme, useMediaQuery } from "@mui/material";
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

const arrowsScreenSizing = {
  minWidth: {
    md: "16px",
    lg: "32px",
    xl: "64px",
  },
  width: {
    md: "32px",
  },
};

function BlockMove(props: TabPanelProps & { onMoveSuccess?: () => void }) {
  if (props.value !== props.index) return null;

  return (
    <Box sx={arrowsBoxStyle}>
      <Box /> <Box />
      <RunPlanButton
        btnLabel={"Y - Y"}
        planName={"move_block_on_arrow_click"}
        planParams={{ direction: "up" }}
        btnVariant="outlined"
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={"X - X"}
        planName={"move_block_on_arrow_click"}
        planParams={{ direction: "left" }}
        btnVariant="outlined"
        onSuccess={props.onMoveSuccess}
      />
      <Box />
      <RunPlanButton
        btnLabel={"X + X"}
        planName={"move_block_on_arrow_click"}
        planParams={{ direction: "right" }}
        btnVariant="outlined"
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={"Y + Y"}
        planName={"move_block_on_arrow_click"}
        planParams={{ direction: "down" }}
        btnVariant="outlined"
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box />
    </Box>
  );
}

function NudgeMove(props: TabPanelProps & { onMoveSuccess?: () => void }) {
  if (props.value !== props.index) return null;

  return (
    <Box sx={arrowsBoxStyle}>
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowUp />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "up", size_of_move: "big" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowUp />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "up", size_of_move: "small" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowLeft />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "left", size_of_move: "big" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <RunPlanButton
        btnLabel={<KeyboardArrowLeft />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "left", size_of_move: "small" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowRight />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "right", size_of_move: "small" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowRight />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "right", size_of_move: "big" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowDown />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "down", size_of_move: "small" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowDown />}
        planName={"move_nudge_on_arrow_click"}
        planParams={{ direction: "down", size_of_move: "big" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
    </Box>
  );
}

function WindowMove(props: TabPanelProps & { onMoveSuccess?: () => void }) {
  if (props.value !== props.index) return null;

  return (
    <Box sx={arrowsBoxStyle}>
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowUp />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "up", size_of_move: "big" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowUp />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "up", size_of_move: "small" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowLeft />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "left", size_of_move: "big" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <RunPlanButton
        btnLabel={<KeyboardArrowLeft />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "left", size_of_move: "small" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowRight />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "right", size_of_move: "small" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowRight />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "right", size_of_move: "big" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardArrowDown />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "down", size_of_move: "small" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
      <Box /> <Box /> <Box /> <Box />
      <RunPlanButton
        btnLabel={<KeyboardDoubleArrowDown />}
        planName={"move_window_on_arrow_click"}
        planParams={{ direction: "down", size_of_move: "big" }}
        btnVariant="outlined"
        sx={arrowsScreenSizing}
        onSuccess={props.onMoveSuccess}
      />
    </Box>
  );
}

function FocusMove(props: TabPanelProps & { onMoveSuccess?: () => void }) {
  if (props.value !== props.index) return null;
  const focus_move = [
    { direction: "in", size_of_move: "big", label: "IN x3" },
    { direction: "in", size_of_move: "small", label: "IN" },
    { direction: "out", size_of_move: "small", label: "OUT" },
    { direction: "out", size_of_move: "big", label: "OUT x3" },
  ];

  return (
    <Box
      sx={{
        ...arrowsBoxStyle,
        py: 2,
        gridTemplateColumns: { lg: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" },
      }}
    >
      {focus_move.map((move) => (
        <RunPlanButton
          key={`${move.direction}-${move.size_of_move}`}
          btnLabel={move.label}
          planName={"focus_on_oav_view"}
          planParams={{
            direction: move.direction,
            size_of_move: move.size_of_move,
          }}
          btnVariant="outlined"
          onSuccess={props.onMoveSuccess}
        />
      ))}
    </Box>
  );
}

export function MoveArrows() {
  const theme = useTheme();
  const beamCenterQuery = useContext(BeamCenterContext);
  const [value, setValue] = useState(0);
  const isSmall = useMediaQuery(theme.breakpoints.down("xl"));

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabStyling = {
    "& .MuiTabs-flexContainer": {
      flexWrap: isSmall ? "wrap" : "nowrap",
    },
    "& .MuiTab-root": {
      minWidth: isSmall ? "50%" : "25%",
      maxWidth: isSmall ? "50%" : "none",
    },
    "& .MuiTab-root.Mui-selected": {
      color: theme.palette.secondary.main,
    },
    "& .MuiTabs-indicator": {
      display: isSmall ? "none" : "block",
      backgroundColor: theme.palette.secondary.dark,
    },
  };

  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={value} onChange={handleChange} sx={tabStyling} centered>
          <Tab label="Nudge" />
          <Tab label="Window" />
          <Tab label="Block" />
          <Tab label="Focus" />
        </Tabs>
      </Box>
      <NudgeMove
        value={value}
        index={0}
        onMoveSuccess={() => {
          beamCenterQuery?.refetch();
        }}
      />
      <WindowMove
        value={value}
        index={1}
        onMoveSuccess={() => beamCenterQuery?.refetch()}
      />
      <BlockMove
        value={value}
        index={2}
        onMoveSuccess={() => beamCenterQuery?.refetch()}
      />
      <FocusMove
        value={value}
        index={3}
        onMoveSuccess={() => beamCenterQuery?.refetch()}
      />
    </Box>
  );
}
