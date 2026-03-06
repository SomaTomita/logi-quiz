import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { TextField, Button, Box, Alert, Typography } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AuthLayout from '@/shared/layouts/AuthLayout'
import { resetPassword } from '../api'
import type { PasswordResetParams } from '../types'

interface Props {
  resetPasswordToken: string
}

const ResetForm = ({ resetPasswordToken }: Props) => {
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
      setError('パスワードのリセットに失敗しました。もう一度お試しください。')
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 1 }}>
            パスワードを変更しました
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            新しいパスワードでログインしてください。
          </Typography>
          <Button component={Link} to="/signin" variant="contained">
            ログインへ
          </Button>
        </Box>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Typography variant="h3" component="h1" sx={{ mb: 0.5 }}>
        新しいパスワード
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        新しいパスワードを設定してください
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="新しいパスワード"
          type="password"
          autoComplete="new-password"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'パスワードを入力してください',
            minLength: { value: 6, message: 'パスワードは6文字以上で入力してください' },
          })}
        />
        <TextField
          fullWidth
          label="新しいパスワード（確認）"
          type="password"
          autoComplete="new-password"
          margin="normal"
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
          {...register('passwordConfirmation', {
            required: 'パスワード確認を入力してください',
            validate: (v) => v === password || 'パスワードが一致しません',
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
          パスワードを変更
        </Button>
      </Box>
    </AuthLayout>
  )
}

export default ResetForm
