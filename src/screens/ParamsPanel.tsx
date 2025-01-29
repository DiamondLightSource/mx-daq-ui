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
} from "@mui/material";
import React from "react";
import { PvComponent, PvItem } from "../pv/PvComponent";
import {
  abortCurrentPlan,
  submitAndRunPlanImmediately,
} from "../blueapi/blueapi";
import { PumpProbeDialog } from "../components/CollectionInput";

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
                checker_pattern: checkerPattern.valueOf(),
                // pump_settings: [
                //   pumpProbe,
                //   laserDwell,
                //   laserDelay,
                //   checkerPattern,
                // ],
              })
            }
          >
            Run (for now just set)!
          </Button>
          <Button onClick={() => abortCurrentPlan()}>Abort!</Button>
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
