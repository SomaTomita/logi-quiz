import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { setAuthCookies } from '@/shared/api/client'
import { TextField, Card, CardContent, CardHeader, Button, Box } from '@mui/material'
import { useAuthStore } from '../store'
import AlertMessage from '@/shared/components/AlertMessage'
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
  const [alertOpen, setAlertOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Registration failed. Please try again.')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpForm>({ mode: 'onBlur' })

  const onSubmit = async (data: SignUpForm) => {
    try {
      const res = await signUp({
        ...data,
        confirmSuccessUrl: import.meta.env.VITE_CONFIRM_SUCCESS_URL,
      })
      if (res.status === 200) {
        setAuthCookies(res.headers as Record<string, string>)
        setUser(res.data.data as User)
        navigate('/confirmation-success')
      } else {
        setAlertOpen(true)
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: { fullMessages?: string[] } } } }
      const messages = axiosErr.response?.data?.errors?.fullMessages
      if (messages && messages.length > 0) {
        setErrorMessage(messages.join(', '))
      }
      setAlertOpen(true)
    }
  }

  return (
    <Box display="flex" justifyContent="center">
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mt: 6, p: 2, maxWidth: 450 }}>
          <CardHeader sx={{ textAlign: 'center' }} title="Sign Up" />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Name"
              margin="dense"
              autoComplete="name"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Email"
              margin="dense"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format',
                },
              })}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password"
              type="password"
              margin="dense"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password Confirmation"
              type="password"
              margin="dense"
              autoComplete="new-password"
              error={!!errors.passwordConfirmation}
              helperText={errors.passwordConfirmation?.message}
              {...register('passwordConfirmation', {
                required: 'Password confirmation is required',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!isValid}
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
        message={errorMessage}
      />
    </Box>
  )
}

export default SignUpPage
