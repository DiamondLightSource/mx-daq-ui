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
import { useParsedPvConnection, PvDescription } from "../pv/PvComponent";

const BacklightPositions = [
  "Out",
  "In",
  "LoadCheck",
  "OAV2",
  "Diode",
  "White In",
];

export function BacklightControl(props: PvDescription) {
  const theme = useTheme();
  const currentPos = String(
    useParsedPvConnection({
      pv: props.pv,
      label: props.label,
    })
  );
  // This thing actually returns `DType: In` instead of just the string, which is why it isn't rendered
  // Maybe need something like for visit. Mmmh TBC
  console.log(`Backlight position: ${currentPos}`);
  const [blPos, moveBl] = React.useState<string>();

  const handleChange = (newValue: string) => {
    moveBl(newValue);
    submitAndRunPlanImmediately("gui_move_backlight", { position: newValue });
  };

  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <FormControl size="small" style={{ width: 150 }}>
        <InputLabel id="bl-label">backlight</InputLabel>
        <Select
          labelId="bl-label"
          id="backlight"
          value={blPos}
          label="blControl"
          // renderValue={currentPos}
          defaultValue={currentPos.toString().slice(7)}
          onChange={(e) => handleChange(String(e.target.value))}
        >
          {BacklightPositions.map((blPos) => (
            <MenuItem key={blPos} value={blPos}>
              {blPos}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
          <BeamCentre
            setCrosshairX={setCrosshairX}
            setCrosshairY={setCrosshairY}
          />
          <PixelsToMicrons setPixelsPerMicron={setPixelsPerMicron} />
          <BacklightControl
            label="backlight-pos"
            pv="ca://BL24I-MO-BL-01:MP:SELECT"
          />
        </Grid2>
      </Grid2>
    </div>
  );
}
