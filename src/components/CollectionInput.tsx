import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Stack,
} from "@mui/material";

import React from "react";

type EavaRequest = {
  laserDwell: number;
  expTime: number;
};

export function CalculateEAVA(
  laserDwell: number,
  expTime: number,
  factor: number
): number {
  const movetime: number = 0.008;
  const res = factor * 20 * (movetime + (laserDwell + expTime) / 2);
  return Number(res.toFixed(4));
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
      <Button variant="outlined" onClick={handleClickOpen}>
        EAVA calculator
      </Button>
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
              {CalculateEAVA(props.laserDwell, props.expTime, 2)}s
            </p>
            <p>
              <b>Repeat2: </b>
              {CalculateEAVA(props.laserDwell, props.expTime, 4)}s
            </p>
            <p>
              <b>Repeat3: </b>
              {CalculateEAVA(props.laserDwell, props.expTime, 6)}s
            </p>
            <p>
              <b>Repeat5: </b>
              {CalculateEAVA(props.laserDwell, props.expTime, 10)}s
            </p>
            <p>
              <b>Repeat10: </b>
              {CalculateEAVA(props.laserDwell, props.expTime, 20)}s
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

type MapProps = {
  label: string;
  chipType: string;
};

function OxfordMapComponent() {
  const [useMapLite, setUseMap] = React.useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box>
      <Stack direction={"column"}>
        <FormControl>
          <FormControlLabel
            label="Use Mapping Lite"
            control={
              <Checkbox
                checked={useMapLite}
                onChange={(e) => setUseMap(Boolean(e.target.checked))} // NOPE!
              />
            }
          />
        </FormControl>
        <Button variant="outlined" onClick={handleClickOpen}>
          Choose Map
        </Button>
        <Dialog open={dialogOpen} onClose={handleClose}>
          <DialogTitle>Choose blocks on Oxford chip</DialogTitle>
          <DialogContent>
            <Box>Buttons here</Box>
          </DialogContent>
        </Dialog>
      </Stack>
    </Box>
  );
}

export function MapView(props: MapProps) {
  // const [oxford, setOxford] = React.useState(false);
  // const [custom, setCustom] = React.useState(false);

  // const hideComponent = (props.chipType) => () {
  switch (props.chipType) {
    case "Oxford":
      return <OxfordMapComponent />;
    // case "Custom":
    //   setCustom(!custom);
    //   break;
    default:
      return <></>;
  }
}
