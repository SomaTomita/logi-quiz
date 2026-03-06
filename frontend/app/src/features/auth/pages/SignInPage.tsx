import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { setAuthCookies } from '@/shared/api/client'
import { Typography, TextField, Card, CardContent, CardHeader, Button, Box } from '@mui/material'
import { useAuthStore } from '../store'
import AlertMessage from '@/shared/components/AlertMessage'
import { signIn } from '../api'
import type { User } from '../types'

interface SignInForm {
  email: string
  password: string
}

const SignInPage = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [alertOpen, setAlertOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Invalid email or password')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInForm>({ mode: 'onBlur' })

  const onSubmit = async (data: SignInForm) => {
    try {
      const res = await signIn(data)
      if (res.status === 200) {
        setAuthCookies(res.headers as Record<string, string>)
        setUser(res.data.data as User)
        navigate('/confirmation-success')
      } else {
        setAlertOpen(true)
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: string[] } } }
      const msgs = axiosErr.response?.data?.errors
      if (Array.isArray(msgs) && msgs.length > 0) {
        setErrorMessage(msgs.join(', '))
      }
      setAlertOpen(true)
    }
  }

  return (
    <Box display="flex" justifyContent="center">
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 2, maxWidth: 450, mt: 4 }}>
          <CardHeader title="Sign In" sx={{ textAlign: 'center' }} />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              margin="dense"
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
              placeholder="At least 6 characters"
              margin="dense"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <Box textAlign="right" sx={{ mt: 1 }}>
              <Link
                to="/auth/password"
                style={{ fontSize: '0.8rem', textDecoration: 'none', color: '#0d9488' }}
              >
                Forget your Password?
              </Link>
            </Box>
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
            <Box textAlign="center" sx={{ mt: 3 }}>
              <Typography variant="body1">
                Don&apos;t have an account?{' '}
                <Box
                  component={Link}
                  to="/signup"
                  sx={{ textDecoration: 'none', color: '#0d9488' }}
                >
                  Sign Up now!
                </Box>
              </Typography>
            </Box>
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Typography variant="body1">
                Play without login?{' '}
                <Box component={Link} to="/home" sx={{ textDecoration: 'none', color: '#0d9488' }}>
                  Let&apos;s play quiz now!
                </Box>
              </Typography>
            </Box>
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

export default SignInPage
