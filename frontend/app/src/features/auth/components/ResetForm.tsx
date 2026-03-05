import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  TextField,
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  Typography,
  IconButton,
  Box,
} from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { resetPassword } from '../api'
import AlertMessage from '@/shared/components/AlertMessage'
import type { PasswordResetParams } from '../types'

interface Props {
  resetPasswordToken: string
}

const ResetForm = ({ resetPasswordToken }: Props) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<PasswordResetParams>({ criteriaMode: 'all' })
  const password = watch('password', '')

  const onSubmit: SubmitHandler<PasswordResetParams> = async (data) => {
    try {
      await resetPassword({ ...data, resetPasswordToken })
      setIsSubmitted(true)
    } catch {
      setAlertOpen(true)
    }
  }

  if (isSubmitted) {
    return (
      <Box display="flex" justifyContent="center">
        <Alert
          severity="success"
          action={
            <IconButton color="inherit" size="small">
              <CheckCircleIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mt: 2, display: 'flex', alignItems: 'center' }}
        >
          <Typography variant="h6">Reset Password has completed!</Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box display="flex" justifyContent="center">
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mt: 6, p: 2, maxWidth: 450 }}>
          <CardHeader sx={{ textAlign: 'center' }} title="Reset Password" />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="New Password"
              type="password"
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={errors.password ? 'Invalid password' : ''}
              margin="dense"
              autoComplete="new-password"
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="New Password Confirmation"
              type="password"
              {...register('passwordConfirmation')}
              error={Boolean(errors.passwordConfirmation)}
              helperText={errors.passwordConfirmation ? "Passwords don't match" : ''}
              margin="dense"
              autoComplete="new-password"
            />
            <input type="hidden" value={resetPasswordToken} {...register('resetPasswordToken')} />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!password}
              sx={{ mt: 2 }}
            >
              Change
            </Button>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertOpen}
        setOpen={setAlertOpen}
        severity="error"
        message="Error resetting password"
      />
    </Box>
  )
}

export default ResetForm
