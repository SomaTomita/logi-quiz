import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { TextField, Button, Box, Alert, Typography } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AuthLayout from '@/shared/layouts/AuthLayout'
import { resetPassword } from '../api'

interface Props {
  resetPasswordToken: string
}

const ResetForm = ({ resetPasswordToken }: Props) => {
  const { t, i18n } = useTranslation()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z
        .object({
          resetPasswordToken: z.string(),
          password: z
            .string()
            .min(1, t('auth.passwordRequired'))
            .min(6, t('auth.passwordMinLength')),
          passwordConfirmation: z.string().min(1, t('auth.passwordConfirmRequired')),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
          message: t('auth.passwordMismatch'),
          path: ['passwordConfirmation'],
        }),
    [t],
  )

  type ResetFormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(schema),
    criteriaMode: 'all',
    defaultValues: { resetPasswordToken },
  })

  useEffect(() => {
    trigger()
  }, [i18n.language, trigger])

  const password = watch('password', '')

  const onSubmit = async (data: ResetFormData) => {
    setError(null)
    try {
      await resetPassword(data)
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
          {...register('password')}
        />
        <TextField
          fullWidth
          label={t('auth.newPasswordConfirmLabel')}
          type="password"
          autoComplete="new-password"
          margin="normal"
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
          {...register('passwordConfirmation')}
        />
        <input type="hidden" {...register('resetPasswordToken')} />
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
