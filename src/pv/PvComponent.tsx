import { useConnection, DType } from "@diamondlightsource/cs-web-lib";
import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
export type PvItem = { label: string; value: DType | undefined };
export type PvItemComponent = ({ label, value }: PvItem) => JSX.Element;
export type PvDescription = {
  label: string;
  pv: string;
};
export type PvComponentProps = PvDescription & {
  render: PvItemComponent;
};

function WsPvComponent(props: PvComponentProps) {
  const [effectivePvName, _connected, _readonly, latestValue] = useConnection(
    props.label,
    props.pv
  );
  return <Box>{props.render({ label: effectivePvName, value: latestValue })}</Box>;
}

export function PvComponent(props: PvComponentProps) {
  return <ErrorBoundary fallback={<p>Error</p>}>{WsPvComponent(props)}</ErrorBoundary>;
}
