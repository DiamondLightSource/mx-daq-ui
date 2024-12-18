import { Box, Grid2, Stack, TextField, useTheme } from "@mui/material";

import React from "react";

// import { submitAndRunPlanImmediately } from "../blueapi/blueapi";

export function CollectionInput() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  const [chipName, setChipName] = React.useState<string>("test");
  const [expTime, setExpTime] = React.useState<number>(0.01);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={6} sx={{ bgcolor: bgColor }}>
          <Box>
            <p>Chip Name </p>
          </Box>
          <Box>
            <p>Exp. Time </p>
          </Box>
        </Grid2>
        <Grid2 size={6} sx={{ bgcolor: bgColor }}>
          <Stack direction={"column"} spacing={1} alignContent={"center"}>
            <TextField
              size="small"
              label="chipName"
              defaultValue={chipName}
              onChange={(e) => setChipName(String(e.target.value))}
              style={{ width: 100 }}
            />
            <TextField
              size="small"
              label="expTime"
              defaultValue={expTime}
              onChange={(e) => setExpTime(Number(e.target.value))}
              style={{ width: 100 }}
            />
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}
