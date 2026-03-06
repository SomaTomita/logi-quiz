import { Link } from 'react-router-dom'
import { Box, Typography, Button, Chip, Stack } from '@mui/material'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'

interface StartQuizProps {
  onStart: () => void
}

const StartQuiz = ({ onStart }: StartQuizProps) => (
  <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, maxWidth: 400, mx: 'auto' }}>
    <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
      クイズに挑戦
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
      制限時間内に正解を選んでください。全問終了後に結果と解説を確認できます。
    </Typography>
    <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 5 }}>
      <Chip icon={<QuizRoundedIcon />} label="10問" variant="outlined" />
      <Chip icon={<TimerRoundedIcon />} label="各15秒" variant="outlined" />
    </Stack>
    <Button
      variant="contained"
      size="large"
      onClick={onStart}
      sx={{ px: 6, py: 1.5, fontSize: '1.05rem' }}
    >
      スタート
    </Button>
    <Box sx={{ mt: 3 }}>
      <Typography
        component={Link}
        to="/sections"
        variant="body2"
        sx={{
          color: 'text.secondary',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        セクション一覧に戻る
      </Typography>
    </Box>
  </Box>
)

export default StartQuiz
