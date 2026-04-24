import { Link } from 'react-router-dom'
import { Box, Typography, Button, Container, Grid, Paper, Chip, Stack } from '@mui/material'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import { useTranslation } from 'react-i18next'
import HeroIllustration from '../components/HeroIllustration'

const featureIcons = [
  <QuizRoundedIcon sx={{ fontSize: 32 }} />,
  <TimerRoundedIcon sx={{ fontSize: 32 }} />,
  <MenuBookRoundedIcon sx={{ fontSize: 32 }} />,
  <TrendingUpRoundedIcon sx={{ fontSize: 32 }} />,
  <BoltRoundedIcon sx={{ fontSize: 32 }} />,
  <DevicesRoundedIcon sx={{ fontSize: 32 }} />,
]

const LandingPage = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: featureIcons[0],
      title: t('landing.feature1Title'),
      description: t('landing.feature1Description'),
    },
    {
      icon: featureIcons[1],
      title: t('landing.feature2Title'),
      description: t('landing.feature2Description'),
    },
    {
      icon: featureIcons[2],
      title: t('landing.feature3Title'),
      description: t('landing.feature3Description'),
    },
    {
      icon: featureIcons[3],
      title: t('landing.feature4Title'),
      description: t('landing.feature4Description'),
    },
    {
      icon: featureIcons[4],
      title: t('landing.feature5Title'),
      description: t('landing.feature5Description'),
    },
    {
      icon: featureIcons[5],
      title: t('landing.feature6Title'),
      description: t('landing.feature6Description'),
    },
  ]

  const steps = [
    { number: '1', title: t('landing.step1Title'), description: t('landing.step1Description') },
    { number: '2', title: t('landing.step2Title'), description: t('landing.step2Description') },
    { number: '3', title: t('landing.step3Title'), description: t('landing.step3Description') },
    { number: '4', title: t('landing.step4Title'), description: t('landing.step4Description') },
  ]

  const benefits = [
    t('landing.benefit1'),
    t('landing.benefit2'),
    t('landing.benefit3'),
    t('landing.benefit4'),
    t('landing.benefit5'),
    t('landing.benefit6'),
  ]

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, rgba(79, 70, 229, 0.03) 0%, transparent 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label={t('landing.heroChip')}
                variant="outlined"
                color="primary"
                sx={{ mb: 3, fontWeight: 600 }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.25rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  mb: 2.5,
                  lineHeight: 1.2,
                }}
              >
                {t('landing.heroTitle1')}
                <br />
                <Box component="span" sx={{ color: 'primary.main' }}>
                  {t('landing.heroTitle2')}
                </Box>
                {t('landing.heroTitle3')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  maxWidth: 460,
                }}
              >
                {t('landing.heroDescription')}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/sections"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ px: 5, py: 1.5, fontSize: '1.05rem' }}
                >
                  {t('landing.ctaStart')}
                </Button>
                <Button
                  component={Link}
                  to="/signin"
                  variant="outlined"
                  size="large"
                  sx={{ px: 4, py: 1.5 }}
                >
                  {t('landing.ctaLogin')}
                </Button>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {t('landing.heroSubtext')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <HeroIllustration />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 2 }}>
            {t('landing.howItWorksTitle')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 7, maxWidth: 480, mx: 'auto' }}
          >
            {t('landing.howItWorksSubtitle')}
          </Typography>
          <Grid container spacing={3}>
            {steps.map((step) => (
              <Grid item xs={6} md={3} key={step.number}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      color: '#fff',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {step.number}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features grid */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 2 }}>
            {t('landing.featuresTitle')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 7, maxWidth: 480, mx: 'auto' }}
          >
            {t('landing.featuresSubtitle')}
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Paper
                  sx={{
                    p: 3.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(79, 70, 229, 0.08)',
                      color: 'primary.main',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 0.75 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Social proof / benefits */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                {t('landing.benefitsTitle1')}
                <br />
                {t('landing.benefitsTitle2')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                {t('landing.benefitsDescription')}
              </Typography>
              <Stack spacing={1.5}>
                {benefits.map((benefit) => (
                  <Box key={benefit} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleRoundedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body1">{benefit}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      bgcolor: 'rgba(79, 70, 229, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CalendarMonthRoundedIcon sx={{ color: 'primary.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '0.95rem' }}>
                      {t('landing.calendarCardTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('landing.calendarCardDescription')}
                    </Typography>
                  </Box>
                </Paper>
                <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      bgcolor: 'rgba(245, 158, 11, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <EmojiEventsRoundedIcon sx={{ color: 'secondary.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '0.95rem' }}>
                      {t('landing.scoreCardTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('landing.scoreCardDescription')}
                    </Typography>
                  </Box>
                </Paper>
                <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <TrendingUpRoundedIcon sx={{ color: 'success.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '0.95rem' }}>
                      {t('landing.streakCardTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('landing.streakCardDescription')}
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          textAlign: 'center',
          background: 'linear-gradient(180deg, transparent 0%, rgba(79, 70, 229, 0.04) 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h2" sx={{ mb: 2 }}>
            {t('landing.finalCtaTitle')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 5, lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-line' }}
          >
            {t('landing.finalCtaDescription')}
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              component={Link}
              to="/sections"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ px: 5, py: 1.5, fontSize: '1.05rem', minWidth: 200 }}
            >
              {t('landing.ctaStart')}
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5, minWidth: 160 }}
            >
              {t('landing.ctaCreateAccount')}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="body2" color="text.secondary">
          {t('landing.footerText')}
        </Typography>
      </Box>
    </>
  )
}

export default LandingPage
