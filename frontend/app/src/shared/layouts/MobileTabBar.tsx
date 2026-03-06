import { useLocation, useNavigate } from 'react-router-dom'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import { useAuthStore } from '@/features/auth/store'

const MobileTabBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isSignedIn = useAuthStore((s) => s.isSignedIn)

  const getActiveTab = () => {
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
          label="セクション"
          value="sections"
          icon={<GridViewRoundedIcon />}
          aria-label="セクション一覧"
        />
        {isSignedIn ? (
          <BottomNavigationAction
            label="進捗"
            value="progress"
            icon={<BarChartRoundedIcon />}
            aria-label="学習進捗"
          />
        ) : (
          <BottomNavigationAction
            label="ログイン"
            value="auth"
            icon={<PersonRoundedIcon />}
            aria-label="ログイン"
          />
        )}
      </BottomNavigation>
    </Paper>
  )
}

export default MobileTabBar
