import { Box, Grid2, useTheme } from "@mui/material";
import { PvItem } from "../pv/types";
import { PvComponent } from "../pv/PvComponent";
import { forceString, parseNumericPv } from "../pv/util";
import { WorkerStatus } from "../components/WorkerStatus";

// These should be in a permanent sidebar
// See https://github.com/DiamondLightSource/mx-daq-ui/issues/46

export function BeamlineStatsTabPanel() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={3} justifyContent="center">
        <WorkerStatus />
        <Grid2 size={2} sx={{ bgcolor: bgColor }}>
          <PvComponent
            label="Flux"
            pv="ca://BL24I-EA-FLUX-01:XBPM-03"
            transformValue={parseNumericPv}
            decimals={2}
            scaleFactor={1e-9}
            render={({ label, value }: PvItem) => {
              return (
                <Box>
                  <p>
                    <b>{label}:</b> {value}e+09
                  </p>
                </Box>
              );
            }}
          />
        </Grid2>
        <Grid2 size={2} sx={{ bgcolor: bgColor }}>
          <PvComponent
            label="Energy"
            pv="ca://BL24I-MO-DCM-01:ENERGY.RBV"
            transformValue={parseNumericPv}
            decimals={4}
          />
        </Grid2>
        <Grid2 size={2} sx={{ bgcolor: bgColor }}>
          <PvComponent
            label="Shutter"
            pv="ca://BL24I-PS-SHTR-01:CON"
            transformValue={forceString}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}
