import { useState, memo } from 'react'
import { Box, Typography, Button } from '@mui/material'
import CircularCountdown from './CircularCountdown'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import SessionTopBar from '@/shared/components/SessionTopBar'
import ChoiceList from '@/shared/components/ChoiceList'
import type { QuizSessionState } from '../store'

interface QuizBodyProps {
  store: QuizSessionState
  onExit: () => void
}

const QuizBody = memo(({ store, onExit }: QuizBodyProps) => {
  const [confirmExit, setConfirmExit] = useState(false)
  const question = store.currentQuestion()
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
          currentIndex={store.currentIndex}
          totalCount={store.questions.length}
          onExit={() => setConfirmExit(true)}
          rightSlot={
            store.showTimer ? (
              <CircularCountdown
                key={store.currentIndex}
                duration={15}
                onTimeUp={store.handleTimeUp}
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
            selectedIndex={store.answerIndex}
            onSelect={(index) => store.selectAnswer(index, question.choices[index])}
          />

          {/* Next button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              onClick={store.nextQuestion}
              disabled={store.answerIndex === null}
              sx={{ px: 5 }}
            >
              {store.isLastQuestion() ? '完了' : '次へ'}
            </Button>
          </Box>
        </Box>
      </Box>

      <ConfirmDialog
        open={confirmExit}
        title="クイズを退出しますか？"
        message="進行中のクイズの結果は保存されません。"
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
