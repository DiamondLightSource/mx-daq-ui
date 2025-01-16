import { useQuery, UseQueryResult } from "react-query";

const BLUEAPI_SOCKET = import.meta.env.VITE_BLUEAPI_SOCKET;
export type BlueApiWorkerState =
  | "IDLE"
  | "RUNNING"
  | "PAUSING"
  | "PAUSED"
  | "HALTING"
  | "STOPPING"
  | "ABORTING"
  | "SUSPENDING"
  | "PANICKED"
  | "UNKNOWN";

function blueApiCall(endpoint: string, method?: string, body?: object) {
  const _method = method ?? "GET";
  return fetch(BLUEAPI_SOCKET + endpoint, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: _method,
    body: body ? JSON.stringify(body) : null,
  });
}

export function useBlueApiCall(
  endpoint: string,
  method?: string,
  body?: object,
  pollRateMillis?: number,
  queryKey?: string
) {
  return useQuery(
    queryKey ?? "BlueApiCall",
    async () => await blueApiCall(endpoint, method, body),
    {
      refetchInterval: pollRateMillis ?? 500,
    }
  );
}

export function processUseBlueApiCall(
  request: UseQueryResult<Response, unknown>,
  onSuccess: (data: Response) => string
) {
  if (request.status === "error") {
    return "Error fetching query!";
  }
  if (request.status === "loading") {
    return "Fetching query...";
  }
  if (request.status === "success") {
    return onSuccess(request.data);
  }
}

export function getWorkerStatus(): Promise<BlueApiWorkerState> {
  return blueApiCall("/worker/state").then((res) => res.json());
}

export function submitPlan(
  planName: string,
  planParams: object
): Promise<string> {
  return blueApiCall("/tasks", "POST", {
    name: planName,
    params: planParams,
  }).then((res) => res.json().then((res) => res["task_id"]));
}

// TODO see if possible to have planParams as optional
// Not all plans need input args
export function submitAndRunPlanImmediately(
  planName: string,
  planParams: object
): Promise<string> {
  return submitPlan(planName, planParams).then((res) =>
    // TODO make sure submitPlan was succesful before then putting it to the worker
    blueApiCall("/worker/task", "PUT", { task_id: res }).then((res) =>
      res.json().then((res) => res["task_id"])
    )
  );
}

// TODO Need some way to get things from devices!
