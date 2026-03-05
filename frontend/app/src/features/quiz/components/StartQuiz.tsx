import { Box, Typography, Button } from '@mui/material'
import HomeNavFab from '@/shared/components/HomeNavFab'

interface StartQuizProps {
  onStart: () => void
}

const StartQuiz = ({ onStart }: StartQuizProps) => (
  <Box textAlign="center" py={4}>
    <Typography variant="h5" gutterBottom>
      Are you ready?
    </Typography>
    <Button
      variant="contained"
      size="large"
      onClick={onStart}
      sx={{
        mt: 4,
        px: 5,
        py: 1.5,
        fontSize: '1.1rem',
        background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #0f766e 0%, #047857 100%)',
        },
      }}
    >
      Start
    </Button>
    <HomeNavFab />
  </Box>
)

export default StartQuiz
