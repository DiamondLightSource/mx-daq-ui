import * as React from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_PV_QUERY,
  parseResult,
  PvItem,
  ReadPvComponentProps,
  ReadPvProps,
  SET_PV_QUERY,
  SetPvProps,
} from "./PvUtils";
import { Box, Button, Stack } from "@mui/material";
import { PvDTypeUnion } from "./PvUtils";

type ButtonColors = "error" | "inherit" | "primary" | "secondary" | "success" | "info" | "warning";

function PvComponent(props: ReadPvComponentProps) {
  const { loading, error, data } = useQuery(GET_PV_QUERY, {
    variables: { id: props.pv },
    pollInterval: props.pollInterval || 100,
  });
  const result = () => {
    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;
    const rawResult: string = data.getChannel.value.string;
    return props.dType ? parseResult(rawResult, props.dType, props.sigFigs) : rawResult;
  };
  return props.render({ label: props.label, value: result() });
}

export function PollingRoPvBox(props: ReadPvProps) {
  return PvComponent({
    ...props,
    render: (props: PvItem) => (
      <Stack spacing={2}>
        <Box sx={{ padding: 2 }}>
          <p>{props.label}:</p>
        </Box>
        <Box sx={{ padding: 2 }}>
          <p>{props.value}</p>
        </Box>
      </Stack>
    ),
  });
}

export function OnOffPvButton(
  props: ReadPvProps & { colormap: (value: PvDTypeUnion) => ButtonColors }
) {
  const colormap = props.colormap;
  return PvComponent({
    ...props,
    render: (props: PvItem) => (
      <Stack spacing={2}>
        <Box sx={{ padding: 2 }}>
          <p>{props.label}:</p>
        </Box>
        <Box sx={{ padding: 2 }}>
          <Button variant="text" color={colormap(props.value)}>
            {props.value}
          </Button>
        </Box>
      </Stack>
    ),
  });
}

// TODO: make this use a context for the current value
export function SetPvButton(props: SetPvProps) {
  const modifyNumber = props.modifyNumber || ((x) => x);
  const reading = useQuery(GET_PV_QUERY, {
    variables: { id: props.pv },
    pollInterval: props.pollInterval || 100,
  });
  const current = (() => {
    if (reading.loading) return 0;
    if (reading.error) return 0;
    return parseFloat(reading.data.getChannel.value.string);
  })();
  const [setPv, mutationData] = useMutation(SET_PV_QUERY, {
    variables: { ids: [props.set_pv || props.pv], values: [modifyNumber(current).toString()] },
  });
  if (mutationData.loading) return <Box>Loading...</Box>;
  if (mutationData.error) return <Box>{`Error! ${mutationData.error}`}</Box>;
  return <Button onClick={(_e) => setPv()}>{props.action_label}</Button>;
}
