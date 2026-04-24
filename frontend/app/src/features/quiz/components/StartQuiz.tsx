import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box, Typography, Button, Chip, Stack } from '@mui/material'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import { useQuizSessionStore } from '../store'

const StartQuiz = () => {
  const { t } = useTranslation()
  const startQuiz = useQuizSessionStore((s) => s.startQuiz)

  return (
    <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
        {t('quiz.startTitle')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
        {t('quiz.startDescription')}
      </Typography>
      <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 5 }}>
        <Chip icon={<QuizRoundedIcon />} label={t('quiz.questionCount')} variant="outlined" />
        <Chip icon={<TimerRoundedIcon />} label={t('quiz.timePerQuestion')} variant="outlined" />
      </Stack>
      <Button
        variant="contained"
        size="large"
        onClick={startQuiz}
        sx={{ px: 6, py: 1.5, fontSize: '1.05rem' }}
      >
        {t('common.start')}
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
          {t('common.backToSectionsList')}
        </Typography>
      </Box>
    </Box>
  )
}

export default StartQuiz
