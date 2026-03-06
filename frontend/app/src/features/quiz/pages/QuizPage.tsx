import { useParams, useNavigate } from 'react-router-dom'
import { Paper, Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useQuizSession } from '../hooks'
import Loading from '@/shared/components/Loading'
import StartQuiz from '../components/StartQuiz'
import QuizBody from '../components/QuizBody'
import QuizResult from '../components/QuizResult'

const QuizPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>()
  const navigate = useNavigate()
  const store = useQuizSession(sectionId!)

  const handleBackToSections = () => navigate('/sections')

  if (store.fetchError) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8 }}>
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <ErrorOutlineIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight={600}>
            クイズを読み込めませんでした
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            通信状況を確認して、もう一度お試しください。
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              再読み込み
            </Button>
            <Button variant="outlined" onClick={handleBackToSections}>
              セクション一覧へ
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  if (!store.questions.length) return <Loading />

  if (!store.isStarted && !store.showResult) {
    return <StartQuiz onStart={store.startQuiz} />
  }

  if (store.showResult) {
    return (
      <QuizResult
        questions={store.questions}
        correctIndices={store.correctIndices}
        userAnswers={store.userAnswers}
        onTryAgain={store.reset}
        onBackToSections={handleBackToSections}
        saveError={store.saveError}
        sectionId={sectionId!}
      />
    )
  }

  return <QuizBody store={store} onExit={handleBackToSections} />
}

export default QuizPage
