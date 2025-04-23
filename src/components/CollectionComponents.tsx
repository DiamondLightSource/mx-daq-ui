import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
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
 * These are the options labeled as "repeat#" in the UI, the number after repeat
 * indicating how many rows are pumped at a time.
 *  * See https://confluence.diamond.ac.uk/display/MXTech/Dynamics+and+fixed+targets
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
  const moveTime: number = 0.008; // Approximate time the motors need to move from one window to the next
  const windowsPerRow: number = 20;
  const delay =
    factor * windowsPerRow * (moveTime + (laserDwell + expTime) / 2);
  return Number(delay.toFixed(4));
}

/**
 * Opens a dialog showing the calculated laser delay to set for each EAVA setting, given the laser
 * exposure time and collection exposure time.
 *
 * @param {number} laserDwell - laser exposure time
 * @param {number} expTime - collection exposure time
 */
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
        title="Calculate the optimal delay to set for Repeat# Excite And Visit Again settings"
        placement="bottom"
      >
        <Button variant="outlined" onClick={handleClickOpen}>
          EAVA calculator
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>EAVA: Excite And Visit Again</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Calculate the laser delay for each Excite And Visit Again setting
            from laser dwell time and exposure time.
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
 * @param {boolean} checkerPattern - pump in a checkerboard pattern
 * @returns null if the selected pump probe setting is `NoPP`, a JSX.Element with input text fields otherwise
 */
export function PumpProbeOptions({
  pumpProbe,
  laserDwell,
  expTime,
  checkerPattern,
  setLaserDwell,
  setLaserDelay,
  setPrePumpExp,
  setChecked,
}: {
  pumpProbe: string;
  laserDwell: number;
  expTime: number;
  checkerPattern: boolean;
  setLaserDwell: React.Dispatch<React.SetStateAction<number>>;
  setLaserDelay: React.Dispatch<React.SetStateAction<number>>;
  setPrePumpExp: React.Dispatch<React.SetStateAction<number>>;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
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
      <Tooltip
        title="If selected, do pump every other well in a checkerboard pattern"
        placement="right"
      >
        <FormControl>
          <FormControlLabel
            label="Checker Pattern"
            control={
              <Checkbox
                checked={checkerPattern}
                onChange={(e) => setChecked(Boolean(e.target.checked))} // NOPE!
              />
            }
          />
        </FormControl>
      </Tooltip>
      <PumpProbeDialog laserDwell={laserDwell} expTime={expTime} />
    </Stack>
  );
}
