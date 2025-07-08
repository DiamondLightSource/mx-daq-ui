import { Box, Grid2, Stack, useTheme } from "@mui/material";
import { PvItem } from "../pv/types";
import { PvComponent } from "../pv/PvComponent";
import { forceString, parseNumericPv } from "../pv/util";
import { WorkerStatus } from "../components/WorkerStatus";

type StateBoxProps = { bgColor: string; title: string; titleColor: string };

// These should be in a permanent sidebar
// See https://github.com/DiamondLightSource/mx-daq-ui/issues/46
// Maybe I should leave this for separate PR when I put in drawer ...
function PmacStagesState(props: StateBoxProps) {
  return (
    <Grid2
      bgcolor={props.bgColor}
      justifyContent={"center"}
      sx={{
        maxWidth: 500,
        position: "relative",
        padding: 2,
        display: "flex",
      }}
    >
      <Stack alignItems={"center"}>
        <Box color={props.titleColor}>
          <b>{props.title}</b>
        </Box>
        <Stack spacing={2} direction="row">
          <Stack alignItems={"center"} spacing={1}>
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
          <Stack alignItems={"center"} spacing={1} justifyContent={"center"}>
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
    </Grid2>
  );
}

export function BeamlineStatsTabPanel() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4} alignItems={"center"}>
        <WorkerStatus />
        <Grid2 container spacing={3} justifyContent="center">
          <Box bgcolor={bgColor}>
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
          </Box>
          <Box bgcolor={bgColor}>
            <PvComponent
              label="Energy"
              pv="ca://BL24I-MO-DCM-01:ENERGY.RBV"
              transformValue={parseNumericPv}
              decimals={4}
            />
          </Box>
          <Box bgcolor={bgColor}>
            <PvComponent
              label="Filter Transmission"
              pv="ca://BL24I-OP-ATTN-01:MATCH"
              transformValue={parseNumericPv}
              decimals={4}
            />
          </Box>
        </Grid2>
        <Grid2 container spacing={4} justifyContent="center">
          <Box bgcolor={bgColor}>
            <PvComponent
              label="Experiment Shutter"
              pv="ca://BL24I-PS-SHTR-01:CON"
              transformValue={forceString}
            />
          </Box>
          <Box bgcolor={bgColor}>
            <PvComponent
              label="Fast Shutter"
              pv="ca://BL24I-EA-SHTR-01:STA"
              transformValue={forceString}
            />
          </Box>
        </Grid2>
        <PmacStagesState
          bgColor={bgColor}
          title="Serial Fixed Target Stages"
          titleColor={theme.palette.info.main}
        />
      </Stack>
    </Box>
  );
}
