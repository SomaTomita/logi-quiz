import { Fab } from '@mui/material'
import NavigationIcon from '@mui/icons-material/Navigation'
import { useNavigate } from 'react-router-dom'

const HomeNavFab = () => {
  const navigate = useNavigate()

  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="ホームに戻る"
      sx={{ position: 'fixed', bottom: 24, right: 24 }}
      onClick={() => navigate('/home')}
    >
      <NavigationIcon sx={{ mr: 1 }} />
      Home
    </Fab>
  )
}

export default HomeNavFab
