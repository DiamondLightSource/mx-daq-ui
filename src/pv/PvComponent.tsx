import { useConnection, DType } from "@diamondlightsource/cs-web-lib";
import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
type RawValue = DType | "not connected" | undefined;
export type PvItem = { label: string; value: RawValue };
export type PvItemComponent = ({ label, value }: PvItem) => JSX.Element;
export type PvDescription = {
  label: string;
  pv: string;
};
export type PvComponentProps = PvDescription & {
  render: PvItemComponent;
};

function WsPvComponent(props: PvComponentProps) {
  const [_effectivePvName, connected, _readonly, latestValue] = useConnection(
    props.label,
    props.pv
  );
  const returnValue = connected ? latestValue : "not connected";
  return <Box>{props.render({ label: props.label, value: returnValue })}</Box>;
}

export function PvComponent(props: PvComponentProps) {
  return <ErrorBoundary fallback={<p>Error Connecting!</p>}>{WsPvComponent(props)}</ErrorBoundary>;
}

export function forceString(value: RawValue): string {
  let displayValue: string;
  if (value != "not connected" && value != undefined) {
    const stringVal = value.getStringValue();
    displayValue = stringVal ? stringVal : "undefined";
  } else if (value === "not connected") {
    displayValue = "not connected";
  } else {
    displayValue = "undefined";
  }
  return displayValue;
}
