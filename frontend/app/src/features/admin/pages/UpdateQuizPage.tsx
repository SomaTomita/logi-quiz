import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TextField, Button, FormControlLabel, Checkbox, Box, Snackbar, Alert } from '@mui/material'
import { fetchAdminQuiz, updateQuiz } from '../api'
import Loading from '@/shared/components/Loading'
import type { Quiz } from '@/features/quiz/types'

const UpdateQuizPage = () => {
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
        choices_attributes: quiz.choices,
        explanation_attributes: quiz.explanation,
      })
      setSnackbar({ open: true, message: 'Changes saved successfully!', severity: 'success' })
      setTimeout(() => navigate('/edit-quiz'), 1500)
    } catch {
      setSnackbar({ open: true, message: 'Error saving changes', severity: 'error' })
    }
  }

  return (
    <Box maxWidth={600}>
      <TextField
        label="Question Text"
        variant="outlined"
        fullWidth
        value={quiz.question_text}
        onChange={(e) => setQuiz({ ...quiz, question_text: e.target.value })}
        sx={{ mt: 2 }}
      />
      {(quiz.choices || []).map((choice, index) => (
        <Box key={index} display="flex" alignItems="center" sx={{ mt: 2 }}>
          <TextField
            label={`Choice ${index + 1}`}
            variant="outlined"
            value={choice.choice_text}
            onChange={(e) => {
              const updated = [...quiz.choices]
              updated[index] = { ...updated[index], choice_text: e.target.value }
              setQuiz({ ...quiz, choices: updated })
            }}
            sx={{ flex: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={choice.is_correct}
                onChange={() => {
                  const updated = [...quiz.choices]
                  updated[index] = { ...updated[index], is_correct: !choice.is_correct }
                  setQuiz({ ...quiz, choices: updated })
                }}
              />
            }
            label="Is Correct"
            sx={{ ml: 2 }}
          />
        </Box>
      ))}
      <TextField
        label="Explanation"
        variant="outlined"
        fullWidth
        multiline
        value={quiz.explanation?.explanation_text ?? ''}
        onChange={(e) =>
          setQuiz({
            ...quiz,
            explanation: { ...quiz.explanation, explanation_text: e.target.value },
          })
        }
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={saveChanges} sx={{ mt: 2, mb: 2 }}>
        Save Changes
      </Button>
      <Button
        variant="outlined"
        onClick={() => navigate('/edit-quiz')}
        sx={{ mt: 2, mb: 2, ml: 2 }}
      >
        Cancel
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
