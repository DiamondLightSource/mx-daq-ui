import { useQuery } from "react-query";

const CONFIG_SOCKET: string = import.meta.env.VITE_CONFIG_SOCKET;
// const DISPLAY_CONFIG_ENDPOINT =
//   "/dls_sw/i24/software/daq_configuration/display.configuration";
const DISPLAY_CONFIG_ENDPOINT =
  "/dls_sw/i24/software/gda_versions/var/display.configuration";

function configCall(endpoint: string, method?: string): Promise<Response> {
  const _method = method ?? "GET";
  const fullUrl = CONFIG_SOCKET + "/config" + endpoint;
  return fetch(fullUrl, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: _method,
  });
}

export function useConfigCall(
  endpoint: string,
  method?: string,
  pollRateMillis?: number,
  queryKey?: string,
) {
  const fetchCall = async () => {
    return await configCall(endpoint, method);
  };
  return useQuery(queryKey ?? "BlueApiCall", fetchCall, {
    refetchInterval: pollRateMillis ?? 500,
  });
}

export async function testConfigCall() {
  const res = await fetch(CONFIG_SOCKET + DISPLAY_CONFIG_ENDPOINT, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  console.log(await res.text());
}
