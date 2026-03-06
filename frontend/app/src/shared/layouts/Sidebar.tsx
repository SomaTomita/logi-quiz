import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import SchoolIcon from '@mui/icons-material/School'
import { useAuthStore } from '@/features/auth/store'
import { signOut } from '@/features/auth/api'

const SIDEBAR_WIDTH = 240

const navItems = [
  { label: 'セクション', icon: <GridViewRoundedIcon />, path: '/sections' },
  { label: '進捗', icon: <BarChartRoundedIcon />, path: '/progress', authRequired: true },
]

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const isLoading = useAuthStore((s) => s.isLoading)
  const user = useAuthStore((s) => s.user)
  const clearUser = useAuthStore((s) => s.clearUser)

  const handleSignOut = async () => {
    try {
      const res = await signOut()
      if (res.data.success === true) {
        clearUser()
        navigate('/')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredNav = navItems.filter((item) => !item.authRequired || isSignedIn)

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid rgba(0,0,0,0.08)',
        zIndex: 1200,
      }}
    >
      {/* Logo */}
      <Box
        component={Link}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2.5,
          textDecoration: 'none',
          color: 'text.primary',
        }}
      >
        <SchoolIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          logi-quiz
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {filteredNav.map((item) => {
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={isActive}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: '#fff' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#fff' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
              />
            </ListItemButton>
          )
        })}
      </List>

      {/* User section */}
      {!isLoading && (
        <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {isSignedIn && user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name}
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleSignOut} aria-label="サインアウト">
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <ListItemButton
              component={Link}
              to="/signin"
              sx={{ borderRadius: 2, justifyContent: 'center' }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LoginRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary="ログイン"
                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
              />
            </ListItemButton>
          )}
        </Box>
      )}
    </Box>
  )
}

export { SIDEBAR_WIDTH }
export default Sidebar
