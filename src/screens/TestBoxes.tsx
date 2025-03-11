import { Box, Grid2, useTheme } from "@mui/material";
import { PvItem, PvComponent } from "../pv/PvComponent";
import { parseNumericPv } from "../pv/util";

export function TestBoxesTabPanel() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <div>
      <Grid2 container spacing={2}>
        <Grid2 size={4} sx={{ bgcolor: bgColor }}>
          <PvComponent
            label="Flux"
            pv="ca://BL24I-EA-FLUX-01:XBPM-03"
            render={({ label, value }: PvItem) => {
              return (
                <Box>
                  <p>
                    <b>{label}:</b> {parseNumericPv(value, 2, 1e-9)}e+9
                  </p>
                </Box>
              );
            }}
          />
        </Grid2>
        <Grid2 size={4} sx={{ bgcolor: bgColor }}>
          <PvComponent
            label="Energy"
            pv="ca://BL24I-MO-DCM-01:ENERGY.RBV"
            render={({ label, value }: PvItem) => {
              return (
                <Box>
                  <p>
                    <b>{label}:</b> {parseNumericPv(value, 4)}
                  </p>
                </Box>
              );
            }}
          />
        </Grid2>
        <Grid2 size={4} sx={{ bgcolor: bgColor }}>
          <PvComponent
            label="Shutter"
            pv="ca://BL24I-PS-SHTR-01:CON"
            render={({ label, value }: PvItem) => {
              return (
                <Box>
                  <p>
                    <b>{label}:</b> {value?.toString().slice(7)}
                  </p>
                </Box>
              );
            }}
          />
        </Grid2>
      </Grid2>
    </div>
  );
}
