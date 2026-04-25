import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { TextField, Button, Grid, Typography, Fab, Paper, Box } from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { createSection } from '../api'

const CreateSectionPage = () => {
  const { t } = useTranslation()

  const schema = useMemo(
    () => z.object({ sectionName: z.string().min(1, t('admin.sectionNameRequired')) }),
    [t],
  )

  type FormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await createSection(data.sectionName)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" sx={{ mb: 5 }}>
        {t('admin.createSectionTitle')}
      </Typography>
      <Paper elevation={2} sx={{ maxWidth: 450, p: 3, mt: 2, mb: 3 }}>
        <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="text"
              placeholder={t('admin.sectionNamePlaceholder')}
              variant="outlined"
              error={!!errors.sectionName}
              helperText={errors.sectionName?.message}
              {...register('sectionName')}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{ mt: 2, mb: 2 }}
            >
              {t('common.submit')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box>
        <Fab
          variant="extended"
          component={Link}
          to="/admin/sections"
          color="primary"
          aria-label={t('admin.sectionEditAriaLabel')}
          sx={{ mt: 4, mb: 2 }}
        >
          <EditNoteIcon sx={{ mr: 1 }} />
          {t('admin.editSectionFab')}
        </Fab>
      </Box>
    </form>
  )
}

export default CreateSectionPage
