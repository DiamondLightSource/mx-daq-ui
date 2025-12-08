import { Help, Close } from "@mui/icons-material";
import {
  Box,
  Grid2,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
} from "@mui/material";
import React from "react";
import { RunPlanButton } from "../../blueapi/BlueapiComponents";
import oxfordChipDiagram from "../../assets/Oxford Chip Diagram.excalidraw.svg";
import { buttonStyle } from "blueapi/BlueapiComponentsStyling";

export function CoordinateSystem() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box>
        <Grid2 container alignItems={"center"} rowSpacing={1} spacing={0.5}>
          <Grid2 size={10}>
            <b>Co-ordinate System Setup</b>
          </Grid2>
          <Grid2>
            <Help onClick={handleClickOpen} />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Go to origin"
              planName="moveto"
              planParams={{ place: "zero" }}
              title="Go to Fiducial 0"
              btnVariant="contained"
              btnSize="large"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Go to Fiducial1"
              planName="moveto"
              planParams={{ place: "f1" }}
              title="Go to Fiducial 1"
              btnVariant="contained"
              btnSize="large"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Go to Fiducial2"
              planName="moveto"
              planParams={{ place: "f2" }}
              title="Go to Fiducial 2"
              btnVariant="contained"
              btnSize="large"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Set Fiducial0"
              planName="gui_set_fiducial_0"
              title="Set Fiducial 0"
              btnVariant="contained"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Set Fiducial1"
              planName="fiducial"
              planParams={{ point: "1" }}
              title="Set Fiducial 1"
              btnVariant="contained"
            />
          </Grid2>
          <Grid2 size={4}>
            <RunPlanButton
              btnLabel="Set Fiducial2"
              planName="fiducial"
              planParams={{ point: "2" }}
              title="Set Fiducial 2"
              btnVariant="contained"
            />
          </Grid2>
          <Grid2 size={6}>
            <RunPlanButton
              btnLabel="Make Coord System"
              planName="cs_maker"
              title="Create the coordinate system on the pmac."
              btnVariant="contained"
            />
          </Grid2>
          <Grid2 size={6}>
            <RunPlanButton
              btnLabel="Run block check"
              planName="block_check"
              title="Check the coordinate system was set up correctly."
              btnVariant="contained"
            />
          </Grid2>
        </Grid2>
      </Box>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
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
          <img src={oxfordChipDiagram} alt="" />
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
