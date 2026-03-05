import { memo } from 'react'
import { Typography, ButtonBase, ListItem, Box, Button, LinearProgress } from '@mui/material'
import AnswerTimer from './AnswerTimer'
import type { QuizSessionState } from '../store'

interface QuizBodyProps {
  store: QuizSessionState
}

const QuizBody = memo(({ store }: QuizBodyProps) => {
  const question = store.currentQuestion()
  if (!question) return null

  return (
    <Box>
      {store.showTimer ? (
        <AnswerTimer key={store.currentIndex} duration={15} onTimeUp={store.handleTimeUp} />
      ) : null}

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="h5" fontWeight={500}>
          {store.currentIndex + 1}/{store.questions.length}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={((store.currentIndex + 1) / store.questions.length) * 100}
          sx={{ flex: 1, height: 6, borderRadius: 3 }}
        />
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {question.question_text}
      </Typography>

      <Box component="ul" role="listbox" sx={{ pl: 0, mt: 2, listStyle: 'none' }}>
        {question.choices.map((choice, index) => (
          <ButtonBase
            key={choice.choice_text}
            onClick={() => store.selectAnswer(index, choice)}
            sx={{ width: '100%', borderRadius: 1, mb: 1 }}
            role="option"
            aria-selected={store.answerIndex === index}
          >
            <ListItem
              sx={{
                width: '100%',
                textAlign: 'left',
                borderLeft:
                  store.answerIndex === index ? '4px solid #0d9488' : '4px solid transparent',
                background: store.answerIndex === index ? '#f0fdf4' : '#ffffff',
                color: '#1e293b',
                fontSize: '18px',
                p: '12px 24px',
                border: '1px solid #e2e8f0',
                borderRadius: 1,
                transition: 'all 0.15s ease',
                '&:hover': {
                  background: '#f0fdf4',
                  borderLeftColor: '#0d9488',
                },
              }}
            >
              {choice.choice_text}
            </ListItem>
          </ButtonBase>
        ))}
      </Box>

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          onClick={store.nextQuestion}
          disabled={store.answerIndex === null}
        >
          {store.isLastQuestion() ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  )
})

QuizBody.displayName = 'QuizBody'

export default QuizBody
