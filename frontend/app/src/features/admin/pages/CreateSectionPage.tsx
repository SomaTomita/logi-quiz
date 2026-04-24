import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TextField, Button, Grid, Typography, Fab, Paper, Box } from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { createSection } from '../api'

const CreateSectionPage = () => {
  const { t } = useTranslation()
  const [sectionName, setSectionName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createSection(sectionName)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 5 }}>
        {t('admin.createSectionTitle')}
      </Typography>
      <Paper elevation={2} sx={{ maxWidth: 450, p: 3, mt: 2, mb: 3 }}>
        <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="text"
              name="sectionName"
              placeholder={t('admin.sectionNamePlaceholder')}
              variant="outlined"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button variant="contained" type="submit" sx={{ mt: 2, mb: 2 }}>
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
