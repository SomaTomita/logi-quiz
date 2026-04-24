import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Paper, Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useQuizSession } from '../hooks'
import { useQuizSessionStore } from '../store'
import Loading from '@/shared/components/Loading'
import StartQuiz from '../components/StartQuiz'
import QuizBody from '../components/QuizBody'
import QuizResult from '../components/QuizResult'

const QuizPage = () => {
  const { t } = useTranslation()
  const { sectionId } = useParams<{ sectionId: string }>()
  const navigate = useNavigate()

  // Run lifecycle effects (fetch, timer, save)
  useQuizSession(sectionId!)

  // Subscribe only to the fields this component branches on
  const fetchError = useQuizSessionStore((s) => s.fetchError)
  const hasQuestions = useQuizSessionStore((s) => s.questions.length > 0)
  const isStarted = useQuizSessionStore((s) => s.isStarted)
  const showResult = useQuizSessionStore((s) => s.showResult)

  const handleBackToSections = () => navigate('/sections')

  if (fetchError) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8 }}>
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <ErrorOutlineIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight={600}>
            {t('quiz.loadError')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('common.networkError')}
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              {t('common.reload')}
            </Button>
            <Button variant="outlined" onClick={handleBackToSections}>
              {t('common.backToSections')}
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  if (!hasQuestions) return <Loading />

  if (!isStarted && !showResult) {
    return <StartQuiz />
  }

  if (showResult) {
    return <QuizResult onBackToSections={handleBackToSections} />
  }

  return <QuizBody onExit={handleBackToSections} />
}

export default QuizPage
