import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from '@mui/material'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { useTranslation } from 'react-i18next'

interface LoginPromptModalProps {
  open: boolean
  onClose: () => void
}

const LoginPromptModal = ({ open, onClose }: LoginPromptModalProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 1 }}>
        <Box sx={{ mb: 2 }}>
          <LockRoundedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        </Box>
        <Typography variant="h5" component="span">
          {t('loginPrompt.title')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('loginPrompt.description')}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 3, pb: 3 }}>
        <Button variant="contained" fullWidth size="large" onClick={() => navigate('/signup')}>
          {t('loginPrompt.signUpFree')}
        </Button>
        <Button variant="outlined" fullWidth onClick={() => navigate('/signin')}>
          {t('loginPrompt.login')}
        </Button>
        <Button size="small" sx={{ color: 'text.secondary', mt: 0.5 }} onClick={onClose}>
          {t('loginPrompt.backToSections')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginPromptModal
