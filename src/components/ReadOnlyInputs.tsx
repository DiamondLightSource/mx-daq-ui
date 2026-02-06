import { RoPvBox } from "#/pv/PvComponent.tsx";
import { Grid2 } from "@mui/material";

type RoPvAddress = {
  visit: string;
  detector: string;
};

/**
 * A couple of read-only boxes showing what the visit and detector in use are.
 */
export function ReadOnlyInputs(props: RoPvAddress) {
  return (
    <Grid2 size={12}>
      <RoPvBox label="Visit" pv={props.visit} />
      <RoPvBox label="Detector in use" pv={props.detector} />
    </Grid2>
  );
}
