import { Typography } from '@mui/material'
import 'react-calendar-heatmap/dist/styles.css'
import { useDashboard } from '../hooks'
import Loading from '@/shared/components/Loading'
import DashboardDisplay from '../components/DashboardDisplay'
import HomeNavFab from '@/shared/components/HomeNavFab'

const DashboardPage = () => {
  const { data, isLoading, error, user } = useDashboard()

  if (isLoading) return <Loading />
  if (error) return <Typography color="error">エラーが発生しました</Typography>
  if (!data || !user) return null

  return (
    <>
      <DashboardDisplay user={user} data={data} />
      <HomeNavFab />
    </>
  )
}

export default DashboardPage
