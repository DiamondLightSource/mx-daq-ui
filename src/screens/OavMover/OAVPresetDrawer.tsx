import { RunPlanButton } from "#/blueapi/BlueapiComponents.tsx";
import { containedButtonStyles } from "#/blueapi/BlueapiComponentsStyling.ts";
import { Box, Stack, Button, Drawer, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

export function PresetMovements() {
  const presetPositions = [
    {
      label: "Collect Position",
      place: "collect_position",
      title: "Move into position for collection",
    },
    {
      label: "Load Position",
      place: "load_position",
      title: "Move hardware for sample loading",
    },
    {
      label: "Microdrop align",
      place: "microdrop_position",
      title: "Align microdrop",
    },
  ];

  return (
    <Box sx={{ textAlign: `center`, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Preset Positions
      </Typography>
      <Stack spacing={1}>
        {presetPositions.map((position) => (
          <RunPlanButton
            key={position.place}
            btnLabel={position.label}
            planName="moveto_preset"
            planParams={{ place: position.place }}
            title={position.title}
            btnVariant="contained"
            sx={containedButtonStyles}
          />
        ))}
      </Stack>
    </Box>
  );
}

export function PresetPositionsSideDrawer() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  return (
    <>
      <Tooltip title="Preset positions for collection, loading and microdrop alignment">
        <Button
          sx={{
            color: "white",
            margin: 1,
            padding: 2,
            backgroundColor: "#1c2025",
          }}
          onClick={toggleDrawer(true)}
          variant="contained"
        >
          <Typography fontWeight="fontWeightBold">Preset Positions</Typography>
        </Button>
      </Tooltip>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <PresetMovements />
      </Drawer>
    </>
  );
}
