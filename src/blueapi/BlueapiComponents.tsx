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

type VariantChoice = "outlined" | "contained";

type PlanButtonProps = {
  btnLabel: string;
  planName: string;
  planParams?: object;
  title?: string;
  //   btnColour?: string;
  btnVariant?: VariantChoice;
};

export function RunPlanButton(props: PlanButtonProps) {
  const params = props.planParams ? props.planParams : {};
  const variant = props.btnVariant ? props.btnVariant : "outlined";

  return (
    <div>
      <Tooltip title={props.title ? props.title : ""} placement="bottom">
        <Button
          variant={variant}
          color="custom"
          onClick={() =>
            submitAndRunPlanImmediately({
              planName: props.planName,
              planParams: params,
            })
          }
        >
          {props.btnLabel}
        </Button>
      </Tooltip>
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
    reason?: SnackbarCloseReason
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
