import { Box, Grid2, Stack, useTheme } from "@mui/material";
import { PvItem } from "../pv/types";
import { PvComponent } from "../pv/PvComponent";
import { forceString, parseNumericPv } from "../pv/util";
import { WorkerStatus } from "../components/WorkerStatus";

// These should be in a permanent sidebar
// See https://github.com/DiamondLightSource/mx-daq-ui/issues/46
// Maybe I should leave this for separate PR when I put in drawer ...
function PmacStagesState() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <Grid2 bgcolor={bgColor} justifyContent={"center"}>
      {/* // <Box
    //   sx={{
    //     maxWidth: 400,
    //     padding: 2,
    //     position: "relative",
    //     zIndex: 1,
    //     left: 250,
    //   }}
    //   component={"section"}
    //   bgColor={bgColor}
    // > */}
      <Stack alignItems={"center"}>
        <Box alignItems={"center"} color={theme.palette.info.main}>
          <b>Serial Fixed Target Stages</b>
        </Box>
        <Stack spacing={2} direction="row">
          <Stack alignItems={"center"} spacing={1}>
            {/* <Stack alignItems={"center"} spacing={1} bgcolor={bgColor}> */}
            {/* <Box color={theme.palette.info.main}>
          <b>PMAC Stages</b>
        </Box> */}
            <PvComponent
              label="Stage X"
              pv="ca://ME14E-MO-CHIP-01:X.RBV"
              transformValue={parseNumericPv}
              decimals={4}
            />
            <PvComponent
              label="Stage Y"
              pv="ca://ME14E-MO-CHIP-01:Y.RBV"
              transformValue={parseNumericPv}
              decimals={4}
            />
            <PvComponent
              label="Stage Z"
              pv="ca://ME14E-MO-CHIP-01:Z.RBV"
              transformValue={parseNumericPv}
              decimals={4}
            />
          </Stack>
          <Stack alignItems={"center"} spacing={1}>
            <PvComponent
              label="Scan Status"
              pv="ca://BL24I-MO-STEP-14:signal:P2401"
              transformValue={forceString}
            />
            <PvComponent
              label="Frames Counter"
              pv="ca://BL24I-MO-STEP-14:signal:P2402"
              transformValue={forceString}
            />
          </Stack>
        </Stack>
      </Stack>
      {/* </Box> */}
    </Grid2>
  );
}

export function BeamlineStatsTabPanel() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <WorkerStatus />
        <Grid2 container spacing={4} justifyContent="center">
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
          <Grid2 size={3} sx={{ bgcolor: bgColor }}>
            <PvComponent
              label="Filter Transmission"
              pv="ca://BL24I-OP-ATTN-01:MATCH"
              transformValue={parseNumericPv}
              decimals={4}
            />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={4} justifyContent="center">
          <Grid2 size={2} sx={{ bgcolor: bgColor }}>
            <PvComponent
              label="Expt Shutter"
              pv="ca://BL24I-PS-SHTR-01:CON"
              transformValue={forceString}
            />
          </Grid2>
          <Grid2 size={2} sx={{ bgcolor: bgColor }}>
            <PvComponent
              label="Fast Shutter"
              pv="ca://BL24I-EA-SHTR-01:STA"
              transformValue={forceString}
            />
          </Grid2>
        </Grid2>
        <PmacStagesState />
      </Stack>
    </Box>
  );
}
