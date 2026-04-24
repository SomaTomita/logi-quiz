import { Box, Button, Typography, AppBar, Toolbar, Container } from '@mui/material'
import { Link, Outlet } from 'react-router-dom'
import SchoolIcon from '@mui/icons-material/School'
import { useAuthStore } from '@/features/auth/store'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/shared/components/LanguageSwitcher'

const LandingLayout = () => {
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const isLoading = useAuthStore((s) => s.isLoading)
  const { t } = useTranslation()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'transparent',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(248, 250, 252, 0.8)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'text.primary',
              }}
            >
              <SchoolIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                logi-quiz
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageSwitcher />
              {!isLoading && !isSignedIn && (
                <>
                  <Button component={Link} to="/signin" variant="outlined" size="small">
                    {t('common.signIn')}
                  </Button>
                  <Button component={Link} to="/signup" variant="contained" size="small">
                    {t('common.signUp')}
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Content */}
      <Outlet />
    </Box>
  )
}

export default LandingLayout
