import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Tooltip,
} from "@mui/material";
import React from "react";

type EavaRequest = {
  laserDwell: number;
  expTime: number;
};

/**
 * Calculate laser delay for EAVA (Excite And Visit Again) pump probe settings.
 * These are the options labeled as "repeat#" in the UI, the number after repeat
 * indicating how many rows are pumped at a time.
 *
 * @param {number} laserDwell - laser exposure time
 * @param {number} expTime - collection exposure time for each window
 * @param {number} factor - number of rows pumped at the time, multiplied by 2
 * @returns {number} The laser delay to set
 */
function calculateEAVA(
  laserDwell: number,
  expTime: number,
  factor: number
): number {
  const movetime: number = 0.008;
  const windowsPerRow: number = 20;
  const delay =
    factor * windowsPerRow * (movetime + (laserDwell + expTime) / 2);
  return Number(delay.toFixed(4));
}

export function PumpProbeDialog(props: EavaRequest) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="Calculate the optimal delay to set for Repeat# Excite And Visit Again settings">
        <Button variant="outlined" onClick={handleClickOpen}>
          EAVA calculator
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Excite And Visit Again</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Calculate the laser delay for each EAVA setting from laser dwell
            time and exposure time.
          </DialogContentText>
          <Stack direction={"column"} spacing={1} alignItems={"center"}>
            <p>
              <b>Repeat1: </b>
              {calculateEAVA(props.laserDwell, props.expTime, 2)}s
            </p>
            <p>
              <b>Repeat2: </b>
              {calculateEAVA(props.laserDwell, props.expTime, 4)}s
            </p>
            <p>
              <b>Repeat3: </b>
              {calculateEAVA(props.laserDwell, props.expTime, 6)}s
            </p>
            <p>
              <b>Repeat5: </b>
              {calculateEAVA(props.laserDwell, props.expTime, 10)}s
            </p>
            <p>
              <b>Repeat10: </b>
              {calculateEAVA(props.laserDwell, props.expTime, 20)}s
            </p>
          </Stack>
          <DialogContentText>
            <b>Notes</b>
            <ul>
              <li>
                The repeat is the number of pairs of lines illuminated before
                probe.
              </li>
              <li>
                Because the lines in a block are 20, repeat3 will miss some
                lines
              </li>
              <li>
                ONLY use with Mapping lite, do not run a full Oxford Chip in
                this mode.
              </li>
            </ul>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
