import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { forwardRef } from "react";


const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
 // forwardRefを使うことで、親コンポーネント（AlertMessage）が、子コンポーネント(Mui Alert)にアクセスすることが可能に
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface AlertMessageProps {
  open: boolean;
  setOpen: Function;
  severity: "error" | "success" | "info" | "warning";
  message: string;
}


const AlertMessage = ({ open, setOpen, severity, message }: AlertMessageProps) => {
  const handleCloseAlertMessage = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => { //
    if (reason === "clickaway") return;

    setOpen(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000} // 6秒後、自動的に非表示
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleCloseAlertMessage}
        >
        <Alert onClose={handleCloseAlertMessage} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AlertMessage;
