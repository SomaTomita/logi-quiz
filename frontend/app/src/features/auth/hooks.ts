import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from './store'

export const useAuthGuard = () => {
  const navigate = useNavigate()
  const isLoading = useAuthStore((s) => s.isLoading)
  const isSignedIn = useAuthStore((s) => s.isSignedIn)

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      navigate('/signin')
    }
  }, [isLoading, isSignedIn, navigate])

  return { isLoading, isSignedIn }
}

export const useAdminGuard = () => {
  const navigate = useNavigate()
  const isLoading = useAuthStore((s) => s.isLoading)
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const isAdmin = useAuthStore((s) => s.isAdmin)

  useEffect(() => {
    if (!isLoading && (!isSignedIn || !isAdmin)) {
      navigate('/signin')
    }
  }, [isLoading, isSignedIn, isAdmin, navigate])

  return { isLoading, isSignedIn, isAdmin }
}
