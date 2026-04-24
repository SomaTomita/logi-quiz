import { lazy, Suspense } from 'react'
import { Box, Typography, Button, Skeleton } from '@mui/material'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/shared/components/PageHeader'
import Loading from '@/shared/components/Loading'
import EmptyState from '@/shared/components/EmptyState'
import { useAnalytics } from '../hooks'

// Keep eager — small, renders above the fold
import OverviewKpis from '../components/OverviewKpis'

// Lazy-load heavy chart components (each pulls in recharts)
const TopicPerformanceChart = lazy(() => import('../components/TopicPerformanceChart'))
const StudyPatternsChart = lazy(() => import('../components/StudyPatternsChart'))
const ResponseTimeChart = lazy(() => import('../components/ResponseTimeChart'))
const SrsRetentionChart = lazy(() => import('../components/SrsRetentionChart'))
const LearnerSegmentChart = lazy(() => import('../components/LearnerSegmentChart'))

const ChartSkeleton = () => (
  <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
)

const AnalyticsPage = () => {
  const { t } = useTranslation()
  const { overview, topicAccuracy, engagement, responseTimes, retentionCurves, learnerSegments, isLoading, error, refetch } =
    useAnalytics()

  if (isLoading) return <Loading />

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          {t('analytics.loadError')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {error.message}
        </Typography>
        <Button variant="contained" onClick={refetch}>
          {t('common.reload')}
        </Button>
      </Box>
    )
  }

  if (!overview || overview.totalAttempts === 0) {
    return (
      <>
        <PageHeader title={t('analytics.pageTitle')} subtitle={t('analytics.pageSubtitle')} />
        <EmptyState
          title={t('analytics.emptyTitle')}
          description={t('analytics.emptyDescription')}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader title={t('analytics.pageTitle')} subtitle={t('analytics.pageSubtitle')} />

      {/* KPI Overview */}
      <OverviewKpis data={overview} />

      {/* Topic Performance */}
      <Box sx={{ mb: 3 }}>
        {topicAccuracy && (
          <Suspense fallback={<ChartSkeleton />}>
            <TopicPerformanceChart data={topicAccuracy} />
          </Suspense>
        )}
      </Box>

      {/* Study Patterns */}
      <Box sx={{ mb: 3 }}>
        {engagement && (
          <Suspense fallback={<ChartSkeleton />}>
            <StudyPatternsChart data={engagement} />
          </Suspense>
        )}
      </Box>

      {/* Response Time Analysis */}
      <Box sx={{ mb: 3 }}>
        {responseTimes && (
          <Suspense fallback={<ChartSkeleton />}>
            <ResponseTimeChart data={responseTimes} />
          </Suspense>
        )}
      </Box>

      {/* SRS Retention Analysis — centerpiece */}
      <Box sx={{ mb: 3 }}>
        {retentionCurves && (
          <Suspense fallback={<ChartSkeleton />}>
            <SrsRetentionChart data={retentionCurves} />
          </Suspense>
        )}
      </Box>

      {/* Learner Segments */}
      <Box sx={{ mb: 3 }}>
        {learnerSegments && (
          <Suspense fallback={<ChartSkeleton />}>
            <LearnerSegmentChart data={learnerSegments} />
          </Suspense>
        )}
      </Box>
    </>
  )
}

export default AnalyticsPage
