import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onCancel} aria-describedby="confirm-dialog-description">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
        <Button onClick={onConfirm} color="error">
          {t('common.yes')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
