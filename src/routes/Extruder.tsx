import { Box, Typography, useTheme } from "@mui/material";
import { ReadOnlyInputs } from "components/ReadOnlyInputs";
import { ParamsPanel } from "screens/CollectionPanel";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackScreen } from "screens/FallbackScreen";

export function Extruder() {
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
          Extruder Data Collection Setup
        </Typography>
        <ReadOnlyInputs
          visit="ca://BL24I-MO-IOC-13:GP1"
          detector="ca://BL24I-MO-IOC-13:GP15"
        />
        <ParamsPanel expt="extruder" />
      </Box>
    </ErrorBoundary>
  );
}
