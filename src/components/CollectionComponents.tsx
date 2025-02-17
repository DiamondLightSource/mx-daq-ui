import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
} from "@mui/material";
import React from "react";

type EavaRequest = {
  laserDwell: number;
  expTime: number;
};

export function CalculateEAVA(
  laserDwell: number,
  expTime: number,
  factor: number
): number {
  const movetime: number = 0.008;
  const res = factor * 20 * (movetime + (laserDwell + expTime) / 2);
  return Number(res.toFixed(4));
}

export function PumpProbeDialog(props: EavaRequest) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        EAVA calculator
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Excite And Visit Again</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Calculate the laser delay for each EAVA setting from laser dwell
            time and exposure time.
          </DialogContentText>
          <Stack direction={"column"} spacing={1} alignItems={"center"}>
            <p>
              <b>Repeat1: </b>
              {CalculateEAVA(props.laserDwell, props.expTime, 2)}s
            </p>
            <p>
              <b>Repeat2: </b>
              {CalculateEAVA(props.laserDwell, props.expTime, 4)}s
            </p>
            <p>
              <b>Repeat3: </b>
              {CalculateEAVA(props.laserDwell, props.expTime, 6)}s
            </p>
            <p>
              <b>Repeat5: </b>
              {CalculateEAVA(props.laserDwell, props.expTime, 10)}s
            </p>
            <p>
              <b>Repeat10: </b>
              {CalculateEAVA(props.laserDwell, props.expTime, 20)}s
            </p>
          </Stack>
          <DialogContentText>
            <b>Notes</b>
            <ul>
              <li>
                The repeat is the number of pairs of lines illuminated before
                probe.
              </li>
              <li>
                Because the lines in a block are 20, repeat3 will miss some
                lines
              </li>
              <li>
                ONLY use with Mapping lite, do not run a full Oxford Chip in
                this mode.
              </li>
            </ul>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

type MapProps = {
  label: string;
  chipType: string;
};

function OxfordMapSelection(blockList) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const [select, setSelected] = React.useState(false);

  const handleSelection = (
    event: React.MouseEvent<HTMLElement>,
    newSelect: boolean | null
  ) => {
    if (newSelect !== null) {
      setSelected(newSelect);
    }
  };

  return (
    <Stack direction={"column"} alignItems={"center"} spacing={2}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Choose Map
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Choose blocks on Oxford chip</DialogTitle>
        <DialogContent>
          {/* <Box>Buttons here</Box> */}
          <ToggleButton
            value="01"
            selected={select}
            onClick={(e) => handleSelection(e, true)}
            aria-label="block1"
          >
            01
          </ToggleButton>
        </DialogContent>
      </Dialog>
      <TextField
        size="small"
        label="selectedBlocks"
        defaultValue={select.valueOf()}
        slotProps={{
          input: { readOnly: true },
        }}
        style={{ width: 150 }}
      />
    </Stack>
  );
}

const MapTypes = ["Full Chip", "Lite"];

function OxfordMapComponent() {
  const [mapType, setMapType] = React.useState<string>(MapTypes[0]);

  const [chipMap, setChipMap] = React.useState<number[]>([]);

  const fromInputMap = (blockList: number[]) => {
    setChipMap(blockList);
  };

  return (
    <Box>
      <Stack direction={"column"} spacing={2}>
        <FormControl size="small" style={{ width: 150 }}>
          <InputLabel id="map-label">mapType</InputLabel>
          <Select
            labelId="map-label"
            id="map"
            value={mapType}
            label="mapType"
            onChange={(e) => setMapType(String(e.target.value))}
          >
            {MapTypes.map((mapType) => (
              <MenuItem key={mapType} value={mapType}>
                {mapType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {mapType === MapTypes[0] ? null : (
          <OxfordMapSelection blockList={fromInputMap} />
        )}
      </Stack>
    </Box>
  );
}

function CustomMapComponent() {
  const [numWindowsX, setWinX] = React.useState<number>(0);
  const [numWindowsY, setWinY] = React.useState<number>(0);
  const [stepSizeX, setStepX] = React.useState<number>(0);
  const [stepSizeY, setStepY] = React.useState<number>(0);

  return (
    <Box>
      <Stack direction={"column"} alignItems={"center"} spacing={1}>
        <TextField
          size="small"
          label="numWindowsX"
          defaultValue={numWindowsX}
          onChange={(e) => setWinX(Number(e.target.value))}
          style={{ width: 150 }}
        />
        <TextField
          size="small"
          label="numWindowsy"
          defaultValue={numWindowsY}
          onChange={(e) => setWinY(Number(e.target.value))}
          style={{ width: 150 }}
        />
        <TextField
          size="small"
          label="stepSizeX"
          defaultValue={stepSizeX}
          onChange={(e) => setStepX(Number(e.target.value))}
          style={{ width: 150 }}
        />
        <TextField
          size="small"
          label="stepSizeY"
          defaultValue={stepSizeY}
          onChange={(e) => setStepY(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Stack>
    </Box>
  );
}

// TODO Actually return values from components
export function MapView(props: MapProps) {
  switch (props.chipType) {
    case "Oxford":
      return <OxfordMapComponent />;
    case "OxfordInner":
      return <OxfordMapComponent />;
    case "Custom":
      return <CustomMapComponent />;
    default:
      return null;
  }
}
