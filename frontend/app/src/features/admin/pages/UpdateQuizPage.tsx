import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TextField, Button, FormControlLabel, Checkbox, Box, Snackbar, Alert } from '@mui/material'
import { fetchAdminQuiz, updateQuiz } from '../api'
import Loading from '@/shared/components/Loading'
import type { Quiz } from '@/features/quiz/types'

const UpdateQuizPage = () => {
  const { t } = useTranslation()
  const { sectionId, quizId } = useParams<{ sectionId: string; quizId: string }>()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })
  const navigate = useNavigate()

  useEffect(() => {
    if (!sectionId || !quizId) return
    fetchAdminQuiz(sectionId, quizId)
      .then((res) => setQuiz(res.data))
      .catch((err) => console.error('Error fetching quiz:', err))
  }, [sectionId, quizId])

  if (!quiz) return <Loading />

  const saveChanges = async () => {
    try {
      await updateQuiz(sectionId!, quizId!, {
        ...quiz,
        choicesAttributes: quiz.choices,
        explanationAttributes: quiz.explanation,
      })
      setSnackbar({ open: true, message: t('admin.saveSuccess'), severity: 'success' })
      setTimeout(() => navigate('/admin/quizzes'), 1500)
    } catch {
      setSnackbar({ open: true, message: t('admin.saveError'), severity: 'error' })
    }
  }

  return (
    <Box maxWidth={600}>
      <TextField
        label={t('admin.updateQuizQuestionLabel')}
        variant="outlined"
        fullWidth
        value={quiz.questionText}
        onChange={(e) => setQuiz({ ...quiz, questionText: e.target.value })}
        sx={{ mt: 2 }}
      />
      {(quiz.choices || []).map((choice, index) => (
        <Box key={index} display="flex" alignItems="center" sx={{ mt: 2 }}>
          <TextField
            label={t('admin.updateQuizChoiceLabel', { number: index + 1 })}
            variant="outlined"
            value={choice.choiceText}
            onChange={(e) => {
              const updated = [...quiz.choices]
              updated[index] = { ...updated[index], choiceText: e.target.value }
              setQuiz({ ...quiz, choices: updated })
            }}
            sx={{ flex: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={choice.isCorrect}
                onChange={() => {
                  const updated = [...quiz.choices]
                  updated[index] = { ...updated[index], isCorrect: !choice.isCorrect }
                  setQuiz({ ...quiz, choices: updated })
                }}
              />
            }
            label={t('admin.updateQuizIsCorrectLabel')}
            sx={{ ml: 2 }}
          />
        </Box>
      ))}
      <TextField
        label={t('admin.updateQuizExplanationLabel')}
        variant="outlined"
        fullWidth
        multiline
        value={quiz.explanation?.explanationText ?? ''}
        onChange={(e) =>
          setQuiz({
            ...quiz,
            explanation: { ...quiz.explanation, explanationText: e.target.value },
          })
        }
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={saveChanges} sx={{ mt: 2, mb: 2 }}>
        {t('admin.saveChanges')}
      </Button>
      <Button
        variant="outlined"
        onClick={() => navigate('/admin/quizzes')}
        sx={{ mt: 2, mb: 2, ml: 2 }}
      >
        {t('common.cancel')}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default UpdateQuizPage
