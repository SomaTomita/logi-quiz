import { useState, useEffect } from 'react'
import { fetchDashboardData } from './api'
import { useAuthStore } from '@/features/auth/store'
import type { DashboardData } from './types'

export const useDashboard = () => {
  const user = useAuthStore((s) => s.user)
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) return

    fetchDashboardData(user.id)
      .then((res) => setData(res.data.data))
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [user?.id])

  return { data, isLoading, error, user }
}
