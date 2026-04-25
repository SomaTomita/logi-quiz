import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { setAuthCookies } from '@/shared/api/client'
import { Typography, TextField, Button, Box, Alert } from '@mui/material'
import AuthLayout from '@/shared/layouts/AuthLayout'
import { useAuthStore } from '../store'
import { signUp } from '../api'
import type { User } from '../types'

const SignUpPage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [error, setError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(1, t('auth.nameRequired')),
          email: z
            .string()
            .min(1, t('auth.emailRequired'))
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('auth.emailInvalid')),
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

  type SignUpForm = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    trigger()
  }, [i18n.language, trigger])

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
          {...register('name')}
        />
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
          autoComplete="new-password"
          margin="normal"
          placeholder={t('auth.passwordPlaceholder')}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password')}
        />
        <TextField
          fullWidth
          label={t('auth.passwordConfirmLabel')}
          type="password"
          autoComplete="new-password"
          margin="normal"
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
          {...register('passwordConfirmation')}
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
