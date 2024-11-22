import { Grid2, useTheme } from "@mui/material";
import { OavVideoStream } from "../components/OavVideoStream";

export function OavMover() {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <div>
      <Grid2 container spacing={2}>
        <Grid2 size={10} sx={{ bgcolor: bgColor }}>
          <OavVideoStream
            pv="ca://BL24I-DI-OAV-01:MJPG:MJPG_URL_RBV"
            label="I24 OAV image stream"
          />
        </Grid2>
      </Grid2>
    </div>
  );
}
