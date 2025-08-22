import { Grid2, Stack, Typography } from "@mui/material";

import { processUseBlueApiCall, useBlueApiCall } from "../blueapi/blueapi";
import { useState } from "react";

export function WorkerStatus() {
  const [currentState, setCurrentState] = useState<string>("UNKNOWN");
  const workerStateInfo = useBlueApiCall("/worker/state");

  const readCurrentState = () => {
    return processUseBlueApiCall(workerStateInfo, (res) => {
      if (!res.bodyUsed) {
        res.json().then((text) => setCurrentState(text));
      }
      return currentState;
    });
  };

  return (
    <Grid2 size={12}>
      <Stack direction={"row"} spacing={1} justifyContent={"center"}>
        <Typography variant="body1" fontWeight={"bold"}>
          BlueAPI worker status:
        </Typography>
        <Typography variant="body1">{readCurrentState()}</Typography>
      </Stack>
    </Grid2>
  );
}
