import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { setAuthCookies } from '@/shared/api/client'
import { Typography, TextField, Button, Box, Alert } from '@mui/material'
import AuthLayout from '@/shared/layouts/AuthLayout'
import { useAuthStore } from '../store'
import { signUp } from '../api'
import type { User } from '../types'

interface SignUpForm {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

const SignUpPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({ mode: 'onBlur' })

  const onSubmit = async (data: SignUpForm) => {
    setError(null)
    try {
      const res = await signUp({
        ...data,
        confirmSuccessUrl: import.meta.env.VITE_CONFIRM_SUCCESS_URL,
      })
      if (res.status === 200) {
        setAuthCookies(res.headers as Record<string, string>)
        setUser(res.data.data as User)
        navigate('/sections')
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: { fullMessages?: string[] } } } }
      const messages = axiosErr.response?.data?.errors?.fullMessages
      setError(
        messages && messages.length > 0
          ? messages.join(', ')
          : t('auth.signUpError'),
      )
    }
  }

  return (
    <AuthLayout>
      <Typography variant="h3" component="h1" sx={{ mb: 0.5 }}>
        {t('auth.signUpTitle')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('auth.signUpSubtitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label={t('auth.nameLabel')}
          autoComplete="name"
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name', { required: t('auth.nameRequired') })}
        />
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
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('auth.emailInvalid'),
            },
          })}
        />
        <TextField
          fullWidth
          label={t('auth.passwordLabel')}
          type="password"
          autoComplete="new-password"
          margin="normal"
          placeholder={t('auth.passwordPlaceholder')}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password', {
            required: t('auth.passwordRequired'),
            minLength: { value: 6, message: t('auth.passwordMinLength') },
          })}
        />
        <TextField
          fullWidth
          label={t('auth.passwordConfirmLabel')}
          type="password"
          autoComplete="new-password"
          margin="normal"
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
          {...register('passwordConfirmation', {
            required: t('auth.passwordConfirmRequired'),
            validate: (value) => value === watch('password') || t('auth.passwordMismatch'),
          })}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting}
          sx={{ mt: 3, py: 1.5 }}
        >
          {isSubmitting ? t('auth.signingUp') : t('common.signUp')}
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t('auth.hasAccount')}{' '}
          <Typography
            component={Link}
            to="/signin"
            variant="body2"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('common.signIn')}
          </Typography>
        </Typography>
      </Box>
    </AuthLayout>
  )
}

export default SignUpPage
