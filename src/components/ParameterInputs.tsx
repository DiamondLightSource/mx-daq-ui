import { TextField, Tooltip } from "@mui/material";
import React from "react";

interface InputProps<T> {
  value: T;
  onSet: React.Dispatch<React.SetStateAction<T>>;
  label: string;
  tooltip?: string;
}

export function ParameterInput<T>(props: InputProps<T>) {
  const handleChange = (newValue: string) => {
    if (typeof props.value === "number") {
      props.onSet(Number(newValue));
    } else {
      props.onSet(newValue);
    }
  };
  return (
    <Tooltip title={props.tooltip ? props.tooltip : ""} placement="left">
      <TextField
        size="small"
        label={props.label}
        defaultValue={props.value}
        onChange={(e) => handleChange(e.target.value)}
        style={{ width: 180 }}
      />
    </Tooltip>
  );
}
