import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { setAuthCookies } from '@/shared/api/client'
import { Typography, TextField, Button, Box, Alert } from '@mui/material'
import AuthLayout from '@/shared/layouts/AuthLayout'
import { useAuthStore } from '../store'
import { signIn } from '../api'
import type { User } from '../types'

interface SignInForm {
  email: string
  password: string
}

const SignInPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({ mode: 'onBlur' })

  const onSubmit = async (data: SignInForm) => {
    setError(null)
    try {
      const res = await signIn(data)
      if (res.status === 200) {
        setAuthCookies(res.headers as Record<string, string>)
        setUser(res.data.data as User)
        navigate('/sections')
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: string[] } } }
      const msgs = axiosErr.response?.data?.errors
      setError(
        Array.isArray(msgs) && msgs.length > 0
          ? msgs.join(', ')
          : t('auth.signInError'),
      )
    }
  }

  return (
    <AuthLayout>
      <Typography variant="h3" component="h1" sx={{ mb: 0.5 }}>
        {t('auth.signInTitle')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('auth.signInSubtitle')}
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
          autoComplete="current-password"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password', {
            required: t('auth.passwordRequired'),
            minLength: { value: 6, message: t('auth.passwordMinLength') },
          })}
        />
        <Box sx={{ textAlign: 'right', mt: 0.5, mb: 2 }}>
          <Typography
            component={Link}
            to="/reset-password"
            variant="body2"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('auth.forgotPassword')}
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting}
          sx={{ py: 1.5 }}
        >
          {isSubmitting ? t('auth.signingIn') : t('common.signIn')}
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t('auth.noAccount')}{' '}
          <Typography
            component={Link}
            to="/signup"
            variant="body2"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('common.signUp')}
          </Typography>
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography
          component={Link}
          to="/sections"
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {t('auth.tryWithoutLogin')}
        </Typography>
      </Box>
    </AuthLayout>
  )
}

export default SignInPage
