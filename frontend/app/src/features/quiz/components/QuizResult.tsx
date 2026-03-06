import { memo } from 'react'
import { Box, Typography, Paper, Button, Chip, Alert } from '@mui/material'
import type { Quiz } from '../types'

interface QuizResultProps {
  questions: Quiz[]
  correctIndices: number[]
  userAnswers: string[]
  onTryAgain: () => void
  onBackToSections: () => void
  saveError?: string | null
  onRetrySave?: () => void
}

const QuizResult = memo(
  ({ questions, correctIndices, userAnswers, onTryAgain, onBackToSections, saveError, onRetrySave }: QuizResultProps) => (
    <Box>
      {saveError ? (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            onRetrySave ? (
              <Button color="inherit" size="small" onClick={onRetrySave}>
                再試行
              </Button>
            ) : undefined
          }
        >
          {saveError}
        </Alert>
      ) : null}

      <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
        正答数:{' '}
        <Typography component="span" color="primary" fontSize="32px" fontWeight={700}>
          {correctIndices.length}/{questions.length}
        </Typography>
      </Typography>

      {questions.map((item, index) => {
        const correctAnswer = item.choices.find((c) => c.isCorrect)?.choiceText ?? ''
        const isCorrect = correctIndices.includes(index)

        return (
          <Paper
            key={index}
            elevation={2}
            sx={{ p: 3, mb: 2, borderLeft: `4px solid ${isCorrect ? '#22c55e' : '#ef4444'}` }}
          >
            <Typography gutterBottom fontWeight={500}>
              問題: {item.questionText}
            </Typography>
            <Typography gutterBottom>正解: {correctAnswer}</Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography>あなたの回答: {userAnswers[index] ?? '未回答'}</Typography>
              <Chip
                label={isCorrect ? '正解' : '不正解'}
                size="small"
                color={isCorrect ? 'success' : 'error'}
              />
            </Box>
            <Typography color="text.secondary">
              解説: {item.explanation.explanationText}
            </Typography>
          </Paper>
        )
      })}

      <Box mt={3} textAlign="center">
        <Button variant="contained" size="large" onClick={onTryAgain} sx={{ mr: 1 }}>
          Try again
        </Button>
        <Button variant="outlined" size="large" onClick={onBackToSections}>
          Back to Sections
        </Button>
      </Box>
    </Box>
  ),
)

QuizResult.displayName = 'QuizResult'

export default QuizResult
