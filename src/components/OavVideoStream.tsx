import { Box } from "@mui/material";
import {
  PvComponent,
  PvItem,
  PvDescription,
  useParsedPvConnection,
} from "../pv/PvComponent";
import { parseNumericPv, pvIntArrayToString } from "../pv/util";
import React from "react";

const useContainerDimensions = (
  ref: React.MutableRefObject<HTMLHeadingElement | null>
) => {
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

/*
 * A viewer which allows overlaying a crosshair (takes numbers which could be the values from a react useState hook)
 * Takes OAV PV prefix eg "ca://BL24I-DI-OAV-01:" because it fetches multiple bits of info from the OAV IOC
 */
export function OavVideoStream(
  props: PvDescription & {
    crosshairX: number;
    crosshairY: number;
    onCoordClick: (x: number, y: number) => void; // handler for clicking on the OAV: x and y are the pixels on the original OAV stream
  }
) {
  const [crosshairX, crosshairY] = [props.crosshairX, props.crosshairY];
  const onCoordClick = props.onCoordClick;
  const streamPv = props.pv + "MJPG:MJPG_URL_RBV";

  const xDim = Number(
    useParsedPvConnection({
      pv: props.pv + "MJPG:ArraySize1_RBV",
      label: "OAV MJPG stream x size",
      transformValue: parseNumericPv,
    })
  );
  const yDim = Number(
    useParsedPvConnection({
      pv: props.pv + "MJPG:ArraySize2_RBV",
      label: "OAV MJPG stream x size",
      transformValue: parseNumericPv,
    })
  );
  console.log(`original stream size ${[xDim, yDim]}`);
  const [streamUrl, setStreamUrl] = React.useState<string>("not connected");

  return PvComponent({
    pv: streamPv,
    label: props.label,
    render: (props: PvItem) => {
      const value = props.value ? props.value : "undefined";
      if (
        !streamUrl.startsWith("http") &&
        value.toString().startsWith("http")
      ) {
        setStreamUrl(value.toString());
      }
      return (
        <Box sx={{ padding: 0 }}>
          <VideoBoxWithOverlay
            videoStreamUrl={streamUrl}
            crosshairX={crosshairX}
            crosshairY={crosshairY}
            onCoordClick={onCoordClick}
            originalDims={{ width: xDim, height: yDim }}
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

/*
 * Draws an MJPG stream with an overlaid crosshair, optionally takes a handler for when a certain x,y coord is clicked
 * optionally you can give it the original dimensions of the stream to have the handler called with the
 * click position in original pixel values
 */
function VideoBoxWithOverlay(props: {
  videoStreamUrl: string;
  crosshairX: number;
  crosshairY: number;
  onCoordClick?: (x: number, y: number) => void;
  originalDims?: { width: number; height: number };
}) {
  // TODO: wait until the video URL is correct once then stop updating it
  // may need a new kind of PV component for that
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
        width={width}
        height={height}
        ref={canvasRef}
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          zIndex: 1,
        }}
        onMouseDown={(e) => {
          if (props.onCoordClick) {
            const canvas = canvasRef.current;
            if (canvas) {
              const rect = canvas.getBoundingClientRect();
              // x and y relative to the canvas
              const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
              // x and y relative to the crosshair
              const [relX, relY] = [x - props.crosshairX, y - props.crosshairY];
              // fraction of the image in x/y * original dimension in pixels
              const scaledX = props.originalDims
                ? (relX / width) * props.originalDims.width
                : x;
              const scaledY = props.originalDims
                ? (relY / height) * props.originalDims.height
                : y;
              props.onCoordClick(scaledX, scaledY);
            }
          }
        }}
      />
    </Box>
  );
}
