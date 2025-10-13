import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { ParameterInput } from "../ParameterInputs";
import { RunPlanButton } from "../../blueapi/BlueapiComponents";

export function CollectDarksPanel() {
  const theme = useTheme();
  const [expTime, setExpTime] = React.useState<number>(0.001);
  const [pedestalFrames, setPedestalFrames] = React.useState<number>(20);
  const [pedestalLoops, setPedestalLoops] = React.useState<number>(200);
  //   const [filePath, setFilePath] = React.useState<string>("");
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
            Collect darks
          </Typography>
          <Stack spacing={1} margin={2} alignContent={"center"}>
            <ParameterInput
              value={expTime}
              onSet={setExpTime}
              label="Exposure time (s)"
              tooltip="Set exposure time for darks collection."
            />
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
            }}
            title="Collect pedestal darks"
            btnSize="large"
          />
        </CardContent>
      </Card>
    </Box>
  );
}
