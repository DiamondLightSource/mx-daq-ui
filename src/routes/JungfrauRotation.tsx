import { Box, Grid2, Typography, useTheme } from "@mui/material";
import { ParamsPanel } from "../screens/CollectionPanel";
import { CollectDarksPanel } from "../components/JungFrau/CollectDarksPanel";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackScreen } from "screens/FallbackScreen";

export function JfRotation() {
  const theme = useTheme();
  return (
    <ErrorBoundary fallback={<FallbackScreen />}>
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
        <Grid2 container marginTop={2} spacing={2}>
          <Grid2 size={5}>
            <CollectDarksPanel />
          </Grid2>
          <ParamsPanel expt="jf" />
        </Grid2>
      </Box>
    </ErrorBoundary>
  );
}
