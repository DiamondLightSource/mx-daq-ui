import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { forceString, useParsedPvConnection } from "#/pv/util.ts";
import { submitAndRunPlanImmediately } from "#/blueapi/blueapi.ts";
import type { PvDescription } from "#/pv/types.ts";
import { parseInstrumentSession, readVisitFromPv } from "#/blueapi/visit.ts";

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
    }),
  );
  console.log(`${props.id} current value: ${currentValue}`);
  const [_, updateVal] = React.useState<string>(currentValue.toString());

  // FIXME, temporary - will be fixed by using context everywhere
  const fullVisit = readVisitFromPv();
  let instrumentSession: string;

  const handleChange = (newValue: typeof currentValue) => {
    updateVal(newValue);
    instrumentSession = parseInstrumentSession(fullVisit);
    submitAndRunPlanImmediately({
      planName: props.plan_name,
      planParams: { position: newValue },
      instrumentSession: instrumentSession,
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
