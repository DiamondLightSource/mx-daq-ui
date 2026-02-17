import { Stack } from "@mui/material";
import { WorkerStatus } from "../components/WorkerStatus";
import { SleepButton } from "../components/SleepButton";

export function BlueApiInfo() {
  return (
    <Stack direction="column">
      <WorkerStatus />
      <SleepButton />
    </Stack>
  );
}
