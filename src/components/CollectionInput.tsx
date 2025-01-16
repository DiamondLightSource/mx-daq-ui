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
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";

import React from "react";
import { PvComponent, PvItem } from "../pv/PvComponent";

import { submitAndRunPlanImmediately } from "../blueapi/blueapi";

const pumpProbeMode = [
  "None",
  "Short1",
  "Short2",
  "Repeat1",
  "Repeat2",
  "Repeat3",
  "Repeat5",
  "Repeat10",
  "Medium1",
];

const chipTypes = ["Oxford", "Custom", "MISP"];

type EavaRequest = {
  laserDwell: number;
  expTime: number;
};

type MapProps = {
  label: string;
  chipType: typeof chipTypes;
};

function CalculateEAVA(
  laserDwell: number,
  expTime: number,
  factor: number
): number {
  const movetime: number = 0.008;
  const res = factor * 20 * (movetime + (laserDwell + expTime) / 2);
  return Number(res.toFixed(4));
}

function PumpProbeDialog(props: EavaRequest) {
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

// function MapDialog(props:)

export function CollectionInput() {
  // const theme = useTheme();
  // const bgColor = theme.palette.background.paper;
  const [subDir, setSubDir] = React.useState<string>("path/to/dir");
  const [chipName, setChipName] = React.useState<string>("test");
  const [expTime, setExpTime] = React.useState<number>(0.01);
  const [shots, setShots] = React.useState<number>(1);
  const [trans, setTrans] = React.useState<number>(0.3);
  const [detDist, setDetDist] = React.useState<number>(1350);
  const [pumpProbe, setPumpProbe] = React.useState<string>(pumpProbeMode[0]);
  const [laserDwell, setLaserDwell] = React.useState<number>(0.0);
  const [laserDelay, setLaserDelay] = React.useState<number>(0.0);
  const [checkerPattern, setChecked] = React.useState(false);
  const [chipType, setChipType] = React.useState<string>(chipTypes[0]);
  const [useMapLite, setUseMap] = React.useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <PvComponent
            label="Visit"
            pv="ca://ME14E-MO-IOC-01:GP100"
            render={({ label, value }: PvItem) => {
              return (
                <Box>
                  <p>
                    <b>{label}:</b> {value?.toString().slice(7)}
                  </p>
                </Box>
              );
            }}
          />
          <PvComponent
            label="Detector in use"
            pv="ca://ME14E-MO-IOC-01:GP101"
            render={({ label, value }: PvItem) => {
              return (
                <Box>
                  <p>
                    <b>{label}:</b> {value?.toString().slice(7)}
                  </p>
                </Box>
              );
            }}
          />
        </Grid2>
        <Grid2 size={4.5}>
          <Stack direction={"column"} spacing={1} alignItems={"center"}>
            <TextField
              size="small"
              label="subDirectory"
              defaultValue={subDir}
              onChange={(e) => setSubDir(String(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="chipName"
              defaultValue={chipName}
              onChange={(e) => setChipName(String(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="shotsPerAperture"
              defaultValue={shots}
              onChange={(e) => setShots(Number(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="exposureTime (s)"
              defaultValue={expTime}
              onChange={(e) => setExpTime(Number(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="transmission (fraction)"
              defaultValue={trans}
              onChange={(e) => setTrans(Number(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="detectorDistance (mm)"
              defaultValue={detDist}
              onChange={(e) => setDetDist(Number(e.target.value))}
              style={{ width: 180 }}
            />
          </Stack>
        </Grid2>
        <Grid2 size={4.5}>
          <Stack direction={"column"}>
            <p>
              <b>Chip & Map options</b>
            </p>
            <FormControl size="small" style={{ width: 150 }}>
              <InputLabel id="chip-label">chipType</InputLabel>
              <Select
                labelId="chip-label"
                id="chip"
                value={chipType}
                label="chipType"
                onChange={(e) => setChipType(String(e.target.value))}
              >
                {chipTypes.map((chipType) => (
                  <MenuItem key={chipType} value={chipType}>
                    {chipType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* // NOTE may put this in MapDialog for Oxford */}
            <FormControl>
              <FormControlLabel
                label="Use Mapping Lite"
                control={
                  <Checkbox
                    checked={useMapLite}
                    onChange={(e) => setUseMap(Boolean(e.target.checked))} // NOPE!
                  />
                }
              />
            </FormControl>
          </Stack>
          {
            // TODO This doesn't work. And would need separate function anyway
            /* <ToggleButtonGroup
            orientation="vertical"
            value={view}
            onChange={handleChange}
            sx={{ bgcolor: bgColor }}
          >
            <ToggleButtonGroup value="01">01</ToggleButtonGroup>
            <ToggleButtonGroup value="01">01</ToggleButtonGroup>
            <ToggleButtonGroup value="01">01</ToggleButtonGroup>
            <ToggleButtonGroup value="01">01</ToggleButtonGroup>
          </ToggleButtonGroup> */
          }
        </Grid2>
        <Grid2 size={3}>
          <Stack spacing={1} direction={"column"}>
            <FormControl size="small" style={{ width: 150 }}>
              <InputLabel id="pp-label">pumpProbe</InputLabel>
              <Select
                labelId="pp-label"
                id="pp"
                value={pumpProbe}
                label="pumpProbe"
                onChange={(e) => setPumpProbe(String(e.target.value))}
              >
                {pumpProbeMode.map((pumpProbe) => (
                  <MenuItem key={pumpProbe} value={pumpProbe}>
                    {pumpProbe}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="laserDwell (s)"
              defaultValue={laserDwell}
              onChange={(e) => setLaserDwell(Number(e.target.value))}
              style={{ width: 150 }}
            />
            <TextField
              size="small"
              label="laserDelay (s)"
              defaultValue={laserDelay}
              onChange={(e) => setLaserDelay(Number(e.target.value))}
              style={{ width: 150 }}
            />
            <TextField
              size="small"
              label="prePumpExposure (s)"
              defaultValue={0.0}
              // onChange={(e) => setLaserDelay(Number(e.target.value))}
              style={{ width: 150 }}
            />
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
            <PumpProbeDialog laserDwell={laserDwell} expTime={expTime} />
          </Stack>
        </Grid2>
      </Grid2>
      <Grid2 size={12}>
        <Stack direction={"row"} spacing={"3"} justifyContent="center">
          <Button
            onClick={() =>
              submitAndRunPlanImmediately("gui_set_parameters", {
                sub_dir: subDir,
                chip_name: chipName,
                exp_time: expTime,
                det_dist: detDist,
                transmission: trans,
                n_shots: shots,
                chip_type: chipType,
                pump_settings: [
                  pumpProbe,
                  laserDwell,
                  laserDelay,
                  checkerPattern,
                ],
              })
            }
          >
            Run (for now just set)!
          </Button>
          <Button>Abort! (does nothing)</Button>
        </Stack>
      </Grid2>
    </Box>
    // NOTE Also need abort button
  );
}
