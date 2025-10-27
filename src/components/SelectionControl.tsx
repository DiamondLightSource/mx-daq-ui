import React from "react";
import { PvDescription } from "../pv/types";
import { submitAndRunPlanImmediately } from "../blueapi/blueapi";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { forceString, useParsedPvConnection } from "../pv/util";

type SelectionProps = PvDescription & {
  id: string;
  plan_name: string;
  choices: string[];
};

/** Custom component for a dropdown selection which runs a plan unpon every change event
 * For now to be used for backlight and zoom control
 */
export function SelectionWithPlanRunner(props: SelectionProps) {
  const currentValue = String(
    useParsedPvConnection({
      pv: props.pv,
      label: props.label,
      transformValue: forceString,
    })
  );
  console.log(`${props.id} current value: ${currentValue}`);
  const [_, updateVal] = React.useState<string>(currentValue.toString());

  const handleChange = (newValue: typeof currentValue) => {
    updateVal(newValue);
    submitAndRunPlanImmediately({
      planName: props.plan_name,
      planParams: { position: newValue },
      instrumentSession: "", // FIXME, temporary
    });
  };

  return (
    <FormControl size="small" style={{ width: 200 }}>
      <InputLabel id={props.label}>{props.id}</InputLabel>
      <Select
        labelId={props.label}
        id={props.id}
        value={currentValue}
        label={props.label}
        onChange={(e) => handleChange(String(e.target.value))}
      >
        {props.choices.map((choice) => (
          <MenuItem key={choice} value={choice}>
            {choice}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
