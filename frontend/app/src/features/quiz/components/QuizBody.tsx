import { useState, memo } from 'react'
import { Typography, Box, Button, Paper } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CircularCountdown from './CircularCountdown'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import type { QuizSessionState } from '../store'

interface QuizBodyProps {
  store: QuizSessionState
  onExit: () => void
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D']

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
        {/* Top bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3 },
            py: 2,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            bgcolor: 'background.paper',
          }}
        >
          <Button
            startIcon={<CloseRoundedIcon />}
            onClick={() => setConfirmExit(true)}
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            退出
          </Button>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {store.currentIndex + 1} / {store.questions.length}
          </Typography>
          {store.showTimer ? (
            <CircularCountdown
              key={store.currentIndex}
              duration={15}
              onTimeUp={store.handleTimeUp}
            />
          ) : (
            <Box sx={{ width: 52, height: 52 }} />
          )}
        </Box>

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

          {/* Choice buttons */}
          <Box
            component="div"
            role="radiogroup"
            sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
          >
            {question.choices.map((choice, index) => {
              const isSelected = store.answerIndex === index
              return (
                <Paper
                  key={choice.choiceText}
                  component="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => store.selectAnswer(index, choice)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    px: 3,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    bgcolor: isSelected ? 'primary.main' : 'background.paper',
                    color: isSelected ? '#fff' : 'text.primary',
                    borderColor: isSelected ? 'primary.main' : 'rgba(0,0,0,0.08)',
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.main' : 'rgba(79, 70, 229, 0.04)',
                      borderColor: 'primary.main',
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                    },
                    transition:
                      'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(79, 70, 229, 0.08)',
                      color: isSelected ? '#fff' : 'primary.main',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    {CHOICE_LABELS[index]}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {choice.choiceText}
                  </Typography>
                </Paper>
              )
            })}
          </Box>

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
