import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import PageHeader from '@/shared/components/PageHeader'
import Loading from '@/shared/components/Loading'
import EmptyState from '@/shared/components/EmptyState'
import { useAnalytics } from '../hooks'
import OverviewKpis from '../components/OverviewKpis'
import TopicPerformanceChart from '../components/TopicPerformanceChart'
import StudyPatternsChart from '../components/StudyPatternsChart'
import ResponseTimeChart from '../components/ResponseTimeChart'
import SrsRetentionChart from '../components/SrsRetentionChart'
import LearnerSegmentChart from '../components/LearnerSegmentChart'

const AnalyticsPage = () => {
  const { overview, topicAccuracy, engagement, responseTimes, retentionCurves, learnerSegments, isLoading, error, refetch } =
    useAnalytics()

  if (isLoading) return <Loading />

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          分析データを読み込めませんでした
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {error.message}
        </Typography>
        <Button variant="contained" onClick={refetch}>
          再読み込み
        </Button>
      </Box>
    )
  }

  if (!overview || overview.totalAttempts === 0) {
    return (
      <>
        <PageHeader title="学習分析ダッシュボード" subtitle="ユーザー行動データの可視化と分析" />
        <EmptyState
          title="分析データがありません"
          description="ユーザーがクイズを解くと、ここに学習分析データが表示されます。"
        />
      </>
    )
  }

  return (
    <>
      <PageHeader title="学習分析ダッシュボード" subtitle="ユーザー行動データの可視化と分析" />

      {/* KPI Overview */}
      <OverviewKpis data={overview} />

      {/* Topic Performance */}
      <Box sx={{ mb: 3 }}>
        {topicAccuracy && <TopicPerformanceChart data={topicAccuracy} />}
      </Box>

      {/* Study Patterns */}
      <Box sx={{ mb: 3 }}>
        {engagement && <StudyPatternsChart data={engagement} />}
      </Box>

      {/* Response Time Analysis */}
      <Box sx={{ mb: 3 }}>
        {responseTimes && <ResponseTimeChart data={responseTimes} />}
      </Box>

      {/* SRS Retention Analysis — centerpiece */}
      <Box sx={{ mb: 3 }}>
        {retentionCurves && <SrsRetentionChart data={retentionCurves} />}
      </Box>

      {/* Learner Segments */}
      <Box sx={{ mb: 3 }}>
        {learnerSegments && <LearnerSegmentChart data={learnerSegments} />}
      </Box>
    </>
  )
}

export default AnalyticsPage
