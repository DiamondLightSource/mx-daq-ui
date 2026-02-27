import { Box } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useContainerDimensions } from "./OavVideoStreamHelper";
import { PvComponent } from "#/pv/PvComponent.tsx";
import { PvDescription, PvItem } from "#/pv/types.ts";
import {
  useParsedPvConnection,
  parseNumericPv,
  pvIntArrayToString,
} from "#/pv/util.ts";
import { BeamCenterContext } from "#/context/BeamCenterContext.ts";

/*
 * A viewer which allows overlaying a crosshair (takes numbers which could be the values from a react useState hook)
 * Takes OAV PV prefix eg "ca://BL24I-DI-OAV-01:" because it fetches multiple bits of info from the OAV IOC
 */
export function OavVideoStream(
  props: PvDescription & {
    crosshairX: number;
    crosshairY: number;
    onCoordClick: (x: number, y: number) => void; // handler for clicking on the OAV: x and y are the pixels on the original OAV stream
  },
) {
  const [crosshairX, crosshairY] = [props.crosshairX, props.crosshairY];
  const onCoordClick = props.onCoordClick;
  const streamPv = props.pv + "MJPG:MJPG_URL_RBV";

  const xDim = Number(
    useParsedPvConnection({
      pv: props.pv + "MJPG:ArraySize1_RBV",
      label: "OAV MJPG stream x size",
      transformValue: parseNumericPv,
    }),
  );
  const yDim = Number(
    useParsedPvConnection({
      pv: props.pv + "MJPG:ArraySize2_RBV",
      label: "OAV MJPG stream x size",
      transformValue: parseNumericPv,
    }),
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
  crosshairY: number,
) {
  const context = canvasRef.current?.getContext("2d");
  if (context) {
    context.clearRect(
      0,
      0,
      canvasRef.current?.width as number,
      canvasRef.current?.height as number,
    );
    context.strokeStyle = "red";
    context.font = "50px sans-serif";
    context.beginPath();
    context.arc(crosshairX, crosshairY, 10, 0, 2 * Math.PI);
    context.moveTo(crosshairX - 15, crosshairY);
    context.lineTo(crosshairX + 15, crosshairY);
    context.moveTo(crosshairX, crosshairY - 15);
    context.lineTo(crosshairX, crosshairY + 15);
    context.stroke();
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
  const videoBoxRef = React.useRef<HTMLDivElement | null>(null);
  const { width, height } = useContainerDimensions(videoBoxRef);
  const beamCenterQuery = useContext(BeamCenterContext);

  useEffect(() => {
    drawCanvas(canvasRef, props.crosshairX, props.crosshairY);
  }, [props.crosshairX, props.crosshairY, width, height]);

  return (
    <Box position={"relative"} padding={0} ref={videoBoxRef}>
      <img
        src={props.videoStreamUrl}
        height={height}
        width={width}
        style={{ position: "relative", zIndex: 0 }}
        alt="OAV video stream"
      />
      <canvas
        ref={canvasRef}
        width={videoBoxRef.current?.clientWidth}
        height={videoBoxRef.current?.clientHeight}
        style={{ top: 0, left: 0, position: "absolute", zIndex: 1 }}
        onMouseDown={(e) => {
          if (props.onCoordClick) {
            const canvas = canvasRef.current;
            if (canvas) {
              const rect = canvas.getBoundingClientRect();
              const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
              props.onCoordClick(x, y);
              beamCenterQuery.refetch();
            }
          }
        }}
      />
    </Box>
  );
}
