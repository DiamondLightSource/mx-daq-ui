import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { ParameterInput } from "../ParameterInputs";
import { RunPlanButton } from "../../blueapi/BlueapiComponents";
import { GainModes } from "./constants";

export function CollectDarksPanel() {
  const theme = useTheme();
  const [filename, setFilename] = React.useState<string>("darks");
  const [expTime, setExpTime] = React.useState<number>(0.001);
  const [pedestalFrames, setPedestalFrames] = React.useState<number>(20);
  const [pedestalLoops, setPedestalLoops] = React.useState<number>(200);
  const [totTriggers, setTotTriggers] = React.useState<number>(1000);
  const [gainMode, setGainMode] = React.useState<string>(GainModes[0]);

  return (
    <Box sx={{ flexGrow: 1, marginLeft: 15, marginRight: 5 }}>
      <Card variant="outlined" sx={{ minWidth: 300, minHeight: 600 }}>
        <CardContent>
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.primary.contrastText,
              fontSize: 24,
              fontWeight: "fontWeightBold",
            }}
          >
            Collect Darks
          </Typography>
          <Stack spacing={4} margin={4} alignItems={"center"}>
            <Stack direction={"row"} spacing={2}>
              <ParameterInput
                value={filename}
                onSet={setFilename}
                label="Filename"
                tooltip="Set filename for darks collection."
              />
              <ParameterInput
                value={expTime}
                onSet={setExpTime}
                label="Exposure time (s)"
                tooltip="Set exposure time for darks collection."
              />
            </Stack>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.primary.contrastText,
                fontSize: 20,
                fontWeight: "fontWeightBold",
              }}
            >
              Pedestal
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <ParameterInput
                value={pedestalFrames}
                onSet={setPedestalFrames}
                label="Pedestal frames"
                tooltip="Number of pedestal frames to collect."
              />
              <ParameterInput
                value={pedestalLoops}
                onSet={setPedestalLoops}
                label="Pedestal loops"
                tooltip="Number of pedestal loops."
              />
            </Stack>
            <RunPlanButton
              btnLabel="Pedestal darks"
              planName="do_pedestal_darks"
              planParams={{
                exp_time_s: expTime,
                pedestal_frame: pedestalFrames,
                pedestal_loops: pedestalLoops,
                filename: filename,
              }}
              title="Collect pedestal darks"
              btnSize="large"
            />
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.primary.contrastText,
                fontSize: 20,
                fontWeight: "fontWeightBold",
              }}
            >
              Standard
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <ParameterInput
                value={totTriggers}
                onSet={setTotTriggers}
                label="Total Triggers"
                tooltip="Total triggers for the dark scan."
              />
              <Tooltip
                title="Select gain mode before starting the darks acquisition.
                WARNING. FixGO may damage the detector - use with caution."
                placement="right"
              >
                <FormControl size="small" style={{ width: 180 }}>
                  <InputLabel id="gain-label">Gain Mode</InputLabel>
                  <Select
                    labelId="gain-label"
                    id="gain"
                    value={gainMode}
                    label="Gain Mode"
                    onChange={(e) => setGainMode(e.target.value)}
                  >
                    {GainModes.map((choice) => (
                      <MenuItem key={choice} value={choice}>
                        {choice}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Tooltip>
            </Stack>
            <RunPlanButton
              btnLabel="Standard darks"
              planName="do_non_pedestal_darks"
              planParams={{
                gain_mode: gainMode,
                exp_time_s: expTime,
                total_triggers: totTriggers,
                filename: filename,
              }}
              title="Collect non pedestal darks"
              btnSize="large"
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
