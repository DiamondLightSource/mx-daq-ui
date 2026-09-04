import { RunPlanButton } from "#/blueapi/BlueapiComponents.tsx";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import React from "react";
import { ParameterInput } from "../ParameterInputs";

export function PumpProbeSelection({
  pumpProbe,
  setPumpProbe,
}: {
  pumpProbe: boolean;
  setPumpProbe: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleChange = (choice: string) => {
    let newValue: boolean;
    if (choice.toLowerCase() === "true") {
      newValue = true;
    } else {
      newValue = false;
    }
    setPumpProbe(newValue);
  };
  return (
    <Tooltip title="Is this a pump probe experiment?" placement="right">
      <FormControl size="small" style={{ width: 180 }}>
        <InputLabel id="pp-ex">Pump Probe</InputLabel>
        <Select
          labelId="pp-ex"
          id="pp"
          value={String(pumpProbe)}
          label="Pump Probe"
          onChange={(e) => handleChange(e.target.value)}
        >
          <MenuItem value={"true"}>True</MenuItem>
          <MenuItem value={"false"}>False</MenuItem>
        </Select>
      </FormControl>
    </Tooltip>
  );
}

export function PumpProbeSetup({
  dwell,
  delay,
  render,
  setDwell,
  setDelay,
}: {
  dwell: number;
  delay: number;
  render: boolean;
  setDwell: React.Dispatch<React.SetStateAction<number>>;
  setDelay: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element | null {
  if (render === false) {
    return null;
  } else {
    return (
      <React.Fragment>
        <ParameterInput
          value={dwell}
          onSet={setDwell}
          label="Laser Dwell (s)"
          tooltip="Exposure time for the laser pump, in seconds"
        />
        <ParameterInput
          value={delay}
          onSet={setDelay}
          label="Laser Delay (s)"
          tooltip="Delay time between the laser pump and the collection, in seconds"
        />
      </React.Fragment>
    );
  }
}

export function LaserCheckButtons() {
  return (
    <React.Fragment>
      <RunPlanButton
        btnLabel="Laser ON"
        planName="laser_check"
        planParams={{ mode: "laseron" }}
        title="Open shutter and check laser beam"
        btnSize="small"
      />
      <RunPlanButton
        btnLabel="Laser OFF"
        planName="laser_check"
        planParams={{ mode: "laseroff" }}
        title="Switch off laser beam"
        btnSize="small"
      />
    </React.Fragment>
  );
}
