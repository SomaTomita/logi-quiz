import { memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box, Typography, Button, Alert } from '@mui/material'
import ScoreRing from '@/shared/components/ScoreRing'
import LoginPromptModal from '@/shared/components/LoginPromptModal'
import QuestionAccordionList from '@/shared/components/QuestionAccordionList'
import { useAuthStore } from '@/features/auth/store'
import { useGuestStore } from '@/features/auth/guestStore'
import { useQuizSessionStore } from '../store'

interface QuizResultProps {
  onBackToSections: () => void
}

const QuizResult = memo(({ onBackToSections }: QuizResultProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Subscribe only to the fields this component renders
  const questions = useQuizSessionStore((s) => s.questions)
  const correctIndices = useQuizSessionStore((s) => s.correctIndices)
  const userAnswers = useQuizSessionStore((s) => s.userAnswers)
  const saveError = useQuizSessionStore((s) => s.saveError)
  const reset = useQuizSessionStore((s) => s.reset)

  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const incrementCompletionCount = useGuestStore((s) => s.incrementCompletionCount)
  const showLoginPrompt = useGuestStore((s) => s.showLoginPrompt)
  const dismissLoginPrompt = useGuestStore((s) => s.dismissLoginPrompt)

  // Increment guest quiz count on mount (only for non-signed-in users)
  useEffect(() => {
    if (!isSignedIn) {
      incrementCompletionCount()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const percentage = questions.length > 0 ? (correctIndices.length / questions.length) * 100 : 0
  const getMessage = () => {
    if (percentage >= 80) return t('common.resultExcellent')
    if (percentage >= 50) return t('common.resultGood')
    return t('common.resultEncourage')
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      {saveError && (
        <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
          {t('quiz.saveErrorAlert')}
        </Alert>
      )}

      {isSignedIn && !saveError && (
        <Alert severity="success" variant="outlined" sx={{ mb: 3 }}>
          {t('quiz.srsRecordedAlert')}
        </Alert>
      )}

      {/* Score display */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ScoreRing correct={correctIndices.length} total={questions.length} />
        <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
          {getMessage()}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {t('common.scoreText', { total: questions.length, correct: correctIndices.length })}
        </Typography>
      </Box>

      {/* Question review accordion */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t('common.questionReview')}
      </Typography>
      <QuestionAccordionList
        questions={questions}
        correctIndices={correctIndices}
        userAnswers={userAnswers}
      />

      {/* Actions */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, pb: 4 }}>
        <Button variant="contained" size="large" onClick={reset} sx={{ px: 4 }}>
          {t('common.tryAgain')}
        </Button>
        <Button variant="outlined" size="large" onClick={onBackToSections} sx={{ px: 4 }}>
          {t('common.backToSections')}
        </Button>
      </Box>

      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => {
          dismissLoginPrompt()
          navigate('/sections')
        }}
      />
    </Box>
  )
})

QuizResult.displayName = 'QuizResult'

export default QuizResult
