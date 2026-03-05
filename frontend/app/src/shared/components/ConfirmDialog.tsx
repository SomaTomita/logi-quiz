import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} aria-describedby="confirm-dialog-description">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="confirm-dialog-description">{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>No</Button>
      <Button onClick={onConfirm} color="error">
        Yes
      </Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmDialog
