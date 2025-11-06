import { Box, Grid2, Stack, TextField, useTheme } from "@mui/material";
import { CoordNumberInput } from "../../components/CoordNumberInput";
import { useContext } from "react";
import { crosshairContext } from "./OavMover";

export function BeamCentre() {
  const theme = useTheme();
  const ctx = useContext(crosshairContext);
  if (!ctx) throw new Error("BeamCentre must be used within OavMover");
  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <Grid2 container spacing={0} columns={3}>
        <Grid2 size={3} padding={1}>
          <b>Beam center:</b>
        </Grid2>
        <Grid2 size={3}>
          <Stack direction="row" spacing={2} padding={2}>
            <CoordNumberInput
              placeholder="x"
              onChange={(_e, val) => ctx.setCrosshairX(val ? val : 0)}
              defaultValue={ctx.crosshairX}
              min={0}
              max={1000}
              aria-label="X"
            />
            <CoordNumberInput
              placeholder="y"
              onChange={(_e, val) => ctx.setCrosshairY(val ? val : 0)}
              defaultValue={ctx.crosshairY}
              min={0}
              max={750}
              aria-label="Y"
            />
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export function PixelsToMicrons({
  setPixelsPerMicron,
}: {
  setPixelsPerMicron: React.Dispatch<React.SetStateAction<number>>;
}) {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.background.paper}
      borderRadius={5}
      paddingTop={1}
      paddingBottom={1}
    >
      <Grid2 container spacing={0} columns={3}>
        <Grid2 size={3}>
          <Stack direction="row" spacing={2} padding={2}>
            <TextField
              label="Pixels per micron"
              onChange={(e) =>
                setPixelsPerMicron(
                  Number(e.target.value) ? Number(e.target.value) : 0
                )
              }
              defaultValue={1.25}
              aria-label="Pixels per micron"
            />
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}
