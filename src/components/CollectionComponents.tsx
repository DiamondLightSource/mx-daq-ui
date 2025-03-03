import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import React from "react";

type EavaRequest = {
  laserDwell: number;
  expTime: number;
};

/**
 * Calculate laser delay for EAVA (Excite And Visit Again) pump probe settings.
 * These are the options labeles as "repeat#" in the UI, the number after repeat
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
      <Tooltip
        title="Calculate the optimal delay to set for Repeat# settings"
        placement="bottom"
      >
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

/**
 * Dynamic component which will show the pump probe options if one of the settings is selected in the
 * dropdown.
 *
 * @param {string} pumpProbe - selected setting
 * @param {number} laserDwell - laser exposure time
 * @param {number} expTime - collection exposure time
 * @returns null if the selected pump probe setting is `NoPP`, a JSX.Element with input text fields otherwise
 */
export function PumpProbeOptions({
  pumpProbe,
  laserDwell,
  expTime,
  setLaserDwell,
  setLaserDelay,
  setPrePumpExp,
}: {
  pumpProbe: string;
  laserDwell: number;
  expTime: number;
  setLaserDwell: React.Dispatch<React.SetStateAction<number>>;
  setLaserDelay: React.Dispatch<React.SetStateAction<number>>;
  setPrePumpExp: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element | null {
  if (pumpProbe === "NoPP") {
    return null;
  }

  return (
    <Stack spacing={1} direction={"column"}>
      <Tooltip
        title="Exposure time for the laser pump, in seconds"
        placement="right"
      >
        <TextField
          size="small"
          label="Laser Dwell (s)"
          defaultValue={laserDwell}
          onChange={(e) => setLaserDwell(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Tooltip>
      <Tooltip
        title="Delay time between the laser pump and the collection, in seconds"
        placement="right"
      >
        <TextField
          size="small"
          label="Laser Delay (s)"
          defaultValue={0.0}
          onChange={(e) => setLaserDelay(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Tooltip>
      <Tooltip
        title="How long to collect before laser pump, if setting is Short2, in seconds"
        placement="right"
      >
        <TextField
          size="small"
          label="Pre-Pump Exposure Time (s)"
          defaultValue={0.0}
          onChange={(e) => setPrePumpExp(Number(e.target.value))}
          style={{ width: 150 }}
        />
      </Tooltip>
      <PumpProbeDialog laserDwell={laserDwell} expTime={expTime} />
    </Stack>
  );
}
