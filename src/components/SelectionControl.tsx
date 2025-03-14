import React from "react";
import {
  PvDescription,
  Transformer,
  useParsedPvConnection,
} from "../pv/PvComponent";
import { submitAndRunPlanImmediately } from "../blueapi/blueapi";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type SelectionProps = PvDescription & {
  id: string;
  plan_name: string;
  choices: string[] | number[];
  transformValue?: Transformer;
};

export function SelectAndRunPlan(props: SelectionProps) {
  const currentValue = useParsedPvConnection({
    pv: props.pv,
    label: props.label,
    transformValue: props.transformValue,
  });
  console.log(`${props.id} current value: ${currentValue}`);
  const [_, updateVal] = React.useState<typeof currentValue>();
  // const [val, updateVal] = React.useState<typeof currentValue>();
  // console.log(val);

  const handleChange = (newValue: typeof currentValue) => {
    updateVal(newValue);
    submitAndRunPlanImmediately(props.plan_name, { position: newValue }); // TODO it won't always be position
  };

  return (
    <FormControl size="small" style={{ width: 150 }}>
      <InputLabel id={props.label}>{props.id}</InputLabel>
      <Select
        labelId={props.label}
        id={props.id}
        value={currentValue}
        label="blControl"
        // defaultValue={blPos}
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
