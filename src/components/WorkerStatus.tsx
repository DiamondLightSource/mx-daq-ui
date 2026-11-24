import { useWorkerState } from "#/blueapi/blueapi.ts";
import { Grid2, Stack, Typography } from "@mui/material";

export function WorkerStatus() {
  // Shares the query the run buttons already poll, so displaying the status costs no
  // extra requests, and it speeds up on its own while the worker is doing something.
  const workerState = useWorkerState();

  return (
    <Grid2 size={12}>
      <Stack direction={"row"} spacing={1} justifyContent={"center"}>
        <Typography variant="body1" fontWeight={"bold"}>
          BlueAPI worker status:
        </Typography>
        <Typography variant="body1">{workerState ?? "UNKNOWN"}</Typography>
      </Stack>
    </Grid2>
  );
}
