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
import { PumpProbeDialog } from "../components/CollectionComponents";
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
  const [prePump, setPerPumpExp] = React.useState<number>(0.0);
  const [checkerPattern, setChecked] = React.useState(false);
  const [chipType, setChipType] = React.useState<string>(chipTypes[0]);

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
            <Tooltip title="Location inside visit directory to save data">
              <TextField
                size="small"
                label="Sub-directory"
                defaultValue={subDir}
                onChange={(e) => setSubDir(String(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip title="Chip identifier, this will be used as filename">
              <TextField
                size="small"
                label="Chip Name"
                defaultValue={chipName}
                onChange={(e) => setChipName(String(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip title="How many consecutive times each window should be collected.">
              <TextField
                size="small"
                label="Shots Per Aperture"
                defaultValue={shots}
                onChange={(e) => setShots(Number(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip title="Exposure time for each window, in seconds">
              <TextField
                size="small"
                label="Exposure Time (s)"
                defaultValue={expTime}
                onChange={(e) => setExpTime(Number(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip title="Request transmission for collection, expressed as a fraction">
              <TextField
                size="small"
                label="Transmission (fraction)"
                defaultValue={trans}
                onChange={(e) => setTrans(Number(e.target.value))}
                style={{ width: 180 }}
              />
            </Tooltip>
            <Tooltip title="Distance to move the detector y stage to, in millimeters">
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
            <Tooltip title="Is this a pump probe experiment? Choose the setting.">
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
            {/*TODO See https://github.com/DiamondLightSource/mx-daq-ui/issues/3?issue=DiamondLightSource%7Cmx-daq-ui%7C16 */}
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
                defaultValue={laserDelay}
                onChange={(e) => setLaserDelay(Number(e.target.value))}
                style={{ width: 150 }}
              />
            </Tooltip>
            <Tooltip title="How long to collect before laser pump, if setting is Short2, in seconds">
              <TextField
                size="small"
                label="Pre-Pump Exposure Time (s)"
                defaultValue={prePump}
                onChange={(e) => setPerPumpExp(Number(e.target.value))}
                style={{ width: 150 }}
              />
            </Tooltip>
            <Tooltip title="Select for drop on chip">
              <FormControl>
                <FormControlLabel
                  label="Checker Pattern"
                  control={
                    <Checkbox
                      checked={checkerPattern}
                      onChange={(e) => setChecked(Boolean(e.target.checked))}
                    />
                  }
                />
              </FormControl>
            </Tooltip>
            <PumpProbeDialog laserDwell={laserDwell} expTime={expTime} />
          </Stack>
        </Grid2>
        <Grid2 size={4.5}>
          <Stack direction={"column"} alignItems={"center"} spacing={1}>
            <Tooltip title="Select the type of chip in use">
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
            <p>Chip-dependent Map settings TBD.</p>
          </Stack>
        </Grid2>
      </Grid2>
      <Grid2 size={12}>
        <Stack direction={"row"} spacing={"5"} justifyContent={"center"}>
          {/* See
          https://github.com/DiamondLightSource/mx-daq-ui/issues/3?issue=DiamondLightSource%7Cmx-daq-ui%7C18 */}
          <Tooltip title="Start fixed target collection">
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
                  checker_pattern: checkerPattern.valueOf(),
                  pump_probe: pumpProbe,
                  laser_dwell: laserDwell,
                  laser_delay: laserDelay,
                  pre_pump: prePump,
                })
              }
            >
              Run (for now just set)!
            </Button>
          </Tooltip>
          <Tooltip title="Abort current operation">
            <Button onClick={() => abortCurrentPlan()}>Abort!</Button>
          </Tooltip>
        </Stack>
      </Grid2>
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
