import {
  Box,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ParameterInput } from "components/ParameterInputs";
import { JungfrauRotationContext } from "context/jungfrau/JungfrauRotationContext";
import { useContext, useState } from "react";

function fullStorageDirectory(visit: string, subDir: string): string {
  const date = new Date();
  const year = date.getFullYear();
  return `/dls/i24/data/${year}/${visit}/jungfrau/${subDir}`;
}

export function CollectionSetupJf() {
  const theme = useTheme();
  const context = useContext(JungfrauRotationContext);
  const [visit, setVisit] = useState<string>("cm40647-5");
  const storageDirectory = fullStorageDirectory(visit, context.directory);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction={"column"} alignItems={"center"} spacing={2}>
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
      </Stack>
    </Box>
  );
}
