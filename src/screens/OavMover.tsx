import {
  Box,
  Button,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { OavVideoStream } from "../components/OavVideoStream";
import {
  ArrowBackRounded,
  ArrowDownwardRounded,
  ArrowForwardRounded,
  ArrowUpwardRounded,
} from "@mui/icons-material";
import { useState } from "react";

import React from "react";
import { submitAndRunPlanImmediately } from "../blueapi/blueapi";
import { CoordNumberInput } from "../components/CoordNumberInput";

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

const ZoomValues = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 11.0];

export function ZoomControl() {
  const theme = useTheme();
  const [zoomVal, setZoom] = React.useState<number>(ZoomValues[0]);
  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <FormControl size="small" style={{ width: 150 }}>
        <InputLabel id="zoom-label">zoomControl</InputLabel>
        <Select
          labelId="zoom-label"
          id="zoom"
          value={zoomVal}
          label="zoomControl"
          // This will change value on dropdown but nothing else because setZoom does not return number
          // mmmh ...
          onChange={(e) =>
            submitAndRunPlanImmediately(
              "gui_set_zoom",
              setZoom(Number(e.target.value))
            )
          }
        >
          {ZoomValues.map((zoomVal) => (
            <MenuItem key={zoomVal} value={zoomVal}>
              {zoomVal}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
        <Grid2 size={3} height={3}>
          <MoveArrows />
          <Grid2 size={3} padding={1} />
          {/* <BeamCentre
            setCrosshairX={setCrosshairX}
            setCrosshairY={setCrosshairY}
          />
          <PixelsToMicrons setPixelsPerMicron={setPixelsPerMicron} /> */}
          <ZoomControl />
        </Grid2>
      </Grid2>
    </div>
  );
}
