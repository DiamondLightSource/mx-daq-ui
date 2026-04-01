import React, { ReactNode, useCallback, useEffect } from "react";
import {
  abortCurrentPlan,
  submitAndRunPlanImmediately,
  getWorkerStatus,
  type BlueApiWorkerState,
} from "./blueapi";
import {
  Alert,
  Button,
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
  const [isPolling, setIsPolling] = React.useState<boolean>(false);
  const [initialWorkerState, setInitialWorkerState] =
    React.useState<BlueApiWorkerState | null>(null);

  let fullVisit: string;
  if (props.currentVisit === undefined) {
    fullVisit = readVisitFromPv();
  } else {
    fullVisit = props.currentVisit;
  }
  let instrumentSession: string;

  const params = props.planParams ? props.planParams : {};
  const variant = props.btnVariant ? props.btnVariant : "outlined";
  const size = props.btnSize ? props.btnSize : "medium";
  const color = props.btnColor ? props.btnColor : "custom";
  const disabled = props.disabled ? props.disabled : false;
  const buttonStyles = props.styleTemplate ? props.styleTemplate : {};
  const sx = props.sx ? { ...buttonStyles, ...props.sx } : {}; // Style for the button component which is the most likely to be customised
  const tooltipSx = props.tooltipSx ? props.tooltipSx : {};

  const pollWorkerStatus = useCallback(async () => {
    try {
      const currentState: BlueApiWorkerState = await getWorkerStatus();

      if (initialWorkerState === "RUNNING" && currentState === "IDLE") {
        setSeverity("success");
        setMsg("Plan completed successfully");
        setIsPolling(false);
        setInitialWorkerState(null);
        return;
      }

      if (currentState === "PANICKED") {
        setSeverity("error");
        setMsg("Plan failed.");
        setIsPolling(false);
        setInitialWorkerState(null);
        return;
      }
    } catch (error) {
      console.error("Error polling worker status:", error);
      setIsPolling(false);
      setInitialWorkerState(null);
    }
  }, [initialWorkerState]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isPolling) {
      intervalId = setInterval(pollWorkerStatus, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPolling, pollWorkerStatus]);

  const handleClick = async () => {
    setOpenSnackbar(true);
    try {
      setSeverity("info");
      setMsg("Running plan...");

      const initialState = await getWorkerStatus();
      setInitialWorkerState(initialState);
      instrumentSession = parseInstrumentSession(fullVisit);
      console.log(`Current instrument session: ${instrumentSession}`);
      await submitAndRunPlanImmediately({
        planName: props.planName,
        planParams: params,
        instrumentSession: instrumentSession,
      });
      setIsPolling(true);
    } catch (error) {
      setSeverity("error");
      setMsg(
        `Failed to run plan ${props.planName}, see console and logs for full error`,
      );
      console.error(`${msg}. Reason: ${error}`);
      setIsPolling(false);
      setInitialWorkerState(null);
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
        title={props.title ? props.title : ""}
        placement="bottom"
        slotProps={{
          tooltip: {
            sx: tooltipSx,
          },
        }}
        arrow
      >
        <Button
          variant={variant}
          color={color}
          size={size}
          disabled={disabled}
          onClick={handleClick}
          sx={sx}
        >
          <Typography variant="button" fontWeight="fontWeightBold">
            {props.btnLabel}
          </Typography>
        </Button>
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
          Aborting plan...
        </Alert>
      </Snackbar>
    </div>
  );
}
