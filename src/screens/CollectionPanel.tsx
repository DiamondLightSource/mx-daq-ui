import { Box, Grid2, Stack, TextField } from "@mui/material";
import { PvComponent, PvItem } from "../pv/PvComponent";
import React from "react";

function CollectionInput() {
  const [subDir, setSubDir] = React.useState<string>("path/to/dir");
  const [chipName, setChipName] = React.useState<string>("test");
  const [expTime, setExpTime] = React.useState<number>(0.01);
  const [shots, setShots] = React.useState<number>(1);
  const [trans, setTrans] = React.useState<number>(0.3);
  const [detDist, setDetDist] = React.useState<number>(1350);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
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
          <PvComponent
            label="Detector in use"
            pv="ca://ME14E-MO-IOC-01:GP101"
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
        <Grid2 size={4.5}>
          <Stack direction={"column"} spacing={1} alignItems={"center"}>
            <TextField
              size="small"
              label="subDirectory"
              defaultValue={subDir}
              onChange={(e) => setSubDir(String(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="chipName"
              defaultValue={chipName}
              onChange={(e) => setChipName(String(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="shotsPerAperture"
              defaultValue={shots}
              onChange={(e) => setShots(Number(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="exposureTime (s)"
              defaultValue={expTime}
              onChange={(e) => setExpTime(Number(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="transmission (fraction)"
              defaultValue={trans}
              onChange={(e) => setTrans(Number(e.target.value))}
              style={{ width: 180 }}
            />
            <TextField
              size="small"
              label="detectorDistance (mm)"
              defaultValue={detDist}
              onChange={(e) => setDetDist(Number(e.target.value))}
              style={{ width: 180 }}
            />
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export function ParamsPanel() {
  return (
    <Stack direction="column">
      <CollectionInput />
    </Stack>
  );
}
