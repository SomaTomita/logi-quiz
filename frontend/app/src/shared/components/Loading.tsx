import { Box, CircularProgress, Typography } from '@mui/material'

const Loading = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <CircularProgress color="primary" />
    <Typography variant="h6" mt={2} color="text.secondary">
      Loading...
    </Typography>
  </Box>
)

export default Loading
