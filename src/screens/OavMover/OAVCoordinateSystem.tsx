import { Help, Close } from "@mui/icons-material";
import {
  Grid2,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import React from "react";
import oxfordChipDiagram from "#/assets/Oxford Chip Diagram.excalidraw.svg";
import { containedButtonStyles } from "#/blueapi/BlueapiComponentsStyling.ts";
import { RunPlanButton } from "#/blueapi/BlueapiComponents.tsx";

type PlanButton = {
  label: string;
  planName: string;
  planParams?: Record<string, string>;
  title: string;
};

export function CoordinateSystem() {
  const coordinateSystemSetup: PlanButton[] = [
    {
      label: "Go to origin",
      planName: "moveto",
      planParams: { place: "zero" },
      title: "Go to Fiducial 0",
    },
    {
      label: "Go to Fiducial1",
      planName: "moveto",
      planParams: { place: "f1" },
      title: "Go to Fiducial 1",
    },
    {
      label: "Go to Fiducial2",
      planName: "moveto",
      planParams: { place: "f2" },
      title: "Go to Fiducial 2",
    },
    {
      label: "Set Fiducial0",
      planName: "gui_set_fiducial_0",
      title: "Set Fiducial 0",
    },
    {
      label: "Set Fiducial1",
      planName: "fiducial",
      planParams: { point: "1" },
      title: "Set Fiducial 1",
    },
    {
      label: "Set Fiducial2",
      planName: "fiducial",
      planParams: { point: "2" },
      title: "Set Fiducial 2",
    },
  ];

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Divider sx={{ my: 1 }}>
        <Stack direction="row" spacing={1}>
          <Typography variant="subtitle1">Co-ordinate System Setup</Typography>
          <Help
            fontSize="small"
            sx={{ cursor: "pointer" }}
            onClick={handleClickOpen}
          />
        </Stack>
      </Divider>
      <Grid2 container rowSpacing={1} spacing={0.5}>
        {coordinateSystemSetup.map((button) => (
          <Grid2 size={4}>
            <RunPlanButton
              key={button.label}
              btnLabel={button.label}
              planName={button.planName}
              planParams={button.planParams}
              title={button.title}
              btnVariant="contained"
              sx={containedButtonStyles}
            />
          </Grid2>
        ))}

        <Grid2 size={6}>
          <RunPlanButton
            btnLabel="Make Coord System"
            planName="cs_maker"
            title="Create the coordinate system on the pmac."
            btnVariant="contained"
            sx={containedButtonStyles}
          />
        </Grid2>
        <Grid2 size={6}>
          <RunPlanButton
            btnLabel="Run block check"
            planName="block_check"
            title="Check the coordinate system was set up correctly."
            btnVariant="contained"
            sx={containedButtonStyles}
          />
        </Grid2>
      </Grid2>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        scroll="body"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          How to use Co-ordinate System Setup
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <img
            src={oxfordChipDiagram}
            alt="Oxford Chip Fiducial Alignment Diagram"
          />
          <Typography gutterBottom>
            Fiducial alignment for an Oxford type chip. Fiducial 0 is the
            origin, the top left corner. Fiducial 1 is the top right corner and
            Fiducial 2 is the bottom left corner.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
