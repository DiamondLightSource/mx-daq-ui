import { useQuery } from "react-query";

const CONFIG_SOCKET: string = import.meta.env.VITE_CONFIG_SOCKET;

function configCall(endpoint: string, method?: string): Promise<Response> {
  const _method = method ?? "GET";
  const fullUrl = CONFIG_SOCKET + "/config/" + endpoint;
  return fetch(fullUrl, {
    headers: { Accept: "text/plain" },
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
    const response = await configCall(endpoint, method);
    return await response.text();
  };
  return useQuery(queryKey ?? "ConfigCall", fetchCall, {
    refetchInterval: pollRateMillis ?? 500,
  });
}
