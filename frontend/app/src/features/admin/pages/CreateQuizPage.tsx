import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  MenuItem,
  Grid,
  Typography,
  Fab,
  Paper,
  Box,
} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { useAdminSections } from '../hooks'
import { createQuiz } from '../api'
import Loading from '@/shared/components/Loading'
import type { QuizFormData } from '../types'

const CreateQuizPage = () => {
  const { sections, isLoading } = useAdminSections()
  const [quizData, setQuizData] = useState<QuizFormData>({
    questionText: '',
    choicesAttributes: [
      { choiceText: '', isCorrect: false },
      { choiceText: '', isCorrect: false },
      { choiceText: '', isCorrect: false },
      { choiceText: '', isCorrect: false },
    ],
    explanationAttributes: { explanationText: '' },
  })
  const [selectedSection, setSelectedSection] = useState<number | string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, type, checked } = e.target
    const actualValue = type === 'checkbox' ? checked : value
    const list = [...quizData.choicesAttributes]
    ;(list[index] as any)[name] = actualValue
    setQuizData({ ...quizData, choicesAttributes: list })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createQuiz(selectedSection, quizData)
    } catch (error) {
      console.error('Error creating quiz:', error)
    }
  }

  if (isLoading || sections.length === 0) return <Loading />

  if (!selectedSection && sections.length > 0) {
    setSelectedSection(sections[0].id)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 5 }}>
        Create New Quiz
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mt: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              label="セクション"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              sx={{ mt: 2, width: '50%' }}
            >
              {sections.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.sectionName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="問題文"
              placeholder="問題文を入力してください"
              multiline
              onChange={(e) => setQuizData({ ...quizData, questionText: e.target.value })}
              sx={{ mt: 2, mb: 2, width: '50%' }}
            />
          </Grid>
          {quizData.choicesAttributes.map((choice, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                label={`選択肢 ${index + 1}`}
                name="choiceText"
                value={choice.choiceText}
                placeholder="選択肢を入力してください"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, index)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={choice.isCorrect}
                    onChange={(e) => handleInputChange(e, index)}
                    name="isCorrect"
                    sx={{ ml: 2 }}
                  />
                }
                label="正解"
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              label="解説"
              placeholder="解説を入力してください"
              fullWidth
              multiline
              onChange={(e) =>
                setQuizData({
                  ...quizData,
                  explanationAttributes: { explanationText: e.target.value },
                })
              }
              sx={{ mt: 2, width: '50%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" type="submit" sx={{ mt: 2, mb: 2 }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box>
        <Fab
          variant="extended"
          component={Link}
          to="/edit-quiz"
          color="primary"
          aria-label="クイズ編集"
          sx={{ mt: 4, mb: 2 }}
        >
          <EditNoteIcon sx={{ mr: 1 }} />
          Edit Quiz
        </Fab>
      </Box>
    </form>
  )
}

export default CreateQuizPage
