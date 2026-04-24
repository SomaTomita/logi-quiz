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
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/features/auth/store'

const stepIcons = [
  <QuizIcon />,
  <TimerOutlinedIcon />,
  <ArrowForwardIcon />,
  <EmojiEventsOutlinedIcon />,
  <ReplayIcon />,
  <ListAltIcon />,
]

const DASHBOARD_ICONS = {
  timer: <TimerIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
  clear: <CheckCircleOutlineIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
  calendar: <CalendarMonthIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
} as const

const HomePage = () => {
  const navigate = useNavigate()
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const { t } = useTranslation()

  const steps = [
    {
      icon: stepIcons[0],
      title: t('home.step1Title'),
      description: t('home.step1Description'),
    },
    {
      icon: stepIcons[1],
      title: t('home.step2Title'),
      description: t('home.step2Description'),
    },
    {
      icon: stepIcons[2],
      title: t('home.step3Title'),
      description: t('home.step3Description'),
    },
    {
      icon: stepIcons[3],
      title: t('home.step4Title'),
      description: t('home.step4Description'),
    },
    {
      icon: stepIcons[4],
      title: t('home.step5Title'),
      description: t('home.step5Description'),
    },
    {
      icon: stepIcons[5],
      title: t('home.step6Title'),
      description: t('home.step6Description'),
    },
  ]

  const dashboardFeatures = [
    {
      icon: DASHBOARD_ICONS.timer,
      label: t('home.totalPlayTime'),
    },
    {
      icon: DASHBOARD_ICONS.clear,
      label: t('home.clearCount'),
    },
    {
      icon: DASHBOARD_ICONS.calendar,
      label: t('home.learningCalendar'),
    },
  ]

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, textWrap: 'balance' }}>
          {t('home.title')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 480, mx: 'auto', mb: 4, lineHeight: 1.8 }}
        >
          {t('home.subtitle')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/sections"
          sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
        >
          {t('home.goToSections')}
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
            {t('home.checkProgressTitle')}
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
            {t('home.goToDashboard')}
          </Button>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: 5, mb: 4, textAlign: 'center' }}>
          <LockOutlinedIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={700} sx={{ textWrap: 'balance' }}>
            {t('home.saveRecordTitle')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 420, mx: 'auto', lineHeight: 1.8 }}
          >
            {t('home.saveRecordDescription')}
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
              {t('common.signIn')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/signup"
              startIcon={<PersonAddIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              {t('common.signUp')}
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('home.dashboardPreviewText')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<TimerIcon />} label={t('home.totalPlayTime')} variant="outlined" />
            <Chip
              icon={<CheckCircleOutlineIcon />}
              label={t('home.clearCountShort')}
              variant="outlined"
            />
            <Chip
              icon={<CalendarMonthIcon />}
              label={t('home.learningCalendar')}
              variant="outlined"
            />
          </Box>
        </Paper>
      )}
    </Container>
  )
}

export default HomePage
