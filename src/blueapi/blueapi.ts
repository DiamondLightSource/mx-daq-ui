import { useQuery, UseQueryResult } from "react-query";

const BLUEAPI_SOCKET: string = import.meta.env.VITE_BLUEAPI_SOCKET;

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

function blueApiCall(
  endpoint: string,
  method?: string,
  body?: object
): Promise<Response> {
  const _method = method ?? "GET";
  const fullUrl = BLUEAPI_SOCKET + endpoint;
  return fetch(fullUrl, {
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

// Note. fetch only rejects a promise on network errors, but http errors
// must be caught by checking the response
export function submitTask(
  planName: string,
  planParams: object
): Promise<string | void> {
  return blueApiCall("/tasks", "POST", {
    name: planName,
    params: planParams,
  }).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Unable to POST request, response error ${res.statusText}`
      );
    }
    res.json().then((res) => res["task_id"]);
  });
}

export function runTask(taskId: string): Promise<string | void> {
  return blueApiCall("/worker/task", "PUT", { task_id: taskId }).then((res) => {
    if (!res.ok) {
      throw new Error(`Unable to run task, response error ${res.statusText}`);
    }
    res.json().then((res) => res["task_id"]);
  });
}

export function submitAndRunPlanImmediately(
  planName: string,
  planParams: object
): Promise<string | void> {
  return submitTask(planName, planParams)
    .then((res) => {
      if (res) {
        runTask(res);
      }
    })
    .catch((error) => console.log(error));
}
//   return submitPlan(planName, planParams)
//     .then((res) =>
//       // TODO make sure submitPlan was succesful before then putting it to the worker
//       // See https://github.com/DiamondLightSource/mx-daq-ui/issues/17
//       blueApiCall("/worker/task", "PUT", { task_id: res }).then((res) =>
//         res.json().then((res) => res["task_id"])
//       )
//     )
//     .catch((error) => console.log(error));
// }

export function abortCurrentPlan(): Promise<BlueApiWorkerState> {
  return blueApiCall("/worker/state", "PUT", {
    new_state: "ABORTING",
    reason: "Abort button pressed",
  }).then((res) => res.json());
}
