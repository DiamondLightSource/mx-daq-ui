import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { MapTypes } from "components/params";
import React from "react";

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
    newBlocks: number[],
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
        <Button color="custom" variant="outlined" onClick={handleClickOpen}>
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
}: {
  setChipFormat: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [numWindowsX, setWinX] = React.useState<number>(0);
  const [numWindowsY, setWinY] = React.useState<number>(0);
  const [stepSizeX, setStepX] = React.useState<number>(0);
  const [stepSizeY, setStepY] = React.useState<number>(0);

  const handleUpdate = () => {
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
          <Button color="custom" onClick={handleUpdate} size="small">
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
      component = <CustomMapComponent setChipFormat={setChipFormat} />;
      console.log(chipFormat);
      return component;
    default:
      return null;
  }
}
