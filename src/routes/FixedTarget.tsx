import { Box, Typography, useTheme } from "@mui/material";
import { ParamsPanel } from "screens/CollectionPanel";
import { ReadOnlyInputs } from "components/ReadOnlyInputs";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackScreen } from "screens/FallbackScreen";

export function FixedTarget() {
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
          Fixed Target Data Collection Setup
        </Typography>
        <ReadOnlyInputs
          visit="ca://BL24I-MO-IOC-13:GP100"
          detector="ca://BL24I-MO-IOC-13:GP101"
        />
        <ParamsPanel expt="fixed-target" />
      </Box>
    </ErrorBoundary>
  );
}
