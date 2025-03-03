import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { PvComponent, PvItem } from "../pv/PvComponent";
import React from "react";
import {
  MapView,
  PumpProbeDialog,
  PumpProbeOptions,
} from "../components/CollectionComponents";
import {
  abortCurrentPlan,
  submitAndRunPlanImmediately,
} from "../blueapi/blueapi";

const pumpProbeMode = [
  "NoPP",
  "Short1",
  "Short2",
  "Repeat1",
  "Repeat2",
  "Repeat3",
  "Repeat5",
  "Repeat10",
  "Medium1",
];

const chipTypes = ["Oxford", "OxfordInner", "Custom", "MISP"];

function FixedInputs() {
  return (
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
  );
}

type ParametersProp = {
  subDir: string;
  chipName: string;
  expTime: number;
  detDist: number;
  transFract: number;
  nShots: number;
  chipType: string;
  checkerPattern: boolean;
  pumpProbe: string;
  pumpInputs: number[];
};

function RunButtons(props: ParametersProp) {
  console.log(props);
  return (
    <Grid2 size={12}>
      <Stack direction={"row"} spacing={8} justifyContent={"center"}>
        {/* See
          https://github.com/DiamondLightSource/mx-daq-ui/issues/3?issue=DiamondLightSource%7Cmx-daq-ui%7C18 */}
        <Tooltip title="Start fixed target collection" placement="bottom">
          <Button
            onClick={() =>
              submitAndRunPlanImmediately("gui_set_parameters", {
                sub_dir: props.subDir,
                chip_name: props.chipName,
                exp_time: props.expTime,
                det_dist: props.detDist,
                transmission: props.transFract,
                n_shots: props.nShots,
                chip_type: props.chipType,
                checker_pattern: props.checkerPattern,
                pump_probe: props.pumpProbe,
                laser_dwell: props.pumpInputs[0],
                laser_delay: props.pumpInputs[1],
                pre_pump: props.pumpInputs[2],
              })
            }
          >
            Run (for now just set)!
          </Button>
        </Tooltip>
        <Tooltip title="Abort current operation" placement="bottom">
          <Button onClick={() => abortCurrentPlan()}>Abort!</Button>
        </Tooltip>
      </Stack>
    </Grid2>
  );
}

function CollectionInput() {
  const [subDir, setSubDir] = React.useState<string>("path/to/dir");
  const [chipName, setChipName] = React.useState<string>("test");
  const [expTime, setExpTime] = React.useState<number>(0.01);
  const [shots, setShots] = React.useState<number>(1);
  const [trans, setTrans] = React.useState<number>(0.3);
  const [detDist, setDetDist] = React.useState<number>(1350);
  const [pumpProbe, setPumpProbe] = React.useState<string>(pumpProbeMode[0]);
  const [laserDwell, setLaserDwell] = React.useState<number>(0.0);
  const [laserDelay, setLaserDelay] = React.useState<number>(0.0);
  const [prePump, setPrePumpExp] = React.useState<number>(0.0);
  const [checkerPattern, setChecked] = React.useState(false);
  const [chipType, setChipType] = React.useState<string>(chipTypes[0]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2}>
        <FixedInputs />
        <Grid2 size={4.5}>
          <Stack direction={"column"} spacing={1} alignItems={"center"}>
            <Tooltip
              title="Location inside visit directory to save data"
              placement="left"
            >
              <TextField
                size="small"
                label="Sub-directory"
                defaultValue={subDir}
                onChange={(e) => setSubDir(String(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip
              title="Chip identifier, this will be used as filename"
              placement="left"
            >
              <TextField
                size="small"
                label="Chip Name"
                defaultValue={chipName}
                onChange={(e) => setChipName(String(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip
              title="How many consecutive times each window should be collected."
              placement="left"
            >
              <TextField
                size="small"
                label="Shots Per Aperture"
                defaultValue={shots}
                onChange={(e) => setShots(Number(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip
              title="Exposure time for each window, in seconds"
              placement="left"
            >
              <TextField
                size="small"
                label="Exposure Time (s)"
                defaultValue={expTime}
                onChange={(e) => setExpTime(Number(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip
              title="Request transmission for collection, expressed as a fraction"
              placement="left"
            >
              <TextField
                size="small"
                label="Transmission (fraction)"
                defaultValue={trans}
                onChange={(e) => setTrans(Number(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip
              title="Distance to move the detector y stage to, in millimeters"
              placement="left"
            >
              <TextField
                size="small"
                label="Detector Distance (mm)"
                defaultValue={detDist}
                onChange={(e) => setDetDist(Number(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
          </Stack>
        </Grid2>
        {/* See https://github.com/DiamondLightSource/mx-daq-ui/issues/25 */}
        <Grid2 size={3}>
          <Stack spacing={1} direction={"column"}>
            <Tooltip title="Select for drop on chip" placement="right">
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
            <Tooltip
              title="Is this a pump probe experiment? Choose the setting."
              placement="right"
            >
              <FormControl size="small" style={{ width: 150 }}>
                <InputLabel id="pp-label">Pump Probe</InputLabel>
                <Select
                  labelId="pp-label"
                  id="pp"
                  value={pumpProbe}
                  label="Pump Probe"
                  onChange={(e) => setPumpProbe(String(e.target.value))}
                >
                  {pumpProbeMode.map((pumpProbe) => (
                    <MenuItem key={pumpProbe} value={pumpProbe}>
                      {pumpProbe}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
            <PumpProbeOptions
              pumpProbe={pumpProbe}
              laserDwell={laserDwell}
              expTime={expTime}
              setLaserDwell={setLaserDwell}
              setLaserDelay={setLaserDelay}
              setPrePumpExp={setPrePumpExp}
            />
          </Stack>
        </Grid2>
        <Grid2 size={4.5}>
          <Stack direction={"column"} alignItems={"center"} spacing={1}>
            <Tooltip title="Select the type of chip in use" placement="right">
              <FormControl size="small" style={{ width: 150 }}>
                <InputLabel id="chip-label">Chip Type</InputLabel>
                <Select
                  labelId="chip-label"
                  id="chip"
                  value={chipType}
                  label="Chip Type"
                  onChange={(e) => setChipType(String(e.target.value))}
                >
                  {chipTypes.map((chipType) => (
                    <MenuItem key={chipType} value={chipType}>
                      {chipType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
            {/* See https://github.com/DiamondLightSource/mx-daq-ui/issues/3?issue=DiamondLightSource%7Cmx-daq-ui%7C5 */}
            <MapView chipType={chipType} />
          </Stack>
        </Grid2>
      </Grid2>
      <RunButtons
        subDir={subDir}
        chipName={chipName}
        expTime={expTime}
        detDist={detDist}
        transFract={trans}
        nShots={shots}
        chipType={chipType}
        checkerPattern={checkerPattern.valueOf()}
        pumpProbe={pumpProbe}
        pumpInputs={[laserDwell, laserDelay, prePump]}
      />
    </Box>
  );
}

export function ParamsPanel() {
  return (
    <Stack direction="column">
      <CollectionInput />
    </Stack>
  );
}
