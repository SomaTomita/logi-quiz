import { Box, CircularProgress, Typography } from '@mui/material'

const Loading = () => (
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
      読み込み中...
    </Typography>
  </Box>
)

export default Loading
