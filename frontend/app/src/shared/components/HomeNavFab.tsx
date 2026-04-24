import { Fab } from '@mui/material'
import NavigationIcon from '@mui/icons-material/Navigation'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const HomeNavFab = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label={t('common.homeAriaLabel')}
      sx={{ position: 'fixed', bottom: 24, right: 24 }}
      onClick={() => navigate('/home')}
    >
      <NavigationIcon sx={{ mr: 1 }} />
      Home
    </Fab>
  )
}

export default HomeNavFab
