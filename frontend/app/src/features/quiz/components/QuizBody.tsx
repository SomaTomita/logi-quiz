import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography, Button } from '@mui/material'
import CircularCountdown from './CircularCountdown'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import SessionTopBar from '@/shared/components/SessionTopBar'
import ChoiceList from '@/shared/components/ChoiceList'
import { useQuizSessionStore } from '../store'

interface QuizBodyProps {
  onExit: () => void
}

const QuizBody = memo(({ onExit }: QuizBodyProps) => {
  const { t } = useTranslation()
  const [confirmExit, setConfirmExit] = useState(false)

  // Subscribe only to fields this component renders
  const currentIndex = useQuizSessionStore((s) => s.currentIndex)
  const totalCount = useQuizSessionStore((s) => s.questions.length)
  const question = useQuizSessionStore((s) => s.currentQuestion())
  const answerIndex = useQuizSessionStore((s) => s.answerIndex)
  const isLastQuestion = useQuizSessionStore((s) => s.isLastQuestion())
  const showTimer = useQuizSessionStore((s) => s.showTimer)

  // Actions (stable references)
  const selectAnswer = useQuizSessionStore((s) => s.selectAnswer)
  const nextQuestion = useQuizSessionStore((s) => s.nextQuestion)
  const handleTimeUp = useQuizSessionStore((s) => s.handleTimeUp)

  if (!question) return null

  return (
    <>
      {/* Immersive quiz layout - hides sidebar via fixed overlay */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1300,
          bgcolor: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <SessionTopBar
          currentIndex={currentIndex}
          totalCount={totalCount}
          onExit={() => setConfirmExit(true)}
          rightSlot={
            showTimer ? (
              <CircularCountdown
                key={currentIndex}
                duration={15}
                onTimeUp={handleTimeUp}
              />
            ) : (
              <Box sx={{ width: 52, height: 52 }} />
            )
          }
        />

        {/* Question content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: 640,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, sm: 4 },
            py: 4,
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', lineHeight: 1.6 }}>
            {question.questionText}
          </Typography>

          <ChoiceList
            choices={question.choices}
            selectedIndex={answerIndex}
            onSelect={(index) => selectAnswer(index, question.choices[index])}
          />

          {/* Next button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              onClick={nextQuestion}
              disabled={answerIndex === null}
              sx={{ px: 5 }}
            >
              {isLastQuestion ? t('common.finish') : t('common.next')}
            </Button>
          </Box>
        </Box>
      </Box>

      <ConfirmDialog
        open={confirmExit}
        title={t('quiz.exitConfirmTitle')}
        message={t('quiz.exitConfirmMessage')}
        onCancel={() => setConfirmExit(false)}
        onConfirm={() => {
          setConfirmExit(false)
          onExit()
        }}
      />
    </>
  )
})

QuizBody.displayName = 'QuizBody'

export default QuizBody
