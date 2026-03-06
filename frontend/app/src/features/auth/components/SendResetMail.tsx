import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { TextField, Button, Box, Alert, Typography } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AuthLayout from '@/shared/layouts/AuthLayout'
import { sendResetEmail } from '../api'
import type { SendResetMailParams } from '../types'

const SendResetMail = () => {
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
      setError('メールの送信に失敗しました。メールアドレスを確認してください。')
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 1 }}>
            メールを送信しました
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            パスワードリセット用のリンクをメールで送信しました。メールをご確認ください。
          </Typography>
          <Button component={Link} to="/signin" variant="outlined">
            ログインに戻る
          </Button>
        </Box>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Typography variant="h3" component="h1" sx={{ mb: 0.5 }}>
        パスワードリセット
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        登録済みのメールアドレスを入力してください
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
          リセットメールを送信
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
          ログインに戻る
        </Typography>
      </Box>
    </AuthLayout>
  )
}

export default SendResetMail
