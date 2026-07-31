import { useQuery, useQueryClient, UseQueryResult } from "react-query";

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
const WORKER_STATE_QUERY_KEY = "BlueApiWorkerState";
// Fast enough to feel immediate while a state change is expected, slow enough to keep
// an idle beamline out of the blueapi log.
const WORKER_STATE_ACTIVE_POLL_MILLIS = 500;
const WORKER_STATE_IDLE_POLL_MILLIS = 10000;

// Anything other than IDLE means blueapi will reject PUT /worker/task with a 409, so
// there is no point offering to start a plan. PANICKED is called out separately because
// it needs a restart rather than just waiting.
const BUSY_WORKER_STATES: BlueApiWorkerState[] = [
  "RUNNING",
  "PAUSING",
  "PAUSED",
  "HALTING",
  "STOPPING",
  "ABORTING",
  "SUSPENDING",
];

/** Poll the worker state. All callers share one query, so one poll serves every button.
 *
 * The poll only runs fast when the state is expected to move: while the worker is
 * mid-plan, or while `awaitingChange` says this caller has just triggered something and
 * is waiting for the worker to catch up. An idle worker with nothing pending only
 * changes when somebody else starts a plan, and a slow poll notices that soon enough.
 *
 * react-query gives each caller its own timer but dedupes the fetches, so one caller
 * asking for the fast rate speeds up the shared query for everyone.
 */
export function useWorkerState(
  awaitingChange: boolean = false,
): BlueApiWorkerState | undefined {
  const { data, status } = useQuery(WORKER_STATE_QUERY_KEY, getWorkerStatus, {
    refetchInterval: (state?: BlueApiWorkerState) =>
      awaitingChange || isWorkerBusy(state)
        ? WORKER_STATE_ACTIVE_POLL_MILLIS
        : WORKER_STATE_IDLE_POLL_MILLIS,
  });
  return status === "success" ? data : undefined;
}

/** Ask for the worker state now instead of waiting for the next poll.
 *
 * Worth calling whenever blueapi contradicts what the frontend believed, so a slow idle
 * poll cannot leave a button enabled that blueapi has just refused.
 */
export function useRefreshWorkerState(): () => void {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries(WORKER_STATE_QUERY_KEY);
}

export function isWorkerBusy(state: BlueApiWorkerState | undefined): boolean {
  return state !== undefined && BUSY_WORKER_STATES.includes(state);
}

const TASK_POLL_MILLIS = 1000;

/** blueapi records a finished task's fate as a discriminated union on `outcome`. */
export type BlueApiTaskOutcome =
  | { outcome: "success"; type: string; result?: unknown }
  | { outcome: "error"; type: string; message: string };

export type BlueApiTask = {
  task_id: string;
  is_complete: boolean;
  is_pending: boolean;
  errors: string[];
  outcome?: BlueApiTaskOutcome | null;
};

/** What became of a submitted plan, as far as the frontend can tell. */
export type TaskProgress =
  | { state: "none" }
  | { state: "running" }
  | { state: "succeeded" }
  | { state: "failed"; message: string }
  /** The task exists but its fate could not be read, so treat the plan as finished. */
  | { state: "unreadable" };

