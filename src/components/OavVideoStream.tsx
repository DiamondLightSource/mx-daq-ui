import { Box } from "@mui/material";
import { PvComponent, PvItem, PvDescription } from "../pv/PvComponent";

export function OavVideoStream(props: PvDescription) {
  return PvComponent({
    ...props,
    render: (props: PvItem) => {
      const value = props.value ? props.value : "undefined";
      return (
        <Box sx={{ padding: 0 }}>
          <img src={value.toString()} height={"100%"} width={"100%"} />
          {value.toString()}
        </Box>
      );
    },
  });
}
