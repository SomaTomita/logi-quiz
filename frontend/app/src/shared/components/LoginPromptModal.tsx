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

interface LoginPromptModalProps {
  open: boolean
  onClose: () => void
}

const LoginPromptModal = ({ open, onClose }: LoginPromptModalProps) => {
  const navigate = useNavigate()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 1 }}>
        <Box sx={{ mb: 2 }}>
          <LockRoundedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        </Box>
        <Typography variant="h5" component="span">
          無料体験の上限に達しました
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          アカウントを作成すると、学習記録の保存や進捗の確認ができるようになります。
        </Typography>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 3, pb: 3 }}>
        <Button variant="contained" fullWidth size="large" onClick={() => navigate('/signup')}>
          無料で新規登録
        </Button>
        <Button variant="outlined" fullWidth onClick={() => navigate('/signin')}>
          ログイン
        </Button>
        <Button size="small" sx={{ color: 'text.secondary', mt: 0.5 }} onClick={onClose}>
          セクション一覧に戻る
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginPromptModal
