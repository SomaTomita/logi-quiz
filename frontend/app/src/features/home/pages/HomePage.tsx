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

const HomePage = () => {
  const navigate = useNavigate()
  const isSignedIn = useAuthStore((s) => s.isSignedIn)

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 4, mb: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
          学びたい分野を選んで、クイズに挑戦しましょう。
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mb={4}>
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

      <Grid container spacing={2} sx={{ mb: 5 }}>
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
                  bgcolor: 'primary.light',
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  flexShrink: 0,
                  opacity: 0.85,
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
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" paragraph sx={{ fontWeight: 'bold' }}>
            次に学習状況を確認しましょう。
          </Typography>
          <Box display="flex" justifyContent="center" mt={1.5}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ p: 2, mt: 2, fontSize: '1.1rem' }}
            >
              Go to Dashboard
            </Button>
          </Box>
          <Typography variant="h6" paragraph sx={{ mt: 3.5 }}>
            ＜ダッシュボード＞
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>総プレイ時間、総問題クリア数、過去10回の履歴、学習記録が見られます。</li>
              <li>学習記録では問題をクリアするだけ色が濃くなりカレンダー上に記録されます。</li>
            </ul>
          </Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            p: 5,
            mb: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
            border: '1px solid',
            borderColor: 'primary.light',
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ textWrap: 'balance' }}>
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
