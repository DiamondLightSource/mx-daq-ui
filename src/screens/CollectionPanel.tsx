import { Box, Typography } from "@mui/material";
import { CollectionSetupFt } from "components/FixedTarget/CollectionSetupFt";
import { CollectionSetupEx } from "components/Extruder/CollectionSetupEx";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { CollectionSetupJf } from "components/JungFrau/CollectionSetupJf";
import { JungfrauRotationProvider } from "context/jungfrau/JungfrauRotationProvider";
import { VisitProvider } from "context/VisitProvider";
type ExptType = {
  expt: "extruder" | "fixed-target" | "jf";
};

function FallbackScreen() {
  return (
    <Box alignContent={"center"}>
      <ErrorOutlineIcon color="error" fontSize="large" />
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
    case "jf":
      return (
        <VisitProvider>
          <JungfrauRotationProvider>
            <CollectionSetupJf />
          </JungfrauRotationProvider>
        </VisitProvider>
      );
    default:
      return <FallbackScreen />;
  }
}
