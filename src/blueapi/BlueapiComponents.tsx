import React, { ReactNode } from "react";
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

  const handleClick = () => {
    setOpenSnackbar(true);
    try {
      instrumentSession = parseInstrumentSession(fullVisit);
      console.log(`Current instrument session: ${instrumentSession}`);
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
          Aborting plan ...
        </Alert>
      </Snackbar>
    </div>
  );
}
