import { Snackbar, Alert as Notification } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Alert, shiftAlert } from "./alerts.slice";

const Alerts = () => {
  const [activeAlert, setActiveAlert] = useState<Alert | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const alerts = useSelector((state: RootState) => state.alerts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (alerts.length && !activeAlert) {
      setActiveAlert(alerts[0]);
      dispatch(shiftAlert());
      setOpen(true);
    } else if (alerts.length && activeAlert && open) {
      setOpen(false);
    }
  }, [dispatch, alerts, activeAlert, open]);

  const handleClose = () => setOpen(false);

  const handleExited = () => {
    setActiveAlert(undefined);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      sx={{
        bottom: "2rem",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Notification severity={activeAlert?.severity}>
        {activeAlert?.message}
      </Notification>
    </Snackbar>
  );
};

export default Alerts;
