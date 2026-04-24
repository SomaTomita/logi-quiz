import useSWR from 'swr'
import { fetcher } from '@/shared/api/fetcher'
import { useAuthStore } from '@/features/auth/store'
import type { DashboardData } from './types'

interface DashboardResponse {
  data: DashboardData
}

export const useDashboard = () => {
  const user = useAuthStore((s) => s.user)

  const { data, error, isLoading, mutate } = useSWR<DashboardResponse>(
    user ? '/dashboard/dashboard_data' : null,
    fetcher,
  )

  return {
    data: data?.data ?? null,
    isLoading,
    error,
    user,
    refetch: mutate,
  }
}
