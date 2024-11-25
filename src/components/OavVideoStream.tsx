import { Box } from "@mui/material";
import { PvComponent, PvItem, PvDescription } from "../pv/PvComponent";
import { pvIntArrayToString } from "../pv/util";
import React from "react";

export const useContainerDimensions = (ref: React.MutableRefObject<HTMLHeadingElement | null>) => {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  React.useEffect(() => {
    const getDimensions = () => ({
      width: ref.current?.offsetWidth || 0,
      height: ref.current?.offsetWidth || 0,
    });
    const handleResize = () => {
      setDimensions(getDimensions());
    };
    if (ref.current) {
      setDimensions(getDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return dimensions;
};

export function OavVideoStream(props: PvDescription & { crosshairX: number; crosshairY: number }) {
  const [crosshairX, crosshairY] = [props.crosshairX, props.crosshairY];
  return PvComponent({
    ...props,
    render: (props: PvItem) => {
      const value = props.value ? props.value : "undefined";
      return (
        <Box sx={{ padding: 0 }}>
          <VideoBoxWithOverlay
            videoStreamUrl={value.toString()}
            crosshairX={crosshairX}
            crosshairY={crosshairY}
          ></VideoBoxWithOverlay>
          {value.toString()}
        </Box>
      );
    },
    transformValue: pvIntArrayToString,
  });
}

function drawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  crosshairX: number,
  crosshairY: number
) {
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
    context.strokeRect(crosshairX - 10, crosshairY - 1, 20, 2);
    context.strokeRect(crosshairX - 1, crosshairY - 10, 2, 20);
  }
}

function VideoBoxWithOverlay(props: {
  videoStreamUrl: string;
  crosshairX: number;
  crosshairY: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const videoBoxRef = React.useRef<HTMLHeadingElement | null>(null);
  const { width, height } = useContainerDimensions(videoBoxRef);
  drawCanvas(canvasRef, props.crosshairX, props.crosshairY);
  return (
    <Box position={"relative"} padding={0} ref={videoBoxRef}>
      <img
        src={props.videoStreamUrl}
        height={width}
        width={height}
        style={{ position: "relative", zIndex: 0 }}
      />
      <canvas
        width={width} //TODO get these from the containing Box
        height={height}
        ref={canvasRef}
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          zIndex: 1,
        }}
      />
    </Box>
  );
}
