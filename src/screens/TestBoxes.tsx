import { Grid2, useTheme } from "@mui/material";

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
          <h1>Test</h1>
          <p>Test</p>
        </Grid2>
        <Grid2 size={4} sx={{ bgcolor: bgColor }}>
          <h1>Test</h1>
          <p>Test</p>
        </Grid2>
      </Grid2>
    </div>
  );
}
