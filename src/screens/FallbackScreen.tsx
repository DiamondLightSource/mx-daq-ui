import { Box, Typography } from "@mui/material";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export function FallbackScreen() {
  return (
    <Box alignContent={"center"}>
      <ErrorOutlineIcon color="error" fontSize="large" />
      <Typography component="h1" variant="h4">
        Page currently unavailable
      </Typography>
    </Box>
  );
}
