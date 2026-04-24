import { useLocation, useNavigate } from 'react-router-dom'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import { useAuthStore } from '@/features/auth/store'
import { useTranslation } from 'react-i18next'

const MobileTabBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const { t } = useTranslation()

  const getActiveTab = () => {
    if (location.pathname.startsWith('/review')) return 'review'
    if (location.pathname.startsWith('/progress')) return 'progress'
    if (location.pathname.startsWith('/signin') || location.pathname.startsWith('/signup'))
      return 'auth'
    return 'sections'
  }

  return (
    <Paper
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 0,
      }}
      elevation={0}
    >
      <BottomNavigation
        value={getActiveTab()}
        onChange={(_, newValue) => navigate(newValue === 'auth' ? '/signin' : `/${newValue}`)}
        sx={{
          '& .Mui-selected': { color: 'primary.main' },
          '& .MuiBottomNavigationAction-root': { minWidth: 0 },
        }}
      >
        <BottomNavigationAction
          label={t('nav.sections')}
          value="sections"
          icon={<GridViewRoundedIcon />}
          aria-label={t('nav.sectionsAriaLabel')}
        />
        {isSignedIn ? (
          <>
            <BottomNavigationAction
              label={t('nav.review')}
              value="review"
              icon={<ReplayRoundedIcon />}
              aria-label={t('nav.reviewAriaLabel')}
            />
            <BottomNavigationAction
              label={t('nav.progress')}
              value="progress"
              icon={<BarChartRoundedIcon />}
              aria-label={t('nav.progressAriaLabel')}
            />
          </>
        ) : (
          <BottomNavigationAction
            label={t('nav.login')}
            value="auth"
            icon={<PersonRoundedIcon />}
            aria-label={t('nav.loginAriaLabel')}
          />
        )}
      </BottomNavigation>
    </Paper>
  )
}

export default MobileTabBar
