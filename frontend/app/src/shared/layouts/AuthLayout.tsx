import { Box, Typography } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import { useTranslation } from 'react-i18next'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel - branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '55%',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          color: '#fff',
        }}
      >
        <SchoolIcon sx={{ fontSize: 64, mb: 3, opacity: 0.9 }} />
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, textAlign: 'center', color: '#fff' }}>
          logi-quiz
        </Typography>
        <Typography
          variant="h5"
          sx={{ opacity: 0.85, textAlign: 'center', maxWidth: 400, fontWeight: 400, lineHeight: 1.6 }}
        >
          {t('auth.brandTagline1')}
          <br />
          {t('auth.brandTagline2')}
        </Typography>
      </Box>

      {/* Right panel - form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, sm: 6 },
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>{children}</Box>
      </Box>
    </Box>
  )
}

export default AuthLayout
