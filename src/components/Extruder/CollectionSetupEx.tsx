import { Box, Grid2, Stack } from "@mui/material";
import React from "react";
import {
  LaserCheckButtons,
  PumpProbeSelection,
  PumpProbeSetup,
} from "./PumpProbeSelection";
import { RunPlanButton, AbortButton } from "#/blueapi/BlueapiComponents.tsx";
import { ParameterInput } from "../ParameterInputs";

/**Main collection input window for the extruderpanel. */
export function CollectionSetupEx() {
  const [subDir, setSubDir] = React.useState<string>("path/to/dir");
  const [fileName, setFileName] = React.useState<string>("test");
  const [expTime, setExpTime] = React.useState<number>(0.01);
  const [numImages, setNumImages] = React.useState<number>(1);
  const [trans, setTrans] = React.useState<number>(0.3);
  const [detDist, setDetDist] = React.useState<number>(1350);
  const [pumpProbe, setPumpProbe] = React.useState<boolean>(false);
  const [laserDwell, setLaserDwell] = React.useState<number>(0);
  const [laserDelay, setLaserDelay] = React.useState<number>(0);

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
            <PumpProbeSetup
              dwell={laserDwell}
              delay={laserDelay}
              render={pumpProbe}
              setDwell={setLaserDwell}
              setDelay={setLaserDelay}
            />
            <LaserCheckButtons />
          </Stack>
        </Grid2>
        <Grid2 size={4.5}>
          <Stack direction={"column"} spacing={1} alignItems={"center"}>
            <RunPlanButton
              btnLabel="Initialise on Start"
              planName="initialise_extruder"
              title="Initialise parameters for extruder"
              btnSize="large"
            />
            <RunPlanButton
              btnLabel="Enter hutch"
              planName="enter_hutch"
              title="Move detector stage before entering hutch"
              btnSize="large"
            />
          </Stack>
        </Grid2>
        <Grid2 size={12}>
          <Stack direction={"row"} spacing={8} justifyContent={"center"}>
            <RunPlanButton
              btnLabel="Start!"
              planName="gui_run_extruder_collection"
              planParams={{
                sub_dir: subDir,
                file_name: fileName,
                exp_time: expTime,
                det_dist: detDist,
                transmission: trans,
                num_images: numImages,
                pump_probe: pumpProbe,
                laser_dwell: laserDwell,
                laser_delay: laserDelay,
              }}
              title="Start extruder collection"
              btnSize="large"
            />
            <AbortButton />
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}
