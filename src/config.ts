import { CsWebLibConfig } from "@diamondlightsource/cs-web-lib";
import { useEffect, useState } from "react";
// import config from "../public/pvwsconfig.json";

export const loadConfig = async (): Promise<CsWebLibConfig> => {
  let config;
  if (config) {
    return config;
  }
  try {
    // Point towards your file location
    const response = await fetch("/mx-daq-ui/public/pvwsconfig.json");
    config = await response.json();
  } catch (error) {
    console.warn("Configuration not found falling back to defaults", error);
    // Set defaults here if necessary
    config = {
      PVWS_SOCKET: "pvws.diamond.ac.uk",
      PVWS_SSL: true,
      THROTTLE_PERIOD: 100,
    };
  }

  return config as CsWebLibConfig;
};

export const usePvwsConfig = () => {
  const [config, setConfig] = useState<CsWebLibConfig>();
  useEffect(() => {
    loadConfig().then((config) => {
      setConfig(config);
    });
  }, []);
  //   if (config === null) {
  //     console.log(config);
  //     throw new Error("PVWS configuration not loaded correctly.");
  //   }
  return config;
};
