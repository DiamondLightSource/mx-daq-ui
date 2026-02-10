import { Box, Grid2, Stack, Typography, useTheme } from "@mui/material";
import { ParamsPanel } from "../screens/CollectionPanel";
import { CollectDarksPanel } from "../components/JungFrau/CollectDarksPanel";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackScreen } from "screens/FallbackScreen";
import { RoPvBox } from "pv/PvComponent";

export function JfRotation() {
  const theme = useTheme();
  return (
    <ErrorBoundary fallback={<FallbackScreen />}>
      <Box marginTop={2}>
        <Stack direction={"column"} spacing={1}>
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
          <RoPvBox
            label="Detector stage small z position"
            pv="ca://BL24I-MO-DET-01:SMALL:Z.RBV"
          />
        </Stack>
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
