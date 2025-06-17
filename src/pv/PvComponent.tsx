import { useConnection } from "@diamondlightsource/cs-web-lib";
import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { RawValue, TransformString, TransformNumeric } from "./util";

export type PvTransformer = TransformString | TransformNumeric; /// = (value: RawValue) => string | number; // type for callback function
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
  transformValue?: PvTransformer;
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
  props: PvDescription & { transformValue?: PvTransformer }
) {
  const rawValue = readPvRawValue(props.label, props.pv);
  const returnValue = props.transformValue
    ? props.transformValue(rawValue)
    : rawValue; // This is never actually used! Because transformValue is optional and never passed.
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
