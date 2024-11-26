import { Box, Button, Grid2, Stack, TextField, useTheme } from "@mui/material";
import { OavVideoStream } from "../components/OavVideoStream";
import {
  ArrowBackRounded,
  ArrowDownwardRounded,
  ArrowForwardRounded,
  ArrowUpwardRounded,
} from "@mui/icons-material";
import { useState } from "react";
import {
  Unstable_NumberInput as NumberInput,
  NumberInputProps,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";
import React from "react";

//TODO: This file should definitely be split up

const CoordNumberInput = React.forwardRef(function CustomNumberInput(
  props: NumberInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <NumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: "▴",
        },
        decrementButton: {
          children: "▾",
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

export function MoveArrows() {
  const theme = useTheme();
  return (
    <Box bgcolor={theme.palette.background.paper} borderRadius={5} paddingTop={1} paddingBottom={1}>
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
    <Box bgcolor={theme.palette.background.paper} borderRadius={5} paddingTop={1} paddingBottom={1}>
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
    <Box bgcolor={theme.palette.background.paper} borderRadius={5} paddingTop={1} paddingBottom={1}>
      <Grid2 container spacing={0} columns={3}>
        <Grid2 size={3}>
          <Stack direction="row" spacing={2} padding={2}>
            <TextField
              label="Pixels per micron"
              onChange={(e) =>
                setPixelsPerMicron(Number(e.target.value) ? Number(e.target.value) : 0)
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
                console.log(
                  `Clicked on position (${x}, ${y}) (px relative to beam centre) in original stream`
                );
                console.log(
                  `Relative position in um (${x / pixelsPerMicron}, ${y / pixelsPerMicron})`
                );
              }}
            />
          </Box>
        </Grid2>
        <Grid2 size={3} height={3}>
          <MoveArrows />
          <Grid2 size={3} padding={1} />
          <BeamCentre setCrosshairX={setCrosshairX} setCrosshairY={setCrosshairY} />
          <PixelsToMicrons setPixelsPerMicron={setPixelsPerMicron} />
        </Grid2>
      </Grid2>
    </div>
  );
}

//TODO: This is all just copied from the NumberInput example, the bits we need should be integrated into generic styling for the project

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const StyledInputRoot = styled("div")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? blue[700] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const StyledInputElement = styled("input")(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`
);

const StyledButton = styled("button")(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 0;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};

    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.mode === "dark" ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === "dark" ? blue[400] : blue[600]};
    }
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  }

  &:hover {
    cursor: pointer;
    color: #FFF;
    background: ${theme.palette.mode === "dark" ? blue[600] : blue[500]};
    border-color: ${theme.palette.mode === "dark" ? blue[400] : blue[600]};
  }

  & .arrow {
    transform: translateY(-1px);
  }

  & .arrow {
    transform: translateY(-1px);
  }
`
);
