import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthCookies } from '@/shared/api/client'
import { TextField, Card, CardContent, CardHeader, Button, Box } from '@mui/material'
import { useAuthStore } from '../store'
import AlertMessage from '@/shared/components/AlertMessage'
import { signUp } from '../api'
import type { SignUpParams, User } from '../types'

const SignUpPage = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: SignUpParams = {
      name,
      email,
      password,
      passwordConfirmation,
      confirmSuccessUrl: import.meta.env.VITE_CONFIRM_SUCCESS_URL,
    }

    try {
      const res = await signUp(params)
      if (res.status === 200) {
        setAuthCookies(res.headers as Record<string, string>)
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
        <Card sx={{ mt: 6, p: 2, maxWidth: 450 }}>
          <CardHeader sx={{ textAlign: 'center' }} title="Sign Up" />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Name"
              value={name}
              margin="dense"
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Email"
              value={email}
              margin="dense"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              margin="dense"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password Confirmation"
              type="password"
              value={passwordConfirmation}
              margin="dense"
              autoComplete="new-password"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!name || !email || !password || !passwordConfirmation}
              sx={{ mt: 2 }}
              onClick={handleSubmit}
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
        message="Invalid email or password"
      />
    </Box>
  )
}

export default SignUpPage
