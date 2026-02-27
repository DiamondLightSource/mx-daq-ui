import { Grid2, useTheme } from "@mui/material";
import { useContext } from "react";
import { OAVSideBar } from "./OAVSideBar";
import { submitAndRunPlanImmediately } from "#/blueapi/blueapi.ts";
import { readVisitFromPv, parseInstrumentSession } from "#/blueapi/visit.ts";
import { OavVideoStream } from "#/components/OavVideoStream.tsx";
import { forceString, useParsedPvConnection } from "#/pv/util.ts";
import { ZoomLevels } from "#/pv/enumPvValues.ts";
import { useMemo, useEffect } from "react";
import { BeamCenterContext } from "#/context/BeamCenterContext.ts";

const ZOOM_PV = "ca://BL24I-EA-OAV-01:FZOOM:MP:SELECT";
const BEAM_CENTER_LINES_PER_ZOOM = 7;

function useZoomAndCrosshair() {
  const beamCenterQuery = useContext(BeamCenterContext);
  const currentZoomValue = String(
    useParsedPvConnection({
      pv: ZOOM_PV,
      label: "zoom-level",
      transformValue: forceString,
    }),
  );

  useEffect(() => {
    beamCenterQuery.refetch();
  }, [currentZoomValue, beamCenterQuery]);

  const zoomIndex = ZoomLevels.findIndex(
    (element: string) => element == currentZoomValue,
  );

  const [crosshairX, crosshairY] = useMemo(() => {
    if (!beamCenterQuery.data || zoomIndex < 0) {
      return [NaN, NaN];
    }

    const lines = beamCenterQuery.data.split("\n");
    const xLine = lines[zoomIndex * BEAM_CENTER_LINES_PER_ZOOM + 1];
    const yLine = lines[zoomIndex * BEAM_CENTER_LINES_PER_ZOOM + 2];

    if (!xLine || !yLine) {
      return [NaN, NaN];
    }

    return [Number(xLine.split(" ")[2]), Number(yLine.split(" ")[2])];
  }, [beamCenterQuery.data, zoomIndex]);

  return { crosshairX, crosshairY };
}

export function OavMover() {
  const { crosshairX, crosshairY } = useZoomAndCrosshair();

  const theme = useTheme();
  const bgColor = theme.palette.background.paper;

  const fullVisit = readVisitFromPv();

  function onCoordClick(x: number, y: number) {
    submitAndRunPlanImmediately({
      planName: "move_on_oav_view_click",
      planParams: { position: [x, y] },
      instrumentSession: parseInstrumentSession(fullVisit),
    }).catch((error) => {
      console.log(
        `Failed to run plan, see console and logs for full error. Reason: ${error}`,
      );
    });
  }

  return (
    <div>
      <Grid2 container spacing={2} columns={12}>
        <Grid2 size={9} sx={{ bgcolor: bgColor }}>
          <OavVideoStream
            pv="ca://BL24I-DI-OAV-01:"
            label="I24 OAV image stream"
            crosshairX={crosshairX}
            crosshairY={crosshairY}
            onCoordClick={onCoordClick}
          />
        </Grid2>
        <OAVSideBar />
      </Grid2>
    </div>
  );
}
