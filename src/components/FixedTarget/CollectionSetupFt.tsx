import {
  Box,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";
import React from "react";
import { PumpProbeOptions } from "./PumpProbeComponents";
import { MapView } from "./FixedTargetMapComponents";
import { RunPlanButton, AbortButton } from "blueapi/BlueapiComponents";
import { ParameterInput } from "components/ParameterInputs";
import { pumpProbeMode, chipTypes, MapTypes } from "components/params";

type ParametersProps = {
  subDir: string;
  chipName: string;
  expTime: number;
  detDist: number;
  transFract: number;
  nShots: number;
  chipType: string;
  mapType: string;
  chipFormat: number[];
  checkerPattern: boolean;
  pumpProbe: string;
  pumpInputs: number[];
};

/**
 * Component to add Start and Abort buttons to collection panel.
 *
 * @param {ParametersProps} props
 */
function RunButtons(props: ParametersProps) {
  console.log(props);
  return (
    <Grid2 size={12}>
      <Stack direction={"row"} spacing={8} justifyContent={"center"}>
        <RunPlanButton
          btnLabel="Start!"
          planName="gui_run_chip_collection"
          planParams={{
            sub_dir: props.subDir,
            chip_name: props.chipName,
            exp_time: props.expTime,
            det_dist: props.detDist,
            transmission: props.transFract,
            n_shots: props.nShots,
            chip_type: props.chipType,
            map_type: props.mapType,
            chip_format: props.chipFormat,
            checker_pattern: props.checkerPattern,
            pump_probe: props.pumpProbe,
            laser_dwell: props.pumpInputs[0],
            laser_delay: props.pumpInputs[1],
            pre_pump: props.pumpInputs[2],
          }}
          title="Start fixed target collection"
          btnSize="large"
        />
        <AbortButton />
      </Stack>
    </Grid2>
  );
}

/**Main collection input window for the fixed target panel. */
export function CollectionSetupFt() {
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

  const [mapType, setMapType] = React.useState<string>(MapTypes[0]);
  const [chipFormat, setChipFormat] = React.useState<number[]>([]);

  return (
    <Box sx={{ flexGrow: 1, marginRight: 10, marginLeft: 10 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={4.5}>
          <Stack direction={"column"} spacing={1} alignItems={"center"}>
            <ParameterInput
              value={subDir}
              onSet={setSubDir}
              label="Sub-directory"
              tooltip="Location inside visit directory to save data"
            />
            <ParameterInput
              value={chipName}
              onSet={setChipName}
              label="Chip Name"
              tooltip="Chip identifier, this will be used as filename"
            />
            <ParameterInput
              value={shots}
              onSet={setShots}
              label="Shots Per Aperture"
              tooltip="How many consecutive times each window should be collected"
            />
            <ParameterInput
              value={expTime}
              onSet={setExpTime}
              label="Exposure Time (s)"
              tooltip="Exposure time for each window, in seconds"
            />
            <ParameterInput
              value={trans}
              onSet={setTrans}
              label="Transmission (fraction)"
              tooltip="Request transmission for collection, expressed as a fraction"
            />
            <ParameterInput
              value={detDist}
              onSet={setDetDist}
              label="Detector Distance (mm)"
              tooltip="Distance to move the detector y stage to, in millimeters"
            />
          </Stack>
        </Grid2>
        <Grid2 size={3}>
          <Stack spacing={1} direction={"column"} alignItems={"center"}>
            <Tooltip
              title="Is this a pump probe experiment? Choose the setting."
              placement="right"
            >
              <FormControl size="small" style={{ width: 180 }}>
                <InputLabel id="pp-label">Pump Probe</InputLabel>
                <Select
                  labelId="pp-label"
                  id="pp"
                  value={pumpProbe}
                  label="Pump Probe"
                  onChange={(e) => setPumpProbe(String(e.target.value))}
                >
                  {pumpProbeMode.map((ppChoice) => (
                    <MenuItem key={ppChoice} value={ppChoice}>
                      {ppChoice}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
            <PumpProbeOptions
              pumpProbe={pumpProbe}
              laserDwell={laserDwell}
              expTime={expTime}
              checkerPattern={checkerPattern}
              setLaserDwell={setLaserDwell}
              setLaserDelay={setLaserDelay}
              setPrePumpExp={setPrePumpExp}
              setChecked={setChecked}
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
            <MapView
              chipType={chipType}
              mapType={mapType}
              chipFormat={chipFormat}
              setMapType={setMapType}
              setChipFormat={setChipFormat}
            />
          </Stack>
        </Grid2>
        <RunButtons
          subDir={subDir}
          chipName={chipName}
          expTime={expTime}
          detDist={detDist}
          transFract={trans}
          nShots={shots}
          chipType={chipType}
          mapType={mapType}
          chipFormat={chipFormat}
          checkerPattern={checkerPattern.valueOf()}
          pumpProbe={pumpProbe}
          pumpInputs={[laserDwell, laserDelay, prePump]}
        />
      </Grid2>
    </Box>
  );
}
