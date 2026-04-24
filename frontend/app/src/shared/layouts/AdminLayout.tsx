import { useLocation, Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SchoolIcon from '@mui/icons-material/School'
import LanguageSwitcher from '@/shared/components/LanguageSwitcher'

const SIDEBAR_WIDTH = 240

const AdminLayout = () => {
  const location = useLocation()
  const { t } = useTranslation()

  const adminNavItems: { label: string; Icon: SvgIconComponent; path: string }[] = [
    { label: t('admin.sectionManagement'), Icon: GridViewRoundedIcon, path: '/admin/sections' },
    { label: t('admin.quizManagement'), Icon: QuizRoundedIcon, path: '/admin/quizzes' },
    { label: t('admin.learningAnalytics'), Icon: InsightsRoundedIcon, path: '/admin/analytics' },
  ]

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          minWidth: SIDEBAR_WIDTH,
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          zIndex: 1200,
        }}
      >
        {/* Logo + Admin badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2.5 }}>
          <SchoolIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            logi-quiz
          </Typography>
          <Chip
            label="Admin"
            size="small"
            color="secondary"
            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
          />
        </Box>

        <Divider />

        {/* Navigation */}
        <List sx={{ flex: 1, px: 1.5, py: 2 }}>
          {adminNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
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
                  <item.Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            )
          })}
        </List>

        {/* Language switcher */}
        <Box sx={{ px: 2, pb: 1 }}>
          <LanguageSwitcher />
        </Box>

        {/* Back to app */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <ListItemButton component={Link} to="/sections" sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <ArrowBackRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={t('admin.backToApp')}
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
            />
          </ListItemButton>
        </Box>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          minHeight: '100vh',
        }}
      >
        <Box sx={{ maxWidth: 960, mx: 'auto', px: 4, py: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
