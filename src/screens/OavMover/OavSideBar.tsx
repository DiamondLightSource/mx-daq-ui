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
import { Box, Grid2, Button, useTheme, Tab, Tabs } from "@mui/material";
import { SelectionWithPlanRunner } from "../../components/SelectionControl";
import { BacklightPositions, ZoomLevels } from "../../pv/enumPvValues";
import { PvDescription } from "../../pv/types";
import { useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const buttonStyle = {
  color: "white",
  border: "2px solid #423a3aff",
};

function BlockMove(props: TabPanelProps) {
  if (props.value !== props.index) return null;

  return (
    <Grid2 container spacing={0} columns={5}>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>Y-Y</Button>
      </Grid2>
      <Grid2 size={2} />
      <Grid2 size={1} offset={1}>
        <Button sx={buttonStyle}>X-X</Button>
      </Grid2>
      <Grid2 size={1} offset={1}>
        <Button sx={buttonStyle}>X+X</Button>
      </Grid2>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>Y+Y</Button>
      </Grid2>
    </Grid2>
  );
}

function NudgeMove(props: TabPanelProps) {
  if (props.value !== props.index) return null;

  return (
    <Grid2 container spacing={0} columns={5}>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>
          <KeyboardDoubleArrowUp />
        </Button>
      </Grid2>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>
          <KeyboardArrowUp />
        </Button>
      </Grid2>
      <Grid2 size={2} />
      <Grid2 size={1}>
        <Button sx={buttonStyle}>
          <KeyboardDoubleArrowLeft />
        </Button>
      </Grid2>
      <Grid2 size={1}>
        <Button sx={buttonStyle}>
          <KeyboardArrowLeft />
        </Button>
      </Grid2>
      <Grid2 size={1} offset={1}>
        <Button sx={buttonStyle}>
          <KeyboardArrowRight />
        </Button>
      </Grid2>
      <Grid2 size={1}>
        <Button sx={buttonStyle}>
          <KeyboardDoubleArrowRight />
        </Button>
      </Grid2>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>
          <KeyboardArrowDown />
        </Button>
      </Grid2>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>
          <KeyboardDoubleArrowDown />
        </Button>
      </Grid2>
    </Grid2>
  );
}

function WindowMove(props: TabPanelProps) {
  if (props.value !== props.index) return null;

  return (
    <Grid2 container spacing={0} columns={5}>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>
          <KeyboardDoubleArrowUp />
        </Button>
      </Grid2>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>
          <KeyboardArrowUp />
        </Button>
      </Grid2>
      <Grid2 size={2} />
      <Grid2 size={1}>
        <Button sx={buttonStyle}>
          <KeyboardDoubleArrowLeft />
        </Button>
      </Grid2>
      <Grid2 size={1}>
        <Button sx={buttonStyle}>
          <KeyboardArrowLeft />
        </Button>
      </Grid2>
      <Grid2 size={1} offset={1}>
        <Button sx={buttonStyle}>
          <KeyboardArrowRight />
        </Button>
      </Grid2>
      <Grid2 size={1}>
        <Button sx={buttonStyle}>
          <KeyboardDoubleArrowRight />
        </Button>
      </Grid2>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>
          <KeyboardArrowDown />
        </Button>
      </Grid2>
      <Grid2 size={1} offset={2}>
        <Button sx={buttonStyle}>
          <KeyboardDoubleArrowDown />
        </Button>
      </Grid2>
    </Grid2>
  );
}

export function MoveArrows() {
  const theme = useTheme();

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    console.log("Value changed to", newValue);

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
            "& .Mui-selected": {
              color: theme.palette.secondary.main,
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
