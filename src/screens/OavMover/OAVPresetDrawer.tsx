import { RunPlanButton } from "#/blueapi/BlueapiComponents.tsx";
import { containedButtonStyles } from "#/blueapi/BlueapiComponentsStyling.ts";
import { Box, Stack, Button, Drawer } from "@mui/material";
import { useState } from "react";

export function PresetMovements() {
  return (
    <Box sx={{ textAlign: `center` }}>
      <p>
        <b>Preset Positions</b>
      </p>
      <Stack padding={"20px"} margin={"10px"} spacing={1}>
        <RunPlanButton
          btnLabel="Collect Position"
          planName="moveto_preset"
          planParams={{ place: "collect_position" }}
          title="Move into position for collection"
          btnSize="small"
          btnVariant="contained"
          sx={containedButtonStyles}
        />
        <RunPlanButton
          btnLabel="Load Position"
          planName="moveto_preset"
          planParams={{ place: "load_position" }}
          title="Move hardware for sample loading"
          btnSize="small"
          btnVariant="contained"
          sx={containedButtonStyles}
        />
        <RunPlanButton
          btnLabel="Microdrop align"
          planName="moveto_preset"
          planParams={{ place: "microdrop_position" }}
          title="Align microdrop"
          btnSize="small"
          btnVariant="contained"
          sx={containedButtonStyles}
        />
      </Stack>
    </Box>
  );
}

export function PresetPositionsSideDrawer() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <Button
        sx={{
          color: "white",
          margin: "5px",
          padding: "15px",
          backgroundColor: "#1c2025",
        }}
        onClick={toggleDrawer(true)}
      >
        Preset Positions
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <PresetMovements />
      </Drawer>
    </>
  );
}
