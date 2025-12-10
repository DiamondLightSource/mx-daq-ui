import { CsWebLibConfig } from "@diamondlightsource/cs-web-lib";
import { useEffect, useState } from "react";
// import config from "../public/pvwsconfig.json";

export const loadConfig = async (): Promise<CsWebLibConfig> => {
  let config;
  try {
    // Point towards your file location
    const response = await fetch("/public/pvwsconfig.json");
    config = await response.json();
  } catch (error) {
    console.warn("Configuration not found falling back to defaults", error);
    // Set defaults here if necessary
    config = {
      PVWS_SOCKET: undefined,
      PVWS_SSL: undefined,
      THROTTLE_PERIOD: undefined,
    };
  }

  return config as CsWebLibConfig;
};

export const usePvwsConfig = () => {
  const [config, setConfig] = useState<CsWebLibConfig | null>(null);
  useEffect(() => {
    loadConfig().then((config) => {
      setConfig(config);
    });
  }, []);
  return config;
};
