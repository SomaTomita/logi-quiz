import { forwardRef } from 'react'
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar'
import MuiAlert, { type AlertProps } from '@mui/material/Alert'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface AlertMessageProps {
  open: boolean
  setOpen: (open: boolean) => void
  severity: 'error' | 'success' | 'info' | 'warning'
  message: string
}

const AlertMessage = ({ open, setOpen, severity, message }: AlertMessageProps) => {
  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default AlertMessage
