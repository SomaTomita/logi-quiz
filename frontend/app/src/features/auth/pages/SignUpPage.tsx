import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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
          : '登録に失敗しました。もう一度お試しください。',
      )
    }
  }

  return (
    <AuthLayout>
      <Typography variant="h3" component="h1" sx={{ mb: 0.5 }}>
        アカウント作成
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        学習記録を保存して、進捗を確認しましょう
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="名前"
          autoComplete="name"
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name', { required: '名前を入力してください' })}
        />
        <TextField
          fullWidth
          label="メールアドレス"
          type="email"
          autoComplete="email"
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'メールアドレスを入力してください',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '正しいメールアドレスを入力してください',
            },
          })}
        />
        <TextField
          fullWidth
          label="パスワード"
          type="password"
          autoComplete="new-password"
          margin="normal"
          placeholder="6文字以上"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'パスワードを入力してください',
            minLength: { value: 6, message: 'パスワードは6文字以上で入力してください' },
          })}
        />
        <TextField
          fullWidth
          label="パスワード（確認）"
          type="password"
          autoComplete="new-password"
          margin="normal"
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
          {...register('passwordConfirmation', {
            required: 'パスワード確認を入力してください',
            validate: (value) => value === watch('password') || 'パスワードが一致しません',
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
          {isSubmitting ? '登録中...' : 'アカウント作成'}
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          すでにアカウントをお持ちですか？{' '}
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
            ログイン
          </Typography>
        </Typography>
      </Box>
    </AuthLayout>
  )
}

export default SignUpPage
