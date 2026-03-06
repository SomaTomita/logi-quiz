import { Link, useNavigate } from 'react-router-dom'
import { Button, Container, Typography, Paper, Box, Chip, Grid } from '@mui/material'
import QuizIcon from '@mui/icons-material/Quiz'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import ReplayIcon from '@mui/icons-material/Replay'
import ListAltIcon from '@mui/icons-material/ListAlt'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TimerIcon from '@mui/icons-material/Timer'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useAuthStore } from '@/features/auth/store'

const steps = [
  {
    icon: <QuizIcon />,
    title: '4択 x 10問',
    description: '各セクション10問の選択問題に挑戦',
  },
  {
    icon: <TimerOutlinedIcon />,
    title: '15秒の制限時間',
    description: '1問につき15秒以内に回答しましょう',
  },
  {
    icon: <ArrowForwardIcon />,
    title: '一方通行',
    description: 'Nextで次へ進むと前の問題には戻れません',
  },
  {
    icon: <EmojiEventsOutlinedIcon />,
    title: '結果と解説',
    description: 'Finishで正答数と各問題の解説を確認',
  },
  {
    icon: <ReplayIcon />,
    title: 'Try again',
    description: '同じセクションを何度でも繰り返し学習',
  },
  {
    icon: <ListAltIcon />,
    title: 'Back to Sections',
    description: '別の分野に切り替えて学習を続行',
  },
]

const dashboardFeatures = [
  {
    icon: <TimerIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    label: '総プレイ時間',
  },
  {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    label: 'クリア数・履歴',
  },
  {
    icon: <CalendarMonthIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    label: '学習カレンダー',
  },
]

const HomePage = () => {
  const navigate = useNavigate()
  const isSignedIn = useAuthStore((s) => s.isSignedIn)

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, textWrap: 'balance' }}>
          クイズで学ぼう
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 480, mx: 'auto', mb: 4, lineHeight: 1.8 }}
        >
          学びたい分野を選んで、クイズに挑戦しましょう。
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/sections"
          sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
        >
          Go to Sections
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 6 }}>
        {steps.map((step) => (
          <Grid item xs={12} sm={6} key={step.title}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <Box
                sx={{
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {isSignedIn ? (
        <Paper variant="outlined" sx={{ p: 5, mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom fontWeight={700} sx={{ textWrap: 'balance' }}>
            学習の進捗を確認しましょう
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
            {dashboardFeatures.map((feat) => (
              <Grid item xs={12} sm={4} key={feat.label}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  <Box sx={{ mb: 1.5 }}>{feat.icon}</Box>
                  <Typography variant="body2" fontWeight={600}>
                    {feat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
          >
            Go to Dashboard
          </Button>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: 5, mb: 4, textAlign: 'center' }}>
          <LockOutlinedIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={700} sx={{ textWrap: 'balance' }}>
            学習の記録を残しましょう
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 420, mx: 'auto', lineHeight: 1.8 }}
          >
            ログインすると、学習の進捗・プレイ時間・成績の記録をダッシュボードで確認できます。
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} mb={3}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/"
              startIcon={<LoginIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              ログイン
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/signup"
              startIcon={<PersonAddIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              新規登録
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ダッシュボードでは以下が確認できます:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<TimerIcon />} label="総プレイ時間" variant="outlined" />
            <Chip icon={<CheckCircleOutlineIcon />} label="クリア数" variant="outlined" />
            <Chip icon={<CalendarMonthIcon />} label="学習カレンダー" variant="outlined" />
          </Box>
        </Paper>
      )}
    </Container>
  )
}

export default HomePage
