import { ReactNode } from "react";
import { useConfigCall } from "#/config_server/configServer.ts";
import { BeamCenterContext } from "./BeamCenterContext";

const DISPLAY_CONFIG_ENDPOINT =
  "/dls_sw/i24/software/daq_configuration/domain/display.configuration";

export const BeamCenterProvider = ({ children }: { children: ReactNode }) => {
  const beamCenterQuery = useConfigCall(DISPLAY_CONFIG_ENDPOINT);

  return (
    <BeamCenterContext.Provider value={beamCenterQuery}>
      {children}
    </BeamCenterContext.Provider>
  );
};
