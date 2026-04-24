import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TextField, Button, Box, Alert, Typography } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AuthLayout from '@/shared/layouts/AuthLayout'
import { resetPassword } from '../api'
import type { PasswordResetParams } from '../types'

interface Props {
  resetPasswordToken: string
}

const ResetForm = ({ resetPasswordToken }: Props) => {
  const { t } = useTranslation()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<PasswordResetParams>({ criteriaMode: 'all' })
  const password = watch('password', '')

  const onSubmit: SubmitHandler<PasswordResetParams> = async (data) => {
    setError(null)
    try {
      await resetPassword({ ...data, resetPasswordToken })
      setIsSubmitted(true)
    } catch {
      setError(t('auth.resetPasswordError'))
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 1 }}>
            {t('auth.passwordChangedTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('auth.passwordChangedDescription')}
          </Typography>
          <Button component={Link} to="/signin" variant="contained">
            {t('auth.goToLogin')}
          </Button>
        </Box>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Typography variant="h3" component="h1" sx={{ mb: 0.5 }}>
        {t('auth.newPasswordTitle')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('auth.newPasswordSubtitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label={t('auth.newPasswordLabel')}
          type="password"
          autoComplete="new-password"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password', {
            required: t('auth.passwordRequired'),
            minLength: { value: 6, message: t('auth.passwordMinLength') },
          })}
        />
        <TextField
          fullWidth
          label={t('auth.newPasswordConfirmLabel')}
          type="password"
          autoComplete="new-password"
          margin="normal"
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
          {...register('passwordConfirmation', {
            required: t('auth.passwordConfirmRequired'),
            validate: (v) => v === password || t('auth.passwordMismatch'),
          })}
        />
        <input type="hidden" value={resetPasswordToken} {...register('resetPasswordToken')} />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!password}
          sx={{ mt: 2, py: 1.5 }}
        >
          {t('auth.changePassword')}
        </Button>
      </Box>
    </AuthLayout>
  )
}

export default ResetForm
