import { Box, useTheme } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { PvComponentProps, PvDescription, PvItem } from "./types";
import { useParsedPvConnection, forceString } from "./util";

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
  const theme = useTheme();
  return (
    <ErrorBoundary
      fallback={
        <Box color={theme.palette.error.main}>
          <p>Error Connecting!</p>
        </Box>
      }
    >
      {WsPvComponent(props)}
    </ErrorBoundary>
  );
}

export function RoPvBox(props: PvDescription) {
  return PvComponent({
    ...props,
    transformValue: forceString,
    render: (props: PvItem) => {
      return (
        <Box>
          <p>
            {props.label} : {props.value}
          </p>
        </Box>
      );
    },
  });
}
