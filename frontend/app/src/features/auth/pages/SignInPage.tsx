import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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
          : 'メールアドレスまたはパスワードが正しくありません',
      )
    }
  }

  return (
    <AuthLayout>
      <Typography variant="h3" component="h1" sx={{ mb: 0.5 }}>
        おかえりなさい
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        ログインして学習を続けましょう
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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
          autoComplete="current-password"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'パスワードを入力してください',
            minLength: { value: 6, message: 'パスワードは6文字以上で入力してください' },
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
            パスワードをお忘れですか？
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
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          アカウントをお持ちでないですか？{' '}
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
            新規登録
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
          ログインせずにクイズを試す
        </Typography>
      </Box>
    </AuthLayout>
  )
}

export default SignInPage
