import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

type FormValues = {
  sectionId: string
  questionText: string
  choicesAttributes: { choiceText: string; isCorrect: boolean }[]
  explanation: string
}

const CreateQuizPage = () => {
  const { t } = useTranslation()
  const { sections, isLoading } = useAdminSections()

  const schema = useMemo(
    () =>
      z.object({
        sectionId: z.string().min(1, t('admin.sectionRequired')),
        questionText: z.string().min(1, t('admin.questionTextRequired')),
        choicesAttributes: z.array(
          z.object({
            choiceText: z.string(),
            isCorrect: z.boolean(),
          }),
        ),
        explanation: z.string(),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sectionId: '',
      questionText: '',
      choicesAttributes: [
        { choiceText: '', isCorrect: false },
        { choiceText: '', isCorrect: false },
        { choiceText: '', isCorrect: false },
        { choiceText: '', isCorrect: false },
      ],
      explanation: '',
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'choicesAttributes',
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await createQuiz(Number(values.sectionId), {
        questionText: values.questionText,
        choicesAttributes: values.choicesAttributes,
        explanationAttributes: { explanationText: values.explanation },
      })
    } catch (error) {
      console.error('Error creating quiz:', error)
    }
  }

  if (isLoading || sections.length === 0) return <Loading />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" sx={{ mb: 5 }}>
        {t('admin.createQuizTitle')}
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mt: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              label={t('admin.sectionLabel')}
              defaultValue=""
              sx={{ mt: 2, width: '50%' }}
              error={!!errors.sectionId}
              helperText={errors.sectionId?.message}
              inputProps={register('sectionId')}
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
              label={t('admin.questionTextLabel')}
              placeholder={t('admin.questionTextPlaceholder')}
              multiline
              error={!!errors.questionText}
              helperText={errors.questionText?.message}
              sx={{ mt: 2, mb: 2, width: '50%' }}
              {...register('questionText')}
            />
          </Grid>
          {fields.map((field, index) => (
            <Grid item xs={12} key={field.id}>
              <TextField
                label={t('admin.choiceLabel', { number: index + 1 })}
                placeholder={t('admin.choicePlaceholder')}
                {...register(`choicesAttributes.${index}.choiceText`)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    {...register(`choicesAttributes.${index}.isCorrect`)}
                    sx={{ ml: 2 }}
                  />
                }
                label={t('admin.isCorrectLabel')}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              label={t('admin.explanationLabel')}
              placeholder={t('admin.explanationPlaceholder')}
              fullWidth
              multiline
              sx={{ mt: 2, width: '50%' }}
              {...register('explanation')}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" type="submit" disabled={isSubmitting} sx={{ mt: 2, mb: 2 }}>
              {t('common.submit')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box>
        <Fab
          variant="extended"
          component={Link}
          to="/admin/quizzes"
          color="primary"
          aria-label={t('admin.quizEditAriaLabel')}
          sx={{ mt: 4, mb: 2 }}
        >
          <EditNoteIcon sx={{ mr: 1 }} />
          {t('admin.editQuizFab')}
        </Fab>
      </Box>
    </form>
  )
}

export default CreateQuizPage
