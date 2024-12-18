import { Box, Button, Grid2, Stack, TextField, useTheme } from "@mui/material";

import React from "react";
import { PvComponent, PvItem } from "../pv/PvComponent";

import { submitAndRunPlanImmediately } from "../blueapi/blueapi";

export function CollectionInput() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  const [subDir, setSubDir] = React.useState<string>("path/to/dir");
  const [chipName, setChipName] = React.useState<string>("test");
  const [expTime, setExpTime] = React.useState<number>(0.01);
  const [shots, setShots] = React.useState<number>(1);
  const [trans, setTrans] = React.useState<number>(0.3);
  const [detDist, setDetDist] = React.useState<number>(1350);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={12} sx={{ bgcolor: bgColor }}>
          <PvComponent
            label="Visit"
            pv="ca://ME14E-MO-IOC-01:GP100"
            render={({ label, value }: PvItem) => {
              return (
                <Box>
                  <p>
                    <b>{label}:</b> {value?.toString().slice(7)}
                  </p>
                </Box>
              );
            }}
          />
        </Grid2>
        <Grid2 size={6} sx={{ bgcolor: bgColor }} justifyContent={"center"}>
          <Stack direction={"column"} spacing={1} alignContent={"center"}>
            <TextField
              size="small"
              label="subDirectory"
              defaultValue={subDir}
              onChange={(e) => setSubDir(String(e.target.value))}
              style={{ width: 200 }}
            />
            <TextField
              size="small"
              label="chipName"
              defaultValue={chipName}
              onChange={(e) => setChipName(String(e.target.value))}
              style={{ width: 200 }}
            />
            <TextField
              size="small"
              label="shotsPerAperture"
              defaultValue={shots}
              onChange={(e) => setShots(Number(e.target.value))}
              style={{ width: 200 }}
            />
            <TextField
              size="small"
              label="exposureTime (s)"
              defaultValue={expTime}
              onChange={(e) => setExpTime(Number(e.target.value))}
              style={{ width: 200 }}
            />
            <TextField
              size="small"
              label="transmission (fraction)"
              defaultValue={trans}
              onChange={(e) => setTrans(Number(e.target.value))}
              style={{ width: 200 }}
            />
            <TextField
              size="small"
              label="detectorDistance (mm)"
              defaultValue={detDist}
              onChange={(e) => setDetDist(Number(e.target.value))}
              style={{ width: 200 }}
            />
          </Stack>
          <Button
            onClick={() =>
              submitAndRunPlanImmediately("gui_set_parameters", {
                sub_dir: subDir,
                chip_name: chipName,
                exp_time: expTime,
                det_dist: detDist,
                transmission: trans,
                n_shots: shots,
              })
            }
          >
            Run (for now just set)!
          </Button>
        </Grid2>
        <Grid2 size={6} sx={{ bgcolor: bgColor }}>
          <p> map space ? </p>
        </Grid2>
      </Grid2>
    </Box>
  );
}
