import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import React from "react";
import { calculateEAVA, EavaRequest, MapTypes } from "./params";

/**
 * Opens a dilog showing the calculated laser delay to set for each EAVA setting, given the laser
 * exposure time and collection exposure time.
 *
 * @param {number} laserDwell - laser exposure time
 * @param {number} expTime - collection exposure time
 */
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
      <Tooltip
        title="Calculate the optimal delay to set for Repeat# Excite And Visit Again settings"
        placement="bottom"
      >
        <Button variant="outlined" onClick={handleClickOpen}>
          EAVA calculator
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>EAVA: Excite And Visit Again</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Calculate the laser delay for each Excite And Visit Again setting
            from laser dwell time and exposure time.
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

/**
 * Dynamic component which will show the pump probe options if one of the settings is selected in the
 * dropdown.
 *
 * @param {string} pumpProbe - selected setting
 * @param {number} laserDwell - laser exposure time
 * @param {number} expTime - collection exposure time
 * @param {boolean} checkerPattern - pump in a checkerboard pattern
 * @returns null if the selected pump probe setting is `NoPP`, a JSX.Element with input text fields otherwise
 */
export function PumpProbeOptions({
  pumpProbe,
  laserDwell,
  expTime,
  checkerPattern,
  setLaserDwell,
  setLaserDelay,
  setPrePumpExp,
  setChecked,
}: {
  pumpProbe: string;
  laserDwell: number;
  expTime: number;
  checkerPattern: boolean;
  setLaserDwell: React.Dispatch<React.SetStateAction<number>>;
  setLaserDelay: React.Dispatch<React.SetStateAction<number>>;
  setPrePumpExp: React.Dispatch<React.SetStateAction<number>>;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element | null {
  if (pumpProbe === "NoPP") {
    return null;
  }

  return (
    <Stack spacing={1} direction={"column"}>
      <Tooltip
        title="Exposure time for the laser pump, in seconds"
        placement="right"
      >
        <TextField
          size="small"
          label="Laser Dwell (s)"
          defaultValue={laserDwell}
          onChange={(e) => setLaserDwell(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Tooltip>
      <Tooltip
        title="Delay time between the laser pump and the collection, in seconds"
        placement="right"
      >
        <TextField
          size="small"
          label="Laser Delay (s)"
          defaultValue={0.0}
          onChange={(e) => setLaserDelay(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Tooltip>
      <Tooltip
        title="How long to collect before laser pump, if setting is Short2, in seconds"
        placement="right"
      >
        <TextField
          size="small"
          label="Pre-Pump Exposure Time (s)"
          defaultValue={0.0}
          onChange={(e) => setPrePumpExp(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Tooltip>
      <Tooltip
        title="If selected, do pump every other well in a checkerboard pattern"
        placement="right"
      >
        <FormControl>
          <FormControlLabel
            label="Checker Pattern"
            control={
              <Checkbox
                checked={checkerPattern}
                onChange={(e) => setChecked(Boolean(e.target.checked))} // NOPE!
              />
            }
          />
        </FormControl>
      </Tooltip>
      <PumpProbeDialog laserDwell={laserDwell} expTime={expTime} />
    </Stack>
  );
}

/**
 * Create list of numbered ToggleButtons to add to a ToggleButtonGroup
 *
 * @param {number[]} blocks - list of numbered buttons to add
 */
function LiteMapItems({ blocks }: { blocks: number[] }) {
  const btns = blocks.map((block) => (
    <ToggleButton value={block}>
      {block.toString().padStart(2, "0")}
    </ToggleButton>
  ));
  return btns;
}

/**
 * Create a Map Selection dialog for Oxford type chips. The numbering of the
 * individual windows follows the order in which they are collected by the
 * motion program.
 *
 * @param {number[]} chipMap - list of blocks which will be collected
 * @param {React.Dispatch} setChipMap - callback to set the chip map state
 */
function OxfordMapSelection({
  chipMap,
  setChipMap,
}: {
  chipMap: number[];
  setChipMap: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleBlocks = (
    _event: React.MouseEvent<HTMLElement>,
    newBlocks: number[]
  ) => {
    setChipMap(newBlocks);
  };

  const handleClear = () => {
    setChipMap([]);
  };

  const rangeUp = (start: number, end: number) =>
    Array.from(Array(end - start + 1).keys()).map((x) => x + start);

  const rangeDown = (start: number, end: number) =>
    Array.from(Array(start - end + 1).keys()).map((x) => start - x);

  const handleSelectAll = () => {
    const newMap = rangeUp(1, 64);
    setChipMap(newMap);
  };

  return (
    <Stack direction={"column"} alignItems={"center"} spacing={2}>
      <Tooltip
        title="Choose which blocks to collect on the map"
        placement="right"
      >
        <Button variant="outlined" onClick={handleClickOpen}>
          Configure Map
        </Button>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <Stack direction={"row"}>
          <ToggleButtonGroup
            orientation="vertical"
            value={chipMap}
            onChange={handleBlocks}
            aria-label="blocks"
          >
            <LiteMapItems blocks={rangeUp(1, 8)} />
          </ToggleButtonGroup>
          <ToggleButtonGroup
            orientation="vertical"
            value={chipMap}
            onChange={handleBlocks}
            aria-label="blocks"
          >
            <LiteMapItems blocks={rangeDown(16, 9)} />
          </ToggleButtonGroup>
          <ToggleButtonGroup
            orientation="vertical"
            value={chipMap}
            onChange={handleBlocks}
            aria-label="blocks"
          >
            <LiteMapItems blocks={rangeUp(17, 24)} />
          </ToggleButtonGroup>
          <ToggleButtonGroup
            orientation="vertical"
            value={chipMap}
            onChange={handleBlocks}
            aria-label="blocks"
          >
            <LiteMapItems blocks={rangeDown(32, 25)} />
          </ToggleButtonGroup>
          <ToggleButtonGroup
            orientation="vertical"
            value={chipMap}
            onChange={handleBlocks}
            aria-label="blocks"
          >
            <LiteMapItems blocks={rangeUp(33, 40)} />
          </ToggleButtonGroup>
          <ToggleButtonGroup
            orientation="vertical"
            value={chipMap}
            onChange={handleBlocks}
            aria-label="blocks"
          >
            <LiteMapItems blocks={rangeDown(48, 41)} />
          </ToggleButtonGroup>
          <ToggleButtonGroup
            orientation="vertical"
            value={chipMap}
            onChange={handleBlocks}
            aria-label="blocks"
          >
            <LiteMapItems blocks={rangeUp(49, 56)} />
          </ToggleButtonGroup>
          <ToggleButtonGroup
            orientation="vertical"
            value={chipMap}
            onChange={handleBlocks}
            aria-label="blocks"
          >
            <LiteMapItems blocks={rangeDown(64, 57)} />
          </ToggleButtonGroup>
        </Stack>
        <ButtonGroup
          orientation="horizontal"
          // variant="text"
          style={{ justifyContent: "center" }}
        >
          <Button onClick={handleSelectAll}> Select All </Button>
          <Button onClick={handleClear}> Clear Map </Button>
        </ButtonGroup>
      </Dialog>
      <Tooltip title="This will show which blocks are currently selected for collection">
        <TextField
          size="small"
          label="Selected Blocks"
          value={chipMap.sort((a, b) => a - b)}
          defaultValue={chipMap}
          slotProps={{
            input: { readOnly: true },
          }}
          style={{ width: 150 }}
        />
      </Tooltip>
    </Stack>
  );
}

/**
 * Dynamic component for the map choice for an Oxford chip.
 * If the mapType is set to Lite, it will show the button to select the blocks
 * to collect.
 *
 * @param {string} mapType - Choice of mapping, could be Full Chip or Lite
 * @param {number[]} chipMap - Chipmap to be updated in case of Lite map.
 */
function OxfordMapComponent({
  mapType,
  chipMap,
  setMapType,
  setChipMap,
}: {
  mapType: string;
  chipMap: number[];
  setMapType: React.Dispatch<React.SetStateAction<string>>;
  setChipMap: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  return (
    <Box>
      <Stack direction={"column"} spacing={2}>
        <FormControl size="small" style={{ width: 150 }}>
          <InputLabel id="map-label">Map Type</InputLabel>
          <Tooltip title="Select mapping type" placement="right">
            <Select
              labelId="map-label"
              id="map"
              value={mapType}
              label="Map Type"
              onChange={(e) => setMapType(String(e.target.value))}
            >
              {MapTypes.map((mapType) => (
                <MenuItem key={mapType} value={mapType}>
                  {mapType}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>
        </FormControl>
        {mapType === MapTypes[0] ? null : (
          <OxfordMapSelection chipMap={chipMap} setChipMap={setChipMap} />
        )}
      </Stack>
    </Box>
  );
}

/** Component to set the format of a Custom chip: number of windows in x and y
 * and step size between each window, in mm.
 */
function CustomMapComponent({
  setChipFormat,
  setMapType,
}: {
  setChipFormat: React.Dispatch<React.SetStateAction<number[]>>;
  setMapType: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [numWindowsX, setWinX] = React.useState<number>(0);
  const [numWindowsY, setWinY] = React.useState<number>(0);
  const [stepSizeX, setStepX] = React.useState<number>(0.0);
  const [stepSizeY, setStepY] = React.useState<number>(0.0);

  const handleUpdate = () => {
    setMapType("");
    setChipFormat([numWindowsX, numWindowsY, stepSizeX, stepSizeY]);
  };

  return (
    <Box>
      <Stack direction={"column"} alignItems={"center"} spacing={1}>
        <Tooltip title="Type number of windows in x" placement="right">
          <TextField
            size="small"
            label="numWindowsX"
            defaultValue={numWindowsX}
            onChange={(e) => setWinX(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </Tooltip>
        <Tooltip title="Type number of windows in y" placement="right">
          <TextField
            size="small"
            label="numWindowsy"
            defaultValue={numWindowsY}
            onChange={(e) => setWinY(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </Tooltip>
        <Tooltip title="Type step size between windows in x" placement="right">
          <TextField
            size="small"
            label="stepSizeX"
            defaultValue={stepSizeX}
            onChange={(e) => setStepX(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </Tooltip>
        <Tooltip title="Type step size between windows in y" placement="right">
          <TextField
            size="small"
            label="stepSizeY"
            defaultValue={stepSizeY}
            onChange={(e) => setStepY(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </Tooltip>
        <Tooltip title="Set chip format for Custom" placement="right">
          <Button onClick={handleUpdate} size="small">
            Set
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
}

// See https://github.com/DiamondLightSource/mx-daq-ui/issues/30
/**Open a different Map component based on the selected chip type. */
export function MapView({
  chipType,
  mapType,
  chipFormat,
  setMapType,
  setChipFormat,
}: {
  chipType: string;
  mapType: string;
  chipFormat: number[];
  setMapType: React.Dispatch<React.SetStateAction<string>>;
  setChipFormat: React.Dispatch<React.SetStateAction<number[]>>;
}): JSX.Element | null {
  let component: JSX.Element;

  switch (chipType) {
    case "OxfordInner":
    case "Oxford":
      component = (
        <OxfordMapComponent
          mapType={mapType}
          chipMap={chipFormat}
          setMapType={setMapType}
          setChipMap={setChipFormat}
        />
      );
      console.log(chipFormat);
      return component;
    case "Custom":
      component = (
        <CustomMapComponent
          setChipFormat={setChipFormat}
          setMapType={setMapType}
        />
      );
      console.log(chipFormat);
      return component;
    default:
      return null;
  }
}
