import { useConnection } from "@diamondlightsource/cs-web-lib";
import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { RawValue } from "./util";

export type Transformer = (value: RawValue) => string | number;
export type PvDisplayTypes = string | number;
export type PvItem = { label: string; value: RawValue | PvDisplayTypes };
export type PvItemComponent = ({ label, value }: PvItem) => JSX.Element;
export type PvItemHandler = ({ label, value }: PvItem) => void;
export type PvDescription = {
  label: string;
  pv: string;
};
export type PvComponentProps = PvDescription & {
  render: PvItemComponent;
  transformValue?: Transformer;
};

export function readPvRawValue(label: string, pv: string): RawValue {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [_effectivePvName, connected, _readonly, latestValue] = useConnection(
    label,
    pv
  );
  const rawValue: RawValue = connected ? latestValue : "not connected";
  return rawValue;
}

export function useParsedPvConnection(
  props: PvDescription & { transformValue?: Transformer }
) {
  const rawValue = readPvRawValue(props.label, props.pv);
  const returnValue = props.transformValue
    ? props.transformValue(rawValue)
    : rawValue;
  console.log(
    `fetched parsed value ${returnValue} for PV: ${props.pv} labeled ${props.label}`
  );
  return returnValue;
}

function WsPvComponent(props: PvComponentProps) {
  const latestValue = useParsedPvConnection(props);
  return <Box>{props.render({ label: props.label, value: latestValue })}</Box>;
}

export function PvComponent(props: PvComponentProps) {
  return (
    <ErrorBoundary fallback={<p>Error Connecting!</p>}>
      {WsPvComponent(props)}
    </ErrorBoundary>
  );
}
