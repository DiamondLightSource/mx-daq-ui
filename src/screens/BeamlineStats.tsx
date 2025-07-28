import {
  Box,
  Card,
  CardContent,
  Grid2,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { PvItem } from "../pv/types";
import { PvComponent } from "../pv/PvComponent";
import { forceString, parseNumericPv } from "../pv/util";
import { WorkerStatus } from "../components/WorkerStatus";

type StateBoxProps = {
  children: React.ReactNode;
  bgColor?: string;
  title?: string;
  titleColor?: string;
};

function StateCard(props: StateBoxProps) {
  const bgColor = props.bgColor ? props.bgColor : "#fff";
  if (props.title) {
    return (
      <Card variant="outlined" sx={{ minWidth: 300, bgcolor: bgColor }}>
        <CardContent>
          <Typography
            variant="h1"
            sx={{
              color: props.titleColor ? props.titleColor : "#000",
              fontSize: 18,
              fontWeight: "fontWeightBold",
            }}
          >
            {props.title}
          </Typography>
          {props.children}
        </CardContent>
      </Card>
    );
  }
  return (
    <Card variant="outlined" sx={{ minWidth: 300, bgcolor: bgColor }}>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
}

function PmacStagesState(props: Omit<StateBoxProps, "children">) {
  return (
    <StateCard
      bgColor={props.bgColor}
      title={props.title}
      titleColor={props.titleColor}
    >
      <PvComponent
        label="Stage X"
        pv="ca://BL24I-MO-CHIP-01:X.RBV"
        transformValue={parseNumericPv}
        decimals={4}
      />
      <PvComponent
        label="Stage Y"
        pv="ca://BL24I-MO-CHIP-01:Y.RBV"
        transformValue={parseNumericPv}
        decimals={4}
      />
      <PvComponent
        label="Stage Z"
        pv="ca://BL24I-MO-CHIP-01:Z.RBV"
        transformValue={parseNumericPv}
        decimals={4}
      />
    </StateCard>
  );
}

function ScanStatus(props: Omit<StateBoxProps, "children">) {
  return (
    <StateCard
      bgColor={props.bgColor}
      title={props.title}
      titleColor={props.titleColor}
    >
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
    </StateCard>
  );
}

function BeamlineInfo(props: Omit<StateBoxProps, "children">) {
  return (
    <StateCard
      bgColor={props.bgColor}
      title={props.title}
      titleColor={props.titleColor}
    >
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
      <PvComponent
        label="Energy"
        pv="ca://BL24I-MO-DCM-01:ENERGY.RBV"
        transformValue={parseNumericPv}
        decimals={4}
      />
      <PvComponent
        label="Filter Transmission"
        pv="ca://BL24I-OP-ATTN-01:MATCH"
        transformValue={parseNumericPv}
        decimals={4}
      />
    </StateCard>
  );
}

function ShuttersState(props: Omit<StateBoxProps, "children">) {
  return (
    <StateCard
      bgColor={props.bgColor}
      title={props.title}
      titleColor={props.titleColor}
    >
      <PvComponent
        label="Experiment Shutter"
        pv="ca://BL24I-PS-SHTR-01:CON"
        transformValue={forceString}
      />
      <PvComponent
        label="Fast Shutter"
        pv="ca://BL24I-EA-SHTR-01:STA"
        transformValue={forceString}
      />
    </StateCard>
  );
}

// These should be in a permanent sidebar
// See https://github.com/DiamondLightSource/mx-daq-ui/issues/46
// Maybe I should leave this for separate PR when I put in drawer ...
export function BeamlineStatsTabPanel() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <Box sx={{ flexGrow: 1, marginLeft: 30, marginRight: 30 }}>
      {/* <Stack spacing={4} alignItems={"center"}> */}
      <Stack spacing={4}>
        <WorkerStatus />
        <Grid2 container spacing={2}>
          <BeamlineInfo
            bgColor={bgColor}
            title="Beamline Status"
            titleColor={theme.palette.info.main}
          />
          <ShuttersState
            bgColor={bgColor}
            title="Shutters"
            titleColor={theme.palette.info.main}
          />
          <PmacStagesState
            bgColor={bgColor}
            title="Serial Fixed Target Stages"
            titleColor={theme.palette.info.main}
          />
          <ScanStatus
            bgColor={bgColor}
            title="Scan Monitor"
            titleColor={theme.palette.info.main}
          />
        </Grid2>
      </Stack>
    </Box>
  );
}
