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
  Tooltip,
} from "@mui/material";
import React from "react";

type EavaRequest = {
  laserDwell: number;
  expTime: number;
};

/**
 * Calculate laser delay for EAVA (Excite And Visit Again) pump probe settings.
 * These are the options labeles as "repeat#" in the UI, the number after repeat
 * indicating how many rows are pumped at a time.
 *
 * @param {number} laserDwell - laser exposure time
 * @param {number} expTime - collection exposure time for each window
 * @param {number} factor - number of rows pumped at the time, multiplied by 2
 * @returns {number} The laser delay to set
 */
function calculateEAVA(
  laserDwell: number,
  expTime: number,
  factor: number
): number {
  const movetime: number = 0.008;
  const windowsPerRow: number = 20;
  const delay =
    factor * windowsPerRow * (movetime + (laserDwell + expTime) / 2);
  return Number(delay.toFixed(4));
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
      <Tooltip title="Calculate the optimal delay to set for Repeat# settings">
        <Button variant="outlined" onClick={handleClickOpen}>
          EAVA calculator
        </Button>
      </Tooltip>
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
              {calculateEAVA(props.laserDwell, props.expTime, 2)}s
            </p>
            <p>
              <b>Repeat2: </b>
              {calculateEAVA(props.laserDwell, props.expTime, 4)}s
            </p>
            <p>
              <b>Repeat3: </b>
              {calculateEAVA(props.laserDwell, props.expTime, 6)}s
            </p>
            <p>
              <b>Repeat5: </b>
              {calculateEAVA(props.laserDwell, props.expTime, 10)}s
            </p>
            <p>
              <b>Repeat10: </b>
              {calculateEAVA(props.laserDwell, props.expTime, 20)}s
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

export function PumpProbeOptions({
  pumpProbe,
  laserDwell,
  expTime,
  setLaserDwell,
  setLaserDelay,
  setPrePumpExp,
}: {
  pumpProbe: string;
  laserDwell: number;
  expTime: number;
  setLaserDwell: React.Dispatch<React.SetStateAction<number>>;
  setLaserDelay: React.Dispatch<React.SetStateAction<number>>;
  setPrePumpExp: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element | null {
  if (pumpProbe === "NoPP") {
    return null;
  }

  return (
    <Stack spacing={1} direction={"column"}>
      <Tooltip title="Exposure time for the laser pump, in seconds">
        <TextField
          size="small"
          label="Laser Dwell (s)"
          defaultValue={laserDwell}
          onChange={(e) => setLaserDwell(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Tooltip>
      <Tooltip title="Delay time between the laser pump and the collection, in seconds">
        <TextField
          size="small"
          label="Laser Delay (s)"
          defaultValue={0.0}
          onChange={(e) => setLaserDelay(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Tooltip>
      <Tooltip title="How long to collect before laser pump, if setting is Short2, in seconds">
        <TextField
          size="small"
          label="Pre-Pump Exposure Time (s)"
          defaultValue={0.0}
          onChange={(e) => setPrePumpExp(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Tooltip>
      <PumpProbeDialog laserDwell={laserDwell} expTime={expTime} />
    </Stack>
  );
}

function OxfordMapSelection({
  setChipMap,
}: {
  setChipMap: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };
  return (
    <Stack direction={"column"} alignItems={"center"} spacing={2}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Choose Map
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose}></Dialog>
      <TextField
        size="small"
        label="selectedBlocks"
        defaultValue={[]}
        // defaultValue={select.valueOf()}
        slotProps={{
          input: { readOnly: true },
        }}
        style={{ width: 150 }}
      />
    </Stack>
  );
}

const MapTypes = ["Full Chip", "Lite"];

function OxfordMapComponent({
  setChipMap,
}: {
  setChipMap: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [mapType, setMapType] = React.useState<string>(MapTypes[0]);

  // const [chipMap, setChipMap] = React.useState<number[]>([]);

  // const fromInputMap = (blockList: number[]) => {
  //   setChipMap({ chipMap: blockList });
  // };

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
          <OxfordMapSelection setChipMap={setChipMap} />
        )}
      </Stack>
    </Box>
  );
}

function CustomMapComponent({
  setWinX,
  setWinY,
  setStepX,
  setStepY,
}: {
  setWinX: React.Dispatch<React.SetStateAction<number>>;
  setWinY: React.Dispatch<React.SetStateAction<number>>;
  setStepX: React.Dispatch<React.SetStateAction<number>>;
  setStepY: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <Box>
      <Stack direction={"column"} alignItems={"center"} spacing={1}>
        <TextField
          size="small"
          label="numWindowsX"
          defaultValue={0.0}
          onChange={(e) => setWinX(Number(e.target.value))}
          style={{ width: 150 }}
        />
        <TextField
          size="small"
          label="numWindowsy"
          defaultValue={0.0}
          onChange={(e) => setWinY(Number(e.target.value))}
          style={{ width: 150 }}
        />
        <TextField
          size="small"
          label="stepSizeX"
          defaultValue={0.0}
          onChange={(e) => setStepX(Number(e.target.value))}
          style={{ width: 150 }}
        />
        <TextField
          size="small"
          label="stepSizeY"
          defaultValue={0.0}
          onChange={(e) => setStepY(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Stack>
    </Box>
  );
}

// TODO Actually return values from components
export function MapView({
  chipType,
}: {
  chipType: string;
}): JSX.Element | null {
  let chipInfo: number[];

  const [chipMap, setChipMap] = React.useState<number[]>([]);

  const [numWindowsX, setWinX] = React.useState<number>(0);
  const [numWindowsY, setWinY] = React.useState<number>(0);
  const [stepSizeX, setStepX] = React.useState<number>(0);
  const [stepSizeY, setStepY] = React.useState<number>(0);

  let component: JSX.Element;

  switch (chipType) {
    case "Oxford":
      component = <OxfordMapComponent setChipMap={setChipMap} />;
      chipInfo = chipMap;
      return component;
    case "OxfordInner":
      component = <OxfordMapComponent setChipMap={setChipMap} />;
      return component;
    case "Custom":
      component = (
        <CustomMapComponent
          setWinX={setWinX}
          setWinY={setWinY}
          setStepX={setStepX}
          setStepY={setStepY}
        />
      );
      chipInfo = [numWindowsX, numWindowsY, stepSizeX, stepSizeY];
      console.log(chipInfo);
      return component;
    default:
      return null;
  }
}
