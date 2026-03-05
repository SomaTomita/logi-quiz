import { useParams, useNavigate } from 'react-router-dom'
import { Card, Box } from '@mui/material'
import { useQuizSession } from '../hooks'
import Loading from '@/shared/components/Loading'
import StartQuiz from '../components/StartQuiz'
import QuizBody from '../components/QuizBody'
import QuizResult from '../components/QuizResult'

const QuizPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>()
  const navigate = useNavigate()
  const store = useQuizSession(sectionId!)

  if (!store.questions.length) return <Loading />

  const handleBackToSections = () => navigate('/sections')

  return (
    <Box display="flex" justifyContent="center">
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          borderRadius: 4,
          mt: 4,
          p: '30px 40px',
          mb: 5,
          position: 'relative',
        }}
      >
        {!store.isStarted && !store.showResult ? (
          <StartQuiz onStart={store.startQuiz} />
        ) : store.showResult ? (
          <QuizResult
            questions={store.questions}
            correctIndices={store.correctIndices}
            onTryAgain={store.reset}
            onBackToSections={handleBackToSections}
          />
        ) : (
          <QuizBody store={store} />
        )}
      </Card>
    </Box>
  )
}

export default QuizPage
