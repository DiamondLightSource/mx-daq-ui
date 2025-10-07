import { Box, Grid2, Stack } from "@mui/material";
import React from "react";
import { ParameterInput } from "../ParameterInputs";
import { PumpProbeSelection } from "./PumpProbeSelection";

/**Main collection input window for the extruderpanel. */
export function CollectionSetupEx() {
  const [subDir, setSubDir] = React.useState<string>("path/to/dir");
  const [fileName, setFileName] = React.useState<string>("test");
  const [expTime, setExpTime] = React.useState<number>(0.01);
  const [numImages, setNumImages] = React.useState<number>(1);
  const [trans, setTrans] = React.useState<number>(0.3);
  const [detDist, setDetDist] = React.useState<number>(1350);
  const [pumpProbe, setPumpProbe] = React.useState<boolean>(false);

  return (
    <Box sx={{ flexGrow: 1, marginRight: 10, marginLeft: 10 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={4.5}>
          <Stack direction={"column"} spacing={1} alignItems={"center"}>
            <ParameterInput
              value={subDir}
              onSet={setSubDir}
              label="Sub-directory"
              tooltip="Location inside visit directory to save data"
            />
            <ParameterInput
              value={fileName}
              onSet={setFileName}
              label="File Name"
              tooltip="Filename prefix."
            />
            <ParameterInput
              value={numImages}
              onSet={setNumImages}
              label="Number of images"
              tooltip="How many images should be collected"
            />
            <ParameterInput
              value={expTime}
              onSet={setExpTime}
              label="Exposure Time (s)"
              tooltip="Exposure time for each window, in seconds"
            />
            <ParameterInput
              value={trans}
              onSet={setTrans}
              label="Transmission (fraction)"
              tooltip="Request transmission for collection, expressed as a fraction"
            />
            <ParameterInput
              value={detDist}
              onSet={setDetDist}
              label="Detector Distance (mm)"
              tooltip="Distance to move the detector y stage to, in millimeters"
            />
          </Stack>
        </Grid2>
        <Grid2 size={3}>
          <Stack direction={"column"} spacing={1} alignItems={"center"}>
            <PumpProbeSelection
              pumpProbe={pumpProbe}
              setPumpProbe={setPumpProbe}
            />
          </Stack>
        </Grid2>
        <Grid2 size={4.5}></Grid2>
      </Grid2>
    </Box>
  );
}
