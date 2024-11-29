import { Box, Stack } from "@mui/material";

import { processUseBlueApiCall, useBlueApiCall } from "../blueapi/blueapi";
import { useState } from "react";

export function WorkerStatus() {
  const [currentState, setCurrentState] = useState<string>("UNKNOWN");
  const workerStateInfo = useBlueApiCall("/worker/state");
  return (
    <Stack padding={1} direction={"row"} spacing={1}>
      <b>BlueAPI worker status: </b>
      <Box>
        {processUseBlueApiCall(workerStateInfo, (res) => {
          if (!res.bodyUsed) {
            res.json().then((text) => setCurrentState(text));
          }
          return currentState;
        })}
      </Box>
    </Stack>
  );
}