function fetchTask(taskId: string): Promise<BlueApiTask> {
  return blueApiCall(`/tasks/${taskId}`).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Unable to fetch task ${taskId}, response error ${res.status} ${res.statusText}`,
      );
    }
    return res.json();
  });
}

/** Follow a submitted task until blueapi says it is complete, then report its fate.
 *
 * PUT /worker/task returns as soon as the worker accepts the task, so a plan that dies
 * partway through is only visible by asking about the task afterwards.
 */
export function useTaskProgress(taskId: string | undefined): TaskProgress {
  const { data, status } = useQuery(
    ["BlueApiTask", taskId],
    () => fetchTask(taskId as string),
    {
      enabled: taskId !== undefined,
      // Stop polling once it is complete; there is nothing left to learn.
      refetchInterval: (task?: BlueApiTask) =>
        task?.is_complete ? false : TASK_POLL_MILLIS,
    },
  );

  if (taskId === undefined) {
    return { state: "none" };
  }
  if (status === "error") {
    return { state: "unreadable" };
  }
  if (status !== "success" || data === undefined || !data.is_complete) {
    // Still loading counts as running: the plan was accepted, so it is underway.
    return { state: "running" };
  }
  if (data.outcome?.outcome === "error") {
    return { state: "failed", message: data.outcome.message };
  }
  // A completed task carrying errors but no error outcome is still a failure.
  if (data.errors.length > 0) {
    return { state: "failed", message: data.errors.join("; ") };
  }
  return { state: "succeeded" };
}

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
  /** The worker is mid-plan, so a plan is running somewhere on the beamline. */
  workerBusy: boolean;
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

/** Check, before a plan is submitted, that blueapi knows it, has its devices, and is free.
 *
 * An empty device enum means blueapi failed to connect that device at startup, so
 * submitting would fail validation with a 422. A non-idle worker means blueapi would
 * accept the task but refuse to start it with a 409, leaving an orphan in the task store.
 *
 * `awaitingChange` is for a caller that has just submitted a plan and is waiting for the
 * worker to report it; see useWorkerState.
 */
export function usePlanReadiness(
  planName: string,
  awaitingChange: boolean = false,
): PlanReadiness {
  const { data, status } = useQuery("BlueApiPlans", fetchPlans, {
    refetchInterval: PLAN_POLL_MILLIS,
  });
  const workerState = useWorkerState(awaitingChange);
  const workerBusy = isWorkerBusy(workerState);

  if (workerBusy) {
    return {
      runnable: false,
      reason: `A plan is already running (worker is ${workerState})`,
      workerBusy: true,
    };
  }

  if (workerState === "PANICKED") {
    return {
      runnable: false,
      reason: "The blueapi worker has panicked and needs restarting",
      workerBusy: false,
    };
  }

  // Until /plans answers, assume the plan is fine: an unreachable plan list
  // shouldn't be what stops an otherwise working beamline.
  if (status !== "success" || data === undefined) {
    return { runnable: true, workerBusy: false };
  }

  const plan = data.find((candidate) => candidate.name === planName);
  if (plan === undefined) {
    return {
      runnable: false,
      reason: `Plan ${planName} is not registered with blueapi`,
      workerBusy: false,
    };
  }

  const missingDevices = Object.entries(plan.schema?.properties ?? {})
    .filter(([, param]) => isDeviceParam(param) && param.enum?.length === 0)
    .map(([name]) => name);

  if (missingDevices.length > 0) {
    return {
      runnable: false,
      reason: `Not connected in blueapi: ${missingDevices.join(", ")}`,
      workerBusy: false,
    };
  }

  return { runnable: true, workerBusy: false };
}

// Note. fetch only rejects a promise on network errors, but http errors
// must be caught by checking the response
function submitTask(request: BlueApiRequestBody): Promise<string> {
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
    return res.json().then((body) => {
      const taskId = body["task_id"];
      if (!taskId) {
        throw new Error("blueapi accepted the task but returned no task_id");
      }
      return taskId as string;
    });
  });
}

/** blueapi accepted the task but refused to start it because the worker is not idle. */
export class WorkerBusyError extends Error {
  constructor() {
    super("The blueapi worker is already running a plan");
    this.name = "WorkerBusyError";
  }
}

function runTask(taskId: string): Promise<void> {
  return blueApiCall("/worker/task", "PUT", { task_id: taskId }).then((res) => {
    // A 409 is the one failure the frontend can explain in full, and the likely one:
    // the readiness check runs off a poll, so a plan started elsewhere in the meantime
    // is invisible until the next one lands.
    if (res.status === 409) {
      throw new WorkerBusyError();
    }
    if (!res.ok) {
      throw new Error(
        `Unable to run task, response error ${res.status} ${res.statusText}`,
      );
    }
  });
}

/** Submit a plan and start it, resolving with the task id so its fate can be followed. */
export function submitAndRunPlanImmediately(
  request: BlueApiRequestBody,
): Promise<string> {
  return submitTask(request).then((taskId) =>
    // Returned, not just called: otherwise a 409 from a busy worker becomes an
    // unhandled rejection and the caller thinks the plan started.
    runTask(taskId).then(() => taskId),
  );
}

export function abortCurrentPlan(): Promise<BlueApiWorkerState> {
  return blueApiCall("/worker/state", "PUT", {
    new_state: "ABORTING",
    reason: "Abort button pressed",
  }).then((res) => res.json());
}
