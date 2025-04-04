import React from "react";
import { PvDescription, useParsedPvConnection } from "../pv/PvComponent";
import { submitAndRunPlanImmediately } from "../blueapi/blueapi";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { forceString } from "../pv/util";

type SelectionProps = PvDescription & {
  id: string;
  plan_name: string;
  choices: string[];
  transformValue?: Transformer;
};

/** Custom component for a dropdown selection which runs a plan unpon every change event
 * For now to be used for backlight and zoom control
 */
export function SelectAndRunPlan(props: SelectionProps) {
  const currentValue = String(
    useParsedPvConnection({
      pv: props.pv,
      label: props.label,
      transformValue: forceString,
    })
  );
  console.log(`${props.id} current value: ${currentValue}`);
  const [val, updateVal] = React.useState<string>(currentValue.toString());

  const handleChange = (newValue: typeof currentValue) => {
    updateVal(newValue);
    submitAndRunPlanImmediately(props.plan_name, { position: newValue });
  };

  return (
    <FormControl size="small" style={{ width: 150 }}>
      <InputLabel id={props.label}>{props.id}</InputLabel>
      <Select
        labelId={props.label}
        id={props.id}
        value={val}
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
