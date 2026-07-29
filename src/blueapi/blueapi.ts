import { useQuery, UseQueryResult } from "react-query";

const BLUEAPI_SOCKET: string = "/api"; // import.meta.env.VITE_BLUEAPI_SOCKET;

type BlueApiRequestBody = {
  planName: string;
  planParams: object;
  instrumentSession: string;
};
// Update to latest blueapi (> 1.0.0), See https://github.com/DiamondLightSource/mx-daq-ui/issues/72
// @todo check if blueapi request still works if planParams optional (since some times there's none)

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
  body?: object,
): Promise<Response> {
  const _method = method ?? "GET";
  const fullUrl = BLUEAPI_SOCKET + endpoint;
  return fetch(fullUrl, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-By": "XMLHttpRequest",
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
  queryKey?: string,
) {
  const fetchCall = async () => {
    return await blueApiCall(endpoint, method, body);
  };
  return useQuery(queryKey ?? "BlueApiCall", fetchCall, {
    refetchInterval: pollRateMillis ?? 500,
  });
}

export function processUseBlueApiCall(
  request: UseQueryResult<Response, unknown>,
  onSuccess: (data: Response) => string,
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

const PLAN_POLL_MILLIS = 10000;

type PlanSchemaProperty = {
  title?: string;
  type?: string;
  enum?: string[];
};

export type BlueApiPlan = {
  name: string;
  description?: string;
  schema?: {
    properties?: Record<string, PlanSchemaProperty>;
  };
};

export type PlanReadiness = {
  runnable: boolean;
  reason?: string;
};

// blueapi describes a plan's injected devices as parameters whose type is a dotted
// python path, with an enum listing the connected devices of that type. An ordinary
// choice parameter (e.g. GainMode) is a $ref into $defs and has type "string", so the
// dotted type is what tells a device apart from a plain enum.
function isDeviceParam(param: PlanSchemaProperty): boolean {
  return (
    Array.isArray(param.enum) &&
    param.type !== undefined &&
    param.type.includes(".")
  );
}

function fetchPlans(): Promise<BlueApiPlan[]> {
  return blueApiCall("/plans").then((res) => {
    if (!res.ok) {
      throw new Error(
        `Unable to fetch plans, response error ${res.status} ${res.statusText}`,
      );
    }
    return res.json().then((body) => body["plans"] ?? []);
  });
}

/** Check, before a plan is submitted, that blueapi knows it and has its devices.
 *
 * An empty device enum means blueapi failed to connect that device at startup, so
 * submitting would fail validation with a 422.
 */
export function usePlanReadiness(planName: string): PlanReadiness {
  const { data, status } = useQuery("BlueApiPlans", fetchPlans, {
    refetchInterval: PLAN_POLL_MILLIS,
  });

  // Until /plans answers, assume the plan is fine: an unreachable plan list
  // shouldn't be what stops an otherwise working beamline.
  if (status !== "success" || data === undefined) {
    return { runnable: true };
  }

  const plan = data.find((candidate) => candidate.name === planName);
  if (plan === undefined) {
    return {
      runnable: false,
      reason: `Plan ${planName} is not registered with blueapi`,
    };
  }

  const missingDevices = Object.entries(plan.schema?.properties ?? {})
    .filter(([, param]) => isDeviceParam(param) && param.enum?.length === 0)
    .map(([name]) => name);

  if (missingDevices.length > 0) {
    return {
      runnable: false,
      reason: `Not connected in blueapi: ${missingDevices.join(", ")}`,
    };
  }

  return { runnable: true };
}

// Note. fetch only rejects a promise on network errors, but http errors
// must be caught by checking the response
function submitTask(request: BlueApiRequestBody): Promise<string | void> {
  return blueApiCall("/tasks", "POST", {
    name: request.planName,
    params: request.planParams,
    instrument_session: request.instrumentSession,
  }).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Unable to POST request, response error ${res.status} ${res.statusText}`,
      );
    }
    return res.json().then((res) => res["task_id"]);
  });
}

function runTask(taskId: string): Promise<string | void> {
  return blueApiCall("/worker/task", "PUT", { task_id: taskId }).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Unable to run task, response error ${res.status} ${res.statusText}`,
      );
    }
    return res.json().then((res) => res["task_id"]);
  });
}

export function submitAndRunPlanImmediately(
  request: BlueApiRequestBody,
): Promise<string | void> {
  return submitTask(request).then((res) => {
    if (res) {
      runTask(res);
    } else {
      throw new Error("Couldn't run plan");
    }
  });
}

export function abortCurrentPlan(): Promise<BlueApiWorkerState> {
  return blueApiCall("/worker/state", "PUT", {
    new_state: "ABORTING",
    reason: "Abort button pressed",
  }).then((res) => res.json());
}
