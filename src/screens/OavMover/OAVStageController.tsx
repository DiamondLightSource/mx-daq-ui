import { Grid2, useTheme } from "@mui/material";
import { OAVSideBar } from "./OAVSideBar";
import { submitAndRunPlanImmediately } from "#/blueapi/blueapi.ts";
import { readVisitFromPv, parseInstrumentSession } from "#/blueapi/visit.ts";
import { OavVideoStream } from "#/components/OavVideoStream.tsx";
import { useConfigCall } from "#/config_server/configServer.ts";
import { forceString, useParsedPvConnection } from "#/pv/util.ts";
import { ZoomLevels } from "#/pv/enumPvValues.ts";
import { useMemo, useEffect } from "react";

const DISPLAY_CONFIG_ENDPOINT =
  "/dls_sw/i24/software/daq_configuration/domain/display.configuration";
const ZOOM_PV = "ca://BL24I-EA-OAV-01:FZOOM:MP:SELECT";

function useZoomAndCrosshair() {
  const beamCenterQuery = useConfigCall(DISPLAY_CONFIG_ENDPOINT);
  const currentZoomValue = String(
    useParsedPvConnection({
      pv: ZOOM_PV,
      label: "zoom-level",
      transformValue: forceString,
    }),
  );

  useEffect(() => {
    beamCenterQuery.refetch();
  }, [currentZoomValue]);

  const zoomIndex = ZoomLevels.findIndex(
    (element: string) => element == currentZoomValue,
  );

  const [crosshairX, crosshairY] = useMemo(() => {
    if (!beamCenterQuery.data || zoomIndex < 0) {
      return [NaN, NaN];
    }

    const lines = beamCenterQuery.data.split("\n");
    const xLine = lines[zoomIndex * 7 + 1];
    const yLine = lines[zoomIndex * 7 + 2];

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
        `Failed to run plan , see console and logs for full error. Reason: ${error}`,
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
