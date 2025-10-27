import React from "react";
import { abortCurrentPlan, submitAndRunPlanImmediately } from "./blueapi";
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

type RunPlanButtonProps = {
  btnLabel: string;
  planName: string;
  planParams?: object;
  title?: string;
  btnVariant?: VariantChoice;
  btnSize?: ButtonSize;
};

// @{todo} Ideally we should be able to set up the stylings for
// a custom button in the proper way by doing something like:
// const CustomRunButton = styled(Button)({
//   width: "100%",
//   height: "85%",
//   color: "var(--color)",
//   backgroundColor: "var(--backgroundColor)",
//   padding: "var(--padding)",
//   margin: "var(--margin)",
// });
// This will be another PR
// See https://github.com/DiamondLightSource/mx-daq-ui/issues/71

export function RunPlanButton(props: RunPlanButtonProps) {
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
  const [msg, setMsg] = React.useState<string>("Running plan...");
  const [severity, setSeverity] = React.useState<SeverityLevel>("info");

  const fullVisit = readVisitFromPv();
  let instrumentSession: string;

  const params = props.planParams ? props.planParams : {};
  const variant = props.btnVariant ? props.btnVariant : "outlined";
  const size = props.btnSize ? props.btnSize : "medium";

  const handleClick = () => {
    setOpenSnackbar(true);
    try {
      instrumentSession = parseInstrumentSession(fullVisit);
      submitAndRunPlanImmediately({
        planName: props.planName,
        planParams: params,
        instrumentSession: instrumentSession,
      }).catch((error) => {
        setSeverity("error");
        setMsg(
          `Failed to run plan ${props.planName}, see console and logs for full error`,
        );
        console.log(`${msg}. Reason: ${error}`);
      });
    } catch (error) {
      setSeverity("error");
      setMsg(
        `Failed to run plan ${props.planName}, please check visit PV is set.`,
      );
      console.log(`An error occurred ${error}`);
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
      <Tooltip title={props.title ? props.title : ""} placement="bottom">
        <Button
          variant={variant}
          color="custom"
          size={size}
          onClick={handleClick}
        >
          <Typography
            variant="button"
            fontWeight="fontWeightBold"
            sx={{ display: "block" }}
          >
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
          Aborting plan ...
        </Alert>
      </Snackbar>
    </div>
  );
}
