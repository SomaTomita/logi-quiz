import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Typography, TextField, Card, CardContent, CardHeader, Button, Box } from '@mui/material'
import { useAuthStore } from '../store'
import AlertMessage from '@/shared/components/AlertMessage'
import { signIn } from '../api'
import type { SignInParams, User } from '../types'

const SignInPage = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: SignInParams = { email, password }

    try {
      const res = await signIn(params)
      if (res.status === 200) {
        Cookies.set('_access_token', res.headers['access-token'])
        Cookies.set('_client', res.headers['client'])
        Cookies.set('_uid', res.headers['uid'])
        setUser(res.data.data as User)
        navigate('/confirmation-success')
      } else {
        setAlertOpen(true)
      }
    } catch {
      setAlertOpen(true)
    }
  }

  return (
    <Box display="flex" justifyContent="center">
      <form noValidate autoComplete="off">
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
              value={email}
              margin="dense"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              margin="dense"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
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
              disabled={!email || !password}
              sx={{ mt: 2 }}
              onClick={handleSubmit}
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
        message="Invalid email or password"
      />
    </Box>
  )
}

export default SignInPage
