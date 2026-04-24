import { Box, CircularProgress, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Loading = () => {
  const { t } = useTranslation()

  return (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
    gap={2}
  >
    <CircularProgress color="primary" size={36} />
    <Typography variant="body2" color="text.secondary">
      {t('common.loading')}
    </Typography>
  </Box>
  )
}

export default Loading
