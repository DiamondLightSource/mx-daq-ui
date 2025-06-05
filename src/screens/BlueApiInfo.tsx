import { Stack, Box } from "@mui/material";
import { WorkerStatus } from "../components/WorkerStatus";
import { SleepButton } from "../components/SleepButton";

export function BlueApiInfo() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="column">
        <WorkerStatus />
        <SleepButton />
      </Stack>
    </Box>
  );
}
