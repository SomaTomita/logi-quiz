import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { setAuthCookies } from '@/shared/api/client'
import { Typography, TextField, Button, Box, Alert } from '@mui/material'
import AuthLayout from '@/shared/layouts/AuthLayout'
import { useAuthStore } from '../store'
import { signIn } from '../api'
import type { User } from '../types'

const SignInPage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [error, setError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t('auth.emailRequired'))
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('auth.emailInvalid')),
        password: z
          .string()
          .min(1, t('auth.passwordRequired'))
          .min(6, t('auth.passwordMinLength')),
      }),
    [t],
  )

  type SignInForm = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  useEffect(() => {
    trigger()
  }, [i18n.language, trigger])

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
          {...register('email')}
        />
        <TextField
          fullWidth
          label={t('auth.passwordLabel')}
          type="password"
          autoComplete="current-password"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password')}
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
