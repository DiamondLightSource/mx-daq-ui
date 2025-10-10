import { Box, Typography, useTheme } from "@mui/material";

export function JfRotation() {
  const theme = useTheme();
  return (
    <Box marginTop={2}>
      <Typography
        variant="h1"
        sx={{
          color: theme.palette.info.main,
          fontSize: 24,
          fontWeight: "fontWeightBold",
        }}
      >
        Jungfrau Rotation Scans Setup
      </Typography>
    </Box>
  );
}
