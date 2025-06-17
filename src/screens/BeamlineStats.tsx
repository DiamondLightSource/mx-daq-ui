import { Box, Grid2, useTheme } from "@mui/material";
import { PvItem, PvComponent } from "../pv/PvComponent";
import { forceString, parseNumericPv } from "../pv/util";
import { WorkerStatus } from "../components/WorkerStatus";
import { DisplayPvBox } from "../pv/DisplayPv";

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
        <Grid2 size={2} sx={{ bgcolor: bgColor }}>
          {/* // <PvComponent */}
          <DisplayPvBox
            label="Energy"
            pv="ca://BL24I-MO-DCM-01:ENERGY.RBV"
            transformValue={parseNumericPv}
            decimals={4}
            // render={({ label, value }: PvItem) => {
            //   return (
            //     // <Box>
            //     <p>
            //       <b>{label}:</b> {value}
            //       {/* // SIGH WILL FIGURE OUT TYPE ERROR ANOTHER TIME */}
            //       {/* <b>{label}:</b> {parseNumericPv(value, 4)} */}
            //     </p>
            //     // </Box>
            //   );
            // }}
          />
        </Grid2>
        <Grid2 size={2} sx={{ bgcolor: bgColor }}>
          {/* <DisplayPvBox */}
          <PvComponent
            label="Shutter"
            pv="ca://BL24I-PS-SHTR-01:CON"
            render={({ label, value }: PvItem) => {
              return (
                <Box>
                  <p>
                    {/* <b>{label}:</b> {value} */}
                    <b>{label}:</b> {value?.toString().slice(7)}
                  </p>
                </Box>
              );
            }}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}
