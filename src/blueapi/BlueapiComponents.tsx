import React, { ReactNode } from "react";
import {
  abortCurrentPlan,
  submitAndRunPlanImmediately,
  usePlanReadiness,
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

type SeverityLevel = "success" | "info" | "warning" | "error";
type VariantChoice = "outlined" | "contained";
type ButtonSize = "small" | "medium" | "large";
type ButtonColor = "primary" | "secondary" | "custom";
type ButtonStyleTemplates = "containedButtonStyles" | "outlinedButtonStyles";

// How long to keep a just-pressed button marked in-progress if the worker state poll
// never reports it busy. Several poll intervals, so a slow answer doesn't release early.
const OWNERSHIP_GRACE_MILLIS = 5000;

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
  // round trip to blueapi or the up-to-500ms wait for the worker state poll to notice.
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  // This button is the one that started the plan the worker is currently running.
  const [ownsRunningPlan, setOwnsRunningPlan] = React.useState<boolean>(false);

  let fullVisit: string;
  if (props.currentVisit === undefined) {
    fullVisit = readVisitFromPv();
  } else {
    fullVisit = props.currentVisit;
  }
  let instrumentSession: string;

  const readiness = usePlanReadiness(props.planName);

  // Track ownership across the worker's busy period: arm on submit, release once the
  // worker has been seen busy and then idle again.
  const sawWorkerBusy = React.useRef<boolean>(false);
  React.useEffect(() => {
    if (!ownsRunningPlan) {
      return;
    }
    if (readiness.workerBusy) {
      sawWorkerBusy.current = true;
      return;
    }
    if (sawWorkerBusy.current) {
      sawWorkerBusy.current = false;
      setOwnsRunningPlan(false);
      return;
    }
    // The worker never looked busy: either the plan finished inside one poll interval,
    // or it never started. Release rather than leave the button disabled for good.
    const timer = setTimeout(
      () => setOwnsRunningPlan(false),
      OWNERSHIP_GRACE_MILLIS,
    );
    return () => clearTimeout(timer);
  }, [ownsRunningPlan, readiness.workerBusy]);

  const inProgress = submitting || ownsRunningPlan;

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
        .then(() => {
          // Hold the in-progress marker until the worker state poll confirms the plan
          // is running, otherwise the button would flick back to enabled in between.
          setOwnsRunningPlan(true);
        })
        .catch((error) => {
          setSeverity("error");
          setMsg(
            `Failed to run plan ${props.planName}, see console and logs for full error`,
          );
          console.error(`Failed to run plan ${props.planName}. Reason: ${error}`);
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
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={severity}>
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
