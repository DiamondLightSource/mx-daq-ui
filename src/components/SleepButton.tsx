import { Box, Button, Stack, TextField } from "@mui/material";

import React from "react";
import { submitAndRunPlanImmediately } from "../blueapi/blueapi";

export function SleepButton() {
  const [seconds, setSeconds] = React.useState<number>(5);
  return (
    <Stack direction={"row"} spacing={2}>
      <Box>
        <p>Trigger a plan to sleep for n seconds: </p>
      </Box>
      <TextField
        size="small"
        label="seconds"
        defaultValue={seconds}
        onChange={(e) => setSeconds(Number(e.target.value))}
        style={{ width: 100 }}
      />
      <Button
        onClick={() =>
          submitAndRunPlanImmediately("gui_sleep", { sec: seconds })
        }
      >
        Sleep!
      </Button>
    </Stack>
  );
}
