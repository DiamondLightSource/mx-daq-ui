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
  Tooltip,
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
import { PvDescription } from "../pv/PvComponent";
import { SelectionWithPlanRunner } from "../components/SelectionControl";
import { BacklightPositions, ZoomLevels } from "../pv/enumPvValues";
import oxfordChipDiagram from "../assets/Oxford Chip Diagram.excalidraw.svg";

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
      <Grid2>
        <Tooltip title={"Move into position for collection"}>
          <Button
            style={buttonStyle}
            onClick={() =>
              submitAndRunPlanImmediately("moveto_preset", {
                place: "collect_position",
              })
            }
          >
            Collect Position
          </Button>
        </Tooltip>

        <Tooltip title={"Move hardware for sample loading"}>
          <Button
            style={buttonStyle}
            onClick={() =>
              submitAndRunPlanImmediately("moveto_preset", {
                place: "load_position",
              })
            }
          >
            Load Position
          </Button>
        </Tooltip>
        <Tooltip title={"Align microdrop"}>
          <Button
            style={buttonStyle}
            onClick={() =>
              submitAndRunPlanImmediately("moveto_preset", {
                place: "microdrop_position",
              })
            }
          >
            Microdrop Align
          </Button>
        </Tooltip>
      </Grid2>
    </Box>
  );
}

export function SideDrawer() {
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
        <Grid2 container rowSpacing={0} spacing={1}>
          <Grid2 size={10}>
            <b>Co-ordinate System Setup</b>
          </Grid2>
          <Grid2>
            <Help onClick={handleClickOpen} />
          </Grid2>
          <Grid2 size={4}>
            <Button
              style={buttonStyle}
              onClick={() =>
                submitAndRunPlanImmediately("moveto", {
                  place: "zero",
                })
              }
            >
              Go to Origin
            </Button>
          </Grid2>
          <Grid2 size={4}>
            <Button
              style={buttonStyle}
              onClick={() =>
                submitAndRunPlanImmediately("moveto", {
                  place: "f1",
                })
              }
            >
              Go to Fiducial 1
            </Button>
          </Grid2>
          <Grid2 size={4}>
            <Button
              style={buttonStyle}
              onClick={() =>
                submitAndRunPlanImmediately("moveto", {
                  place: "f2",
                })
              }
            >
              Go to Fiducial 2
            </Button>
          </Grid2>
          <Grid2 size={4}>
            <Button style={buttonStyle}>Set Fiducial 0</Button>
          </Grid2>
          <Grid2 size={4}>
            <Button
              style={buttonStyle}
              onClick={() =>
                submitAndRunPlanImmediately("fiducial", {
                  point: "1",
                })
              }
            >
              Set Fiducial 1
            </Button>
          </Grid2>
          <Grid2 size={4}>
            <Button
              style={buttonStyle}
              onClick={() =>
                submitAndRunPlanImmediately("fiducial", {
                  point: "2",
                })
              }
            >
              Set Fiducial 2
            </Button>
          </Grid2>
          <Grid2 size={6}>
            <Button
              style={buttonStyle}
              onClick={() => submitAndRunPlanImmediately("cs_maker", {})}
            >
              Make Coordinate System
            </Button>
          </Grid2>
          <Grid2 size={6}>
            <Button
              style={buttonStyle}
              onClick={() => submitAndRunPlanImmediately("block_check", {})}
            >
              Block Check
            </Button>
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
                  submitAndRunPlanImmediately("gui_gonio_move_on_click", {
                    position_px: [x_int, y_int],
                  });
                }
              }}
            />
          </Box>
        </Grid2>
        <Grid2
          size={3}
          sx={{
            height: "95vh",
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
          <SideDrawer />
        </Grid2>
      </Grid2>
    </div>
  );
}
