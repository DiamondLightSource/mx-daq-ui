import { TextField, Tooltip } from "@mui/material";
import React from "react";

interface InputProps<T> {
  value: T;
  onSet: React.Dispatch<React.SetStateAction<T>>;
  label: string;
  tooltip?: string;
}

export function ParameterInput<T>(props: InputProps<T>) {
  return (
    <Tooltip title={props.tooltip ? props.tooltip : ""} placement="left">
      <TextField
        size="small"
        label={props.label}
        defaultValue={props.value}
        onChange={(e) => props.onSet(e.target.value as T)}
        style={{ width: 180 }}
      />
    </Tooltip>
  );
}
