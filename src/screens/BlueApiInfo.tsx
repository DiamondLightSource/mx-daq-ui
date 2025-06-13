import { Grid2, Stack } from "@mui/material";
import { WorkerStatus } from "../components/WorkerStatus";
import { SleepButton } from "../components/SleepButton";

export function BlueApiInfo() {
  return (
    <div>
      <Grid2 container columns={1} justifyContent="center">
        <Stack direction="column">
          <WorkerStatus />
          <SleepButton />
        </Stack>
      </Grid2>
    </div>
  );
}
