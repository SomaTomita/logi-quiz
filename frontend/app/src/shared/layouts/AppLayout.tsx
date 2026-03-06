import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar'
import MobileTabBar from './MobileTabBar'

const AppLayout = () => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <Box
      component="main"
      sx={{
        flex: 1,
        ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
        pb: { xs: 8, md: 0 },
        minHeight: '100vh',
      }}
    >
      <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        <Outlet />
      </Box>
    </Box>
    <MobileTabBar />
  </Box>
)

export default AppLayout
