import { Box } from "@mui/material";
import { PvComponent, PvItem, PvDescription } from "../pv/PvComponent";
import { pvIntArrayToString } from "../pv/util";
import React from "react";

export function OavVideoStream(props: PvDescription & { crosshairX: number; crosshairY: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  //TODO: make this a function, draw on useEffect and on update
  const context = canvasRef.current?.getContext("2d");
  if (context) {
    context.clearRect(
      0,
      0,
      canvasRef.current?.width as number,
      canvasRef.current?.height as number
    );
    context.strokeStyle = "red";
    context.font = "50px sans-serif";
    context.strokeRect(props.crosshairX - 10, props.crosshairY - 1, 20, 2);
    context.strokeRect(props.crosshairX - 1, props.crosshairY - 10, 2, 20);
  }

  return PvComponent({
    ...props,
    render: (props: PvItem) => {
      const value = props.value ? props.value : "undefined";
      return (
        <Box sx={{ padding: 0 }}>
          <Box position={"relative"}>
            <img
              src={value.toString()}
              height={"750"}
              width={"1000"}
              style={{ position: "relative", zIndex: 0 }}
            />
            <canvas
              ref={canvasRef}
              height={"750"}
              width={"750"}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: 1000,
                zIndex: 1,
              }}
            />
          </Box>
          {value.toString()}
        </Box>
      );
    },
    transformValue: pvIntArrayToString,
  });
}
