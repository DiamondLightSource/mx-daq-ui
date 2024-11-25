import { useConnection } from "@diamondlightsource/cs-web-lib";
import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { RawValue } from "./util";

export type PvDisplayTypes = string | number;

export type PvItem = { label: string; value: RawValue | PvDisplayTypes };
export type PvItemComponent = ({ label, value }: PvItem) => JSX.Element;
export type PvDescription = {
  label: string;
  pv: string;
};
export type PvComponentProps = PvDescription & {
  render: PvItemComponent;
  transformValue?: (value: RawValue) => string | number;
};

function WsPvComponent(props: PvComponentProps) {
  const [_effectivePvName, connected, _readonly, latestValue] = useConnection(
    props.label,
    props.pv
  );
  const rawValue: RawValue = connected ? latestValue : "not connected";
  const returnValue = props.transformValue ? props.transformValue(rawValue) : rawValue;
  return <Box>{props.render({ label: props.label, value: returnValue })}</Box>;
}

export function PvComponent(props: PvComponentProps) {
  return <ErrorBoundary fallback={<p>Error Connecting!</p>}>{WsPvComponent(props)}</ErrorBoundary>;
}
