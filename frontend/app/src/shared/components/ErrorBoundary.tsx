import { Component, type ReactNode } from 'react'
import { Box, Typography, Button } from '@mui/material'

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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          gap={2}
        >
          <Typography variant="h5">エラーが発生しました</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            リロード
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
