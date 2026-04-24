import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store'
import useHtmlLang from '@/i18n/useHtmlLang'
import Providers from './providers'
import AppRoutes from './routes'

const AppContent = () => {
  const initialize = useAuthStore((s) => s.initialize)
  useHtmlLang()

  useEffect(() => {
    initialize()
  }, [initialize])

  return <AppRoutes />
}

const App = () => (
  <Providers>
    <AppContent />
  </Providers>
)

export default App
