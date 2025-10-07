import { Box, Typography } from "@mui/material";
import { CollectionSetupFt } from "../components/FixedTarget/CollectionSetupFt";
import { CollectionSetupEx } from "../components/Extruder/CollectionSetupEx";

type ExptType = {
  expt: "extruder" | "fixed-target";
};

function FallbackScreen() {
  return (
    <Box>
      <Typography component="h1" variant="h4">
        Page currently unavailable
      </Typography>
    </Box>
  );
}

export function ParamsPanel(expt: ExptType) {
  switch (expt.expt) {
    case "fixed-target":
      return <CollectionSetupFt />;
    case "extruder":
      return <CollectionSetupEx />;
    default:
      return <FallbackScreen />;
  }
}
