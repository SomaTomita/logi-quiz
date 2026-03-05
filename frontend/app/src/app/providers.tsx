import type { ReactNode } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { theme } from '@/theme'
import ErrorBoundary from '@/shared/components/ErrorBoundary'

const Providers = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  </ErrorBoundary>
)

export default Providers
