import { useNavigate, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { styled } from '@mui/system'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import { useAuthStore } from '@/features/auth/store'
import { signOut } from '@/features/auth/api'

const AppBarContent = styled('div')(({ theme }) => ({
  maxWidth: 1200,
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
}))

const Header = () => {
  const navigate = useNavigate()
  const isLoading = useAuthStore((s) => s.isLoading)
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const isAdmin = useAuthStore((s) => s.isAdmin)
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

  const preloadSections = () => import('@/features/section/pages/SectionListPage')
  const preloadDashboard = () => import('@/features/dashboard/pages/DashboardPage')

  const renderButtons = () => {
    if (isLoading) return null

    if (isAdmin) {
      return (
        <>
          <Button component={Link} to="/create-quiz" color="inherit">
            Create Quiz
          </Button>
          <Button component={Link} to="/create-section" color="inherit">
            Create Section
          </Button>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </>
      )
    }

    if (isSignedIn) {
      return (
        <>
          <Button
            component={Link}
            to="/sections"
            color="inherit"
            onMouseEnter={preloadSections}
            onFocus={preloadSections}
          >
            Sections
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            color="inherit"
            onMouseEnter={preloadDashboard}
            onFocus={preloadDashboard}
          >
            Dashboard
          </Button>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </>
      )
    }

    return (
      <>
        <Button component={Link} to="/" color="inherit">
          Sign in
        </Button>
        <Button component={Link} to="/signup" color="inherit">
          Sign Up
        </Button>
      </>
    )
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}
    >
      <AppBarContent>
        <Toolbar>
          <DirectionsBoatIcon sx={{ mr: 1.5 }} />
          <Typography
            component={Link}
            to="/home"
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            logi-quiz
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>{renderButtons()}</Box>
        </Toolbar>
      </AppBarContent>
    </AppBar>
  )
}

export default Header
