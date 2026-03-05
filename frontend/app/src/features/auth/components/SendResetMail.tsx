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
import { sendResetEmail } from '../api'
import AlertMessage from '@/shared/components/AlertMessage'
import type { SendResetMailParams } from '../types'

const SendResetMail = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<SendResetMailParams>({ criteriaMode: 'all' })
  const watchedEmail = watch('email')

  const onSubmit: SubmitHandler<SendResetMailParams> = async (data) => {
    try {
      await sendResetEmail(data)
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
          <Typography variant="h6">Reset email sent</Typography>
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
              label="Email"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              margin="dense"
              autoComplete="email"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!watchedEmail || Boolean(errors.email)}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertOpen}
        setOpen={setAlertOpen}
        severity="error"
        message="Failed to send email"
      />
    </Box>
  )
}

export default SendResetMail
