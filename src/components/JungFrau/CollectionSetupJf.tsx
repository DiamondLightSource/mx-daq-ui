import { RunPlanButton, AbortButton } from "#/blueapi/BlueapiComponents.tsx";
import { JungfrauRotationContext } from "#/context/jungfrau/JungfrauRotationContext.ts";
import { VisitContext } from "#/context/VisitContext.ts";
import {
  Box,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useContext } from "react";
import { ParameterInput } from "../ParameterInputs";
import { fullStorageDirectory, getCurrentVisit } from "./jfUtils";

function RunButtons({ currentVisit }: { currentVisit: string }): JSX.Element {
  const {
    expTime,
    detDist,
    fileName,
    omegaStart,
    omegaIncrement,
    transFract,
    sampleId,
  } = useContext(JungfrauRotationContext);
  console.log(transFract);
  return (
    <React.Fragment>
      <Stack direction={"row"} spacing={4} justifyContent={"center"}>
        <RunPlanButton
          btnLabel="Run rotation scan"
          planName="gui_run_jf_rotation_scan"
          planParams={{
            exposure_time_s: expTime,
            omega_start_deg: omegaStart,
            omega_increment_deg: omegaIncrement,
            detector_distance_mm: detDist,
            filename: fileName,
            transmissions: transFract,
            sample_id: sampleId,
          }}
          currentVisit={currentVisit}
          title="Run the jungfrau rotation scan plan"
          btnSize="large"
        />
        <AbortButton />
      </Stack>
    </React.Fragment>
  );
}

export function CollectionSetupJf() {
  const theme = useTheme();
  const context = useContext(JungfrauRotationContext);
  const { visit } = useContext(VisitContext);
  const currentVisit = getCurrentVisit(visit);
  const storageDirectory = fullStorageDirectory(currentVisit);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction={"column"} alignItems={"center"} spacing={5}>
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.primary.contrastText,
            fontSize: 24,
            fontWeight: "fontWeightBold",
          }}
        >
          Collection Parameters
        </Typography>
        <TextField
          size="small"
          label="Storage Directory"
          value={storageDirectory}
          style={{ width: 570 }}
          slotProps={{
            input: { readOnly: true },
          }}
        />
        <Grid container spacing={2} marginTop={3} justifyContent={"center"}>
          <ParameterInput
            value={context.fileName}
            onSet={context.setFileName}
            label="File Name"
            tooltip="Name to use to save the data"
          />
          <ParameterInput
            value={context.expTime}
            onSet={context.setExpTime}
            label="Exposure Time (s)"
            tooltip="Exposure time for each window, in seconds"
          />
          <ParameterInput
            value={context.detDist}
            onSet={context.setDetDist}
            label="Detector Distance (mm)"
            tooltip="Sample detector distance, in millimeters"
          />
        </Grid>
        <Grid container spacing={2} marginTop={3} justifyContent={"center"}>
          <ParameterInput
            value={context.omegaStart}
            onSet={context.setOmegaStart}
            label="Omega start (deg)"
            tooltip="Rotation start value, in deg"
          />
          <ParameterInput
            value={context.omegaIncrement}
            onSet={context.setOmegaIncrement}
            label="Omega increment (deg)"
            tooltip="Rotation increment step, in deg"
          />
          <ParameterInput
            value={context.sampleId}
            onSet={context.setSampleId}
            label="Sample ID"
            tooltip="Sample id"
          />
        </Grid>
        <Grid container spacing={2} marginTop={3} justifyContent={"center"}>
          <ParameterInput
            value={context.transFract}
            onSet={context.setTransFract}
            label="Transmission (fraction)"
            tooltip="Request transmission value(s) for collection, expressed as a fraction. If running a single rotation, just input one value, if running multiples please pass a list."
          />
        </Grid>
        <RunButtons currentVisit={currentVisit} />
      </Stack>
    </Box>
  );
}
