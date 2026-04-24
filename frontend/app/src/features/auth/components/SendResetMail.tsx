import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TextField, Button, Box, Alert, Typography } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AuthLayout from '@/shared/layouts/AuthLayout'
import { sendResetEmail } from '../api'
import type { SendResetMailParams } from '../types'

const SendResetMail = () => {
  const { t } = useTranslation()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<SendResetMailParams>({ criteriaMode: 'all' })
  const watchedEmail = watch('email')

  const onSubmit: SubmitHandler<SendResetMailParams> = async (data) => {
    setError(null)
    try {
      await sendResetEmail(data)
      setIsSubmitted(true)
    } catch {
      setError(t('auth.sendResetError'))
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 1 }}>
            {t('auth.resetEmailSentTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('auth.resetEmailSentDescription')}
          </Typography>
          <Button component={Link} to="/signin" variant="outlined">
            {t('auth.backToLogin')}
          </Button>
        </Box>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Typography variant="h3" component="h1" sx={{ mb: 0.5 }}>
        {t('auth.resetPasswordTitle')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('auth.resetPasswordSubtitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label={t('auth.emailLabel')}
          type="email"
          autoComplete="email"
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email', {
            required: t('auth.emailRequired'),
          })}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!watchedEmail || !!errors.email}
          sx={{ mt: 2, py: 1.5 }}
        >
          {t('auth.sendResetEmail')}
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography
          component={Link}
          to="/signin"
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {t('auth.backToLogin')}
        </Typography>
      </Box>
    </AuthLayout>
  )
}

export default SendResetMail
