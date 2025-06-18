import { Box } from "@mui/material";
import { PvDescription, PvTransformer, readPvRawValue } from "./PvComponent";
import { ErrorBoundary } from "react-error-boundary";
import { RawValue } from "./util";

type RoPvProps = PvDescription & {
  // render: PvItemComponent;
  transformValue?: PvTransformer;
  decimals?: number;
  scaleFactor?: number;
};

type RenderedValue = RawValue | string | number;

function parsePvValue(props: RoPvProps) {
  const rawValue = readPvRawValue(props.label, props.pv);
  let valueToRender: RenderedValue;
  if (rawValue === "not connected") {
    valueToRender = rawValue;
  } else {
    valueToRender = props.transformValue
      ? props.transformValue(rawValue, props.decimals, props.scaleFactor)
      : rawValue;
    // valueToRender = valueToRender?.toString().slice(7);
  }
  return valueToRender;
}

function RoPvComponent(props: RoPvProps): JSX.Element {
  const latestValue = parsePvValue(props);
  // return <Box>{props.render({ label: props.label, value: latestValue })}</Box>;
  return (
    <Box>
      <p>
        <b>{props.label}:</b> {latestValue}
      </p>
    </Box>
  );
}

export function DisplayPvBox(props: RoPvProps) {
  return (
    <ErrorBoundary fallback={<p>ERROR CONNECTING</p>}>
      {RoPvComponent(props)}
    </ErrorBoundary>
  );
}
