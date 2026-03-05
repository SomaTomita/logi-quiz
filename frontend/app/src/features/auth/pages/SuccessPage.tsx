import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Alert, IconButton, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useAuthStore } from '../store'

const SuccessPage = () => {
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (isSignedIn && user) {
      setTimeout(() => navigate('/home'), 3500)
    }
  }, [isSignedIn, user, navigate])

  return (
    <Container component="main" maxWidth="xs" sx={{ textAlign: 'center', mt: 6 }}>
      {isSignedIn && user ? (
        <>
          <Alert
            severity="success"
            action={
              <IconButton color="inherit" size="small">
                <CheckCircleIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="h4">Signed in successfully!</Typography>
          </Alert>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Email: {user.email}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mb: 5 }}>
            Name: {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
            Go to the Home screen soon...
          </Typography>
          <CircularProgress color="primary" />
        </>
      ) : (
        <Typography variant="h4" color="error">
          Not signed in
        </Typography>
      )}
    </Container>
  )
}

export default SuccessPage
