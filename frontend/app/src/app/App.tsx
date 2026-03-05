import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store'
import CommonLayout from '@/shared/layouts/CommonLayout'
import Providers from './providers'
import AppRoutes from './routes'

const AppContent = () => {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <CommonLayout>
      <AppRoutes />
    </CommonLayout>
  )
}

const App = () => (
  <Providers>
    <AppContent />
  </Providers>
)

export default App
