import React, { ReactNode } from "react";
import {
  abortCurrentPlan,
  submitAndRunPlanImmediately,
  usePlanReadiness,
  useRefreshWorkerState,
  useTaskProgress,
  WorkerBusyError,
} from "./blueapi";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
  Tooltip,
  Typography,
} from "@mui/material";
import { parseInstrumentSession, readVisitFromPv } from "./visit";

/** The most useful thing we can say about a rejected promise, in one line. */
function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

type SeverityLevel = "success" | "info" | "warning" | "error";
type VariantChoice = "outlined" | "contained";
type ButtonSize = "small" | "medium" | "large";
type ButtonColor = "primary" | "secondary" | "custom";
type ButtonStyleTemplates = "containedButtonStyles" | "outlinedButtonStyles";

type RunPlanButtonProps = {
  btnLabel: string | ReactNode;
  planName: string;
  planParams?: object;
  currentVisit?: string;
  title?: string;
  btnVariant?: VariantChoice;
  btnSize?: ButtonSize;
  btnColor?: ButtonColor;
  disabled?: boolean;
  styleTemplate?: ButtonStyleTemplates;
  sx?: object;
  tooltipSx?: object;
  typographySx?: object;
};

export function RunPlanButton(props: RunPlanButtonProps) {
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
  const [msg, setMsg] = React.useState<string>("Running plan...");
  const [severity, setSeverity] = React.useState<SeverityLevel>("info");
  // Set the moment this button is pressed, so a second press cannot get in during the
  // round trip to blueapi, before there is a task to follow.
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  // The task this button started, followed until blueapi reports how it ended.
  const [taskId, setTaskId] = React.useState<string | undefined>(undefined);

  let fullVisit: string;
  if (props.currentVisit === undefined) {
    fullVisit = readVisitFromPv();
  } else {
    fullVisit = props.currentVisit;
  }
  let instrumentSession: string;

  const progress = useTaskProgress(taskId);

  const inProgress = submitting || progress.state === "running";

  // While this button's plan is in flight the worker state is about to change, so ask
  // for it often; the rest of the time a slow poll is enough.
  const readiness = usePlanReadiness(props.planName, inProgress);

  const refreshWorkerState = useRefreshWorkerState();

  // Report how the plan ended, then stop following the task. A plan can fail long after
  // it was accepted, and the only way to hear about it is to ask blueapi for the task.
  React.useEffect(() => {
    switch (progress.state) {
      case "succeeded":
        setSeverity("success");
        setMsg(`Plan ${props.planName} finished`);
        setOpenSnackbar(true);
        setTaskId(undefined);
        break;
      case "failed":
        setSeverity("error");
        setMsg(`Plan ${props.planName} failed: ${progress.message}`);
        setOpenSnackbar(true);
        setTaskId(undefined);
        break;
      case "unreadable":
        setSeverity("warning");
        setMsg(
          `Cannot tell whether plan ${props.planName} succeeded: blueapi did not answer. Check the logs.`,
        );
        setOpenSnackbar(true);
        setTaskId(undefined);
        break;
    }
    // Keyed on the state alone: reporting clears taskId, which moves the state to "none",
    // so the next plan's state change re-triggers this even if it fails the same way.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.state]);

  const params = props.planParams ? props.planParams : {};
  const variant = props.btnVariant ? props.btnVariant : "outlined";
  const size = props.btnSize ? props.btnSize : "medium";
  const color = props.btnColor ? props.btnColor : "custom";
  const disabled =
    (props.disabled ? props.disabled : false) ||
    !readiness.runnable ||
    inProgress;
  const buttonStyles = props.styleTemplate ? props.styleTemplate : {};
  const sx = props.sx ? { ...buttonStyles, ...props.sx } : {}; // Style for the button component which is the most likely to be customised
  const tooltipSx = props.tooltipSx ? props.tooltipSx : {};

  const handleClick = () => {
    if (inProgress) {
      return;
    }
    setSubmitting(true);
    setSeverity("info");
    setMsg(`Running plan ${props.planName}...`);
    setOpenSnackbar(true);
    try {
      instrumentSession = parseInstrumentSession(fullVisit);
      console.log(`Current instrument session: ${instrumentSession}`);
      submitAndRunPlanImmediately({
        planName: props.planName,
        planParams: params,
        instrumentSession: instrumentSession,
      })
        .then((id) => {
          // Follow this task from here on; the in-progress marker and the eventual
          // success or failure message both come from it.
          setTaskId(id);
        })
        .catch((error) => {
          setSeverity("error");
          setMsg(
            error instanceof WorkerBusyError
              ? `Cannot run ${props.planName}: a plan is already running`
              : // blueapi says why it refused - a 422's offending field, a 500's
                // traceback summary - so show that rather than sending the user to
                // a console they may not have open.
                `Failed to run plan ${props.planName}: ${describeError(error)}`,
          );
          console.error(`Failed to run plan ${props.planName}. Reason: ${error}`);
          // blueapi has just contradicted the readiness check, so re-read the worker
          // state rather than leaving the button enabled until the next idle poll.
          refreshWorkerState();
        })
        .finally(() => setSubmitting(false));
    } catch (error) {
      setSubmitting(false);
      setSeverity("error");
      setMsg(
        `Failed to run plan ${props.planName}, please check visit PV is set.`,
      );
      console.error(`An error occurred ${error}`);
    }
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <div>
      <Tooltip
        title={
          inProgress
            ? `Running ${props.planName}...`
            : (readiness.reason ?? (props.title ? props.title : ""))
        }
        placement="bottom"
        slotProps={{
          tooltip: {
            sx: tooltipSx,
          },
        }}
        arrow
      >
        {/* A disabled button emits no pointer events, so it needs a wrapper for the
        tooltip to explain why it is disabled. */}
        <span style={{ display: "inline-flex" }}>
          <Button
            variant={variant}
            color={color}
            size={size}
            disabled={disabled}
            onClick={handleClick}
            sx={sx}
            startIcon={
              inProgress ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            <Typography variant="button" fontWeight="fontWeightBold">
              {props.btnLabel}
            </Typography>
          </Button>
        </span>
      </Tooltip>
      <Snackbar
        open={openSnackbar}
        // Failures stay up until dismissed: a plan traceback is not readable in 5s, and
        // a missed failure is how a broken collection looks like a working one.
        autoHideDuration={
          severity === "info" || severity === "success" ? 5000 : null
        }
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={severity}
          sx={{ maxWidth: 600, overflowWrap: "anywhere" }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export function AbortButton() {
  const [openMsg, setOpenMsg] = React.useState<boolean>(false);

  const handleClick = () => {
    setOpenMsg(true);
    abortCurrentPlan();
  };

  const handleMsgClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMsg(false);
  };

  return (
    <div>
      <Tooltip title="Abort current blueapi operation" placement="bottom">
        <Button
          color="custom"
          variant="outlined"
          size="large"
          onClick={handleClick}
        >
          <Typography
            variant="button"
            fontWeight="fontWeightBold"
            sx={{ display: "block" }}
          >
            Abort!
          </Typography>
        </Button>
      </Tooltip>
      <Snackbar
        open={openMsg}
        autoHideDuration={5000}
        onClose={handleMsgClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleMsgClose} severity="warning">
          Aborting plan ...
        </Alert>
      </Snackbar>
    </div>
  );
}
