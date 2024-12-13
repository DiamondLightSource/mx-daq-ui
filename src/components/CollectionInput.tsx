import { Box, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

import React from "react";

// import { submitAndRunPlanImmediately } from "../blueapi/blueapi";

export function CollectionInput() {
  const [chipName, setChipName] = React.useState<string>("test chip");
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={2} columnSpacing={1}>
        <Grid size={5}>
          <Box>
            <p>Chip Name </p>
          </Box>
        </Grid>
        <Grid size={5}>
          <TextField
            size="small"
            label="chip"
            defaultValue={chipName}
            onChange={(e) => setChipName(String(e.target.value))}
            style={{ width: 100 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
