import { Component, type ReactNode } from 'react'
import { Box, Typography, Button, Paper, Container } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', width: '100%' }}>
              <ErrorOutlineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                予期しないエラーが発生しました
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                ページの読み込み中に問題が発生しました。リロードして再度お試しください。
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.location.reload()}
                sx={{ px: 4, py: 1.5 }}
              >
                ページをリロード
              </Button>
            </Paper>
          </Box>
        </Container>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
