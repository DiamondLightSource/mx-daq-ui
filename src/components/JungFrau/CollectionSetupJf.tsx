import {
  Box,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AbortButton, RunPlanButton } from "blueapi/BlueapiComponents";
import { ParameterInput } from "components/ParameterInputs";
import { JungfrauRotationContext } from "context/jungfrau/JungfrauRotationContext";
import React from "react";
import { useContext, useState } from "react";

function fullStorageDirectory(visit: string, subDir: string): string {
  const date = new Date();
  const year = date.getFullYear();
  return `/dls/i24/data/${year}/${visit}/jungfrau/${subDir}`;
}

function RunButtons({
  visit,
  storageDirectory,
}: {
  visit: string;
  storageDirectory: string;
}): JSX.Element {
  const {
    expTime,
    detDist,
    fileName,
    shutterOpenT,
    omegaStart,
    omegaIncrement,
    scanWidth,
    transFract,
  } = useContext(JungfrauRotationContext);
  return (
    <React.Fragment>
      <Stack direction={"row"} spacing={4} justifyContent={"center"}>
        <RunPlanButton
          btnLabel="Run single rotation"
          planName="run_single_rotation_plan"
          planParams={{
            exposure_time_s: expTime,
            omega_start_deg: omegaStart,
            omega_increment_deg: omegaIncrement,
            total_scan_width_deg: scanWidth,
            detector_distance_mm: detDist,
            visit: visit,
            file_name: fileName,
            storage_directory: storageDirectory,
            shutter_opening_time_s: shutterOpenT,
            transmission: transFract[0],
          }}
          title="Run single rotation scan"
          btnSize="large"
        />
        <RunPlanButton
          btnLabel="Run multiple rotations"
          planName="run_multi_rotation_plan"
          planParams={{
            exposure_time_s: expTime,
            omega_start_deg: omegaStart,
            omega_increment_deg: omegaIncrement,
            total_scan_width_deg: scanWidth,
            detector_distance_mm: detDist,
            visit: visit,
            file_name: fileName,
            storage_directory: storageDirectory,
            shutter_opening_time_s: shutterOpenT,
            transmission_fractions: transFract,
          }}
          title="Run multiple rotation scans ar different transmissions"
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
  const [visit, setVisit] = useState<string>("cm40647-5");
  const storageDirectory = fullStorageDirectory(visit, context.directory);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction={"column"} alignItems={"center"} spacing={3}>
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.primary.contrastText,
            fontSize: 24,
            fontWeight: "fontWeightBold",
          }}
        >
          Parameters
        </Typography>
        <Grid container spacing={2} marginTop={3} justifyContent={"center"}>
          <ParameterInput
            value={visit}
            onSet={setVisit}
            label="Visit"
            tooltip="Current visit directory"
          />
          <ParameterInput
            value={context.directory}
            onSet={context.setDirectory}
            label="Sub-directory"
            tooltip="Location inside visit directory to save data"
          />
          <ParameterInput
            value={context.fileName}
            onSet={context.setFileName}
            label="File Name"
            tooltip="Name to use to save the data"
          />
        </Grid>
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
          <ParameterInput
            value={context.shutterOpenT}
            onSet={context.setShutterOpenT}
            label="Shutter opening time (s)"
            tooltip="Fast shutter opening time, in seconds"
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
            value={context.scanWidth}
            onSet={context.setScanWidth}
            label="Scan Width (deg)"
            tooltip="Total scan width, in deg"
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
        <RunButtons visit={visit} storageDirectory={storageDirectory} />
      </Stack>
    </Box>
  );
}
