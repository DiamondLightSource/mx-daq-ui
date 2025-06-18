import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { PvComponentProps } from "./types";
import { useParsedPvConnection } from "./util";

function defaultPvBox(label: string, value: number | string): JSX.Element {
  return (
    <Box>
      <p>
        <b>{label}:</b> {value}
      </p>
    </Box>
  );
}

function WsPvComponent(props: PvComponentProps): JSX.Element {
  const latestValue = useParsedPvConnection(props);
  const renderedPvBox = props.render ? (
    <Box>{props.render({ label: props.label, value: latestValue })}</Box>
  ) : (
    defaultPvBox(props.label, latestValue)
  );
  return renderedPvBox;
}

export function PvComponent(props: PvComponentProps) {
  return (
    <ErrorBoundary fallback={<p>Error Connecting!</p>}>
      {WsPvComponent(props)}
    </ErrorBoundary>
  );
}
