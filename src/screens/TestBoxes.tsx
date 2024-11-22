import { Box, Grid2, useTheme } from "@mui/material";
import { PvItem, PvComponent } from "../pv/PvComponent";

export function TestBoxesTabPanel() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <div>
      <Grid2 container spacing={2}>
        <Grid2 size={4} sx={{ bgcolor: bgColor }}>
          <h1>Test</h1>
          <p>Test</p>
        </Grid2>
        <Grid2 size={4} sx={{ bgcolor: bgColor }}>
          <PvComponent
            label="test"
            pv="test"
            render={({ label, value }: PvItem) => {
              return (
                <Box>
                  <p>
                    {label}: {value ? value.toString() : "undefined"}
                  </p>
                </Box>
              );
            }}
          />
        </Grid2>
        <Grid2 size={4} sx={{ bgcolor: bgColor }}>
          <h1>Test</h1>
          <p>Test</p>
        </Grid2>
      </Grid2>
    </div>
  );
}
