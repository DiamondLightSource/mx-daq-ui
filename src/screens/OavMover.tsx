import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
  Drawer,
} from "@mui/material";
import { OavVideoStream } from "../components/OavVideoStream";
import {
  ArrowBackRounded,
  ArrowDownwardRounded,
  ArrowForwardRounded,
  ArrowUpwardRounded,
  Close,
  Help,
} from "@mui/icons-material";
import { useState } from "react";

import React from "react";
import { submitAndRunPlanImmediately } from "../blueapi/blueapi";
import { CoordNumberInput } from "../components/CoordNumberInput";
import { PvDescription } from "../pv/types";
import { SelectionWithPlanRunner } from "../components/SelectionControl";
import { BacklightPositions, ZoomLevels } from "../pv/enumPvValues";
import oxfordChipDiagram from "../assets/Oxford Chip Diagram.excalidraw.svg";
import { RunPlanButton } from "../blueapi/BlueapiComponents";

const buttonStyle = {
  color: "white",
  margin: "5px",
  padding: "15px",
  backgroundColor: "#1c2025",
};

function BacklightControl(props: PvDescription) {
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

function ZoomControl(props: PvDescription) {
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

export function MoveArrows() {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <Grid2 container spacing={0} columns={3}>
        <Grid2 size={3}>
          <b>Nudge sample:</b>
        </Grid2>
        <Grid2 size={1} />{" "}
        <Grid2 size={1}>
          <Button>
            <ArrowUpwardRounded />
          </Button>
        </Grid2>{" "}
        <Grid2 size={1} />
        <Grid2 size={1}>
          <Button>
            <ArrowBackRounded />
          </Button>
        </Grid2>{" "}
        <Grid2 size={1} />
        <Grid2 size={1}>
          <Button>
            <ArrowForwardRounded />
          </Button>
        </Grid2>{" "}
        <Grid2 size={1} />{" "}
        <Grid2 size={1}>
          <Button>
            <ArrowDownwardRounded />
          </Button>
        </Grid2>{" "}
        <Grid2 size={1} />
      </Grid2>
    </Box>
  );
}

export function BeamCentre({
  setCrosshairX,
  setCrosshairY,
}: {
  setCrosshairX: React.Dispatch<React.SetStateAction<number>>;
  setCrosshairY: React.Dispatch<React.SetStateAction<number>>;
}) {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <Grid2 container spacing={0} columns={3}>
        <Grid2 size={3} padding={1}>
          <b>Beam center:</b>
        </Grid2>
        <Grid2 size={3}>
          <Stack direction="row" spacing={2} padding={2}>
            <CoordNumberInput
              placeholder="x"
              onChange={(_e, val) => setCrosshairX(val ? val : 0)}
              defaultValue={200}
              min={0}
              max={1000}
              aria-label="X"
            />
            <CoordNumberInput
              placeholder="y"
              onChange={(_e, val) => setCrosshairY(val ? val : 0)}
              defaultValue={200}
              min={0}
              max={750}
              aria-label="Y"
            />
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export function PixelsToMicrons({
  setPixelsPerMicron,
}: {
  setPixelsPerMicron: React.Dispatch<React.SetStateAction<number>>;
}) {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <Grid2 container spacing={0} columns={3}>
        <Grid2 size={3}>
          <Stack direction="row" spacing={2} padding={2}>
            <TextField
              label="Pixels per micron"
              onChange={(e) =>
                setPixelsPerMicron(
                  Number(e.target.value) ? Number(e.target.value) : 0
                )
              }
              defaultValue={1.25}
              aria-label="Pixels per micron"
            />
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export function PresetMovements() {
  return (
    <Box sx={{ textAlign: `center` }}>
      <p>
        <b>Preset Positions</b>
      </p>
      <Stack padding={"20px"} margin={"10px"} spacing={1}>
        <RunPlanButton
          btnLabel="Collect Position"
          planName="moveto_preset"
          planParams={{ place: "collect_position" }}
          title="Move into position for collection"
          btnSize="small"
        />
        <RunPlanButton
          btnLabel="Load Position"
          planName="moveto_preset"
          planParams={{ place: "load_position" }}
          title="Move hardware for sample loading"
          btnSize="small"
        />
        <RunPlanButton
          btnLabel="Microdrop align"
          planName="moveto_preset"
          planParams={{ place: "microdrop_position" }}
          title="Align microdrop"
          btnSize="small"
        />
      </Stack>
    </Box>
  );
}

export function PresetPositionsSideDrawer() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <Button style={buttonStyle} onClick={toggleDrawer(true)}>
        Preset Positions
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <PresetMovements />
      </Drawer>
    </>
  );
}

export function CoordinateSystem() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const buttonStyle = {
    color: "white",
    padding: "12px",
    backgroundColor: "#1c2025",
    width: "100%",
    height: "85%",
  };

  return (
    <>
      <Box>
        <Grid2 container alignItems={"center"} rowSpacing={1} spacing={0.5}>
          <Grid2 size={10}>
            <b>Co-ordinate System Setup</b>
          </Grid2>
          <Grid2>
            <Help onClick={handleClickOpen} />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Go to origin"
              planName="moveto"
              planParams={{ place: "zero" }}
              title="Go to Fiducial 0"
              btnVariant="contained"
              btnSize="large"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Go to Fiducial1"
              planName="moveto"
              planParams={{ place: "f1" }}
              title="Go to Fiducial 1"
              btnVariant="contained"
              btnSize="large"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Go to Fiducial2"
              planName="moveto"
              planParams={{ place: "f2" }}
              title="Go to Fiducial 2"
              btnVariant="contained"
              btnSize="large"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Set Fiducial0"
              planName="gui_set_fiducial_0"
              title="Set Fiducial 0"
              btnVariant="contained"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Set Fiducial1"
              planName="fiducial"
              planParams={{ point: "1" }}
              title="Set Fiducial 1"
              btnVariant="contained"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Set Fiducial2"
              planName="fiducial"
              planParams={{ point: "2" }}
              title="Set Fiducial 2"
              btnVariant="contained"
            />
          </Grid2>
          <Grid2 size={6}>
            <RunPlanButton
              btnLabel="Make Coord System"
              planName="cs_maker"
              title="Create the coordinate system on the pmac."
              btnVariant="contained"
            />
          </Grid2>
          <Grid2 size={6}>
            <RunPlanButton
              btnLabel="Run block check"
              planName="block_check"
              title="Check the coordinate system was set up correctly."
              btnVariant="contained"
            />
          </Grid2>
        </Grid2>
      </Box>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          How to use Co-ordinate System Setup
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <img src={oxfordChipDiagram} alt="" />
          <Typography gutterBottom>
            Fiducial alignment for an Oxford type chip. Fiducial 0 is the
            origin, the top left corner. Fiducial 1 is the top right corner and
            Fiducial 2 is the bottom left corner.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function OavMover() {
  const [crosshairX, setCrosshairX] = useState<number>(200);
  const [crosshairY, setCrosshairY] = useState<number>(200);
  const [pixelsPerMicron, setPixelsPerMicron] = useState<number>(1.25);
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <div>
      <Grid2 container spacing={2} columns={12}>
        <Grid2 size={9} sx={{ bgcolor: bgColor }}>
          <Box width={"100%"}>
            <OavVideoStream
              pv="ca://BL24I-DI-OAV-01:"
              label="I24 OAV image stream"
              crosshairX={crosshairX}
              crosshairY={crosshairY}
              onCoordClick={(x: number, y: number) => {
                const [x_um, y_um] = [x / pixelsPerMicron, y / pixelsPerMicron];
                console.log(
                  `Clicked on position (${x}, ${y}) (px relative to beam centre) in original stream. Relative position in um (${x_um}, ${y_um}). Submitting to BlueAPI...`
                );
                const [x_int, y_int] = [Math.round(x), Math.round(y)];
                if (Number.isNaN(x_um) || Number.isNaN(y_um)) {
                  console.log(
                    "Not submitting plan while disconnected from PVs!"
                  );
                } else {
                  submitAndRunPlanImmediately({
                    planName: "gui_gonio_move_on_click",
                    planParams: {
                      position_px: [x_int, y_int],
                    },
                  });
                }
              }}
            />
          </Box>
        </Grid2>
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
          <BeamCentre
            setCrosshairX={setCrosshairX}
            setCrosshairY={setCrosshairY}
          />
          <PixelsToMicrons setPixelsPerMicron={setPixelsPerMicron} />
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
      </Grid2>
    </div>
  );
}
