import useSWR from 'swr'
import { fetcher } from '@/shared/api/fetcher'
import { useAuthStore } from '@/features/auth/store'
import { useTranslation } from 'react-i18next'
import type {
  AnalyticsOverview,
  TopicAccuracyData,
  EngagementData,
  ResponseTimeData,
  RetentionCurveData,
  LearnerSegmentData,
} from './types'

// Wrapper types matching the `{ data: T }` envelope from the API
interface Envelope<T> {
  data: T
}

const useAnalyticsEndpoint = <T>(path: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<Envelope<T>>(
    path,
    fetcher,
  )
  return { data: data?.data ?? null, error, isLoading, mutate }
}

export const useAnalytics = () => {
  const userId = useAuthStore((s) => s.user)?.id ?? null
  const enabled = userId !== null
  const { i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en' : 'ja'

  const overview = useAnalyticsEndpoint<AnalyticsOverview>(
    enabled ? '/admin/analytics/overview' : null,
  )
  const topicAccuracy = useAnalyticsEndpoint<TopicAccuracyData>(
    enabled ? `/admin/analytics/topic_accuracy?period=weekly&locale=${locale}` : null,
  )
  const engagement = useAnalyticsEndpoint<EngagementData>(
    enabled ? '/admin/analytics/engagement?period=monthly' : null,
  )
  const responseTimes = useAnalyticsEndpoint<ResponseTimeData>(
    enabled ? '/admin/analytics/response_times' : null,
  )
  const retentionCurves = useAnalyticsEndpoint<RetentionCurveData>(
    enabled ? '/admin/analytics/retention_curves' : null,
  )
  const learnerSegments = useAnalyticsEndpoint<LearnerSegmentData>(
    enabled ? '/admin/analytics/learner_segments' : null,
  )

  const isLoading =
    overview.isLoading ||
    topicAccuracy.isLoading ||
    engagement.isLoading ||
    responseTimes.isLoading ||
    retentionCurves.isLoading ||
    learnerSegments.isLoading

  const error =
    overview.error ??
    topicAccuracy.error ??
    engagement.error ??
    responseTimes.error ??
    retentionCurves.error ??
    learnerSegments.error ??
    null

  const refetch = async () => {
    await Promise.all([
      overview.mutate(),
      topicAccuracy.mutate(),
      engagement.mutate(),
      responseTimes.mutate(),
      retentionCurves.mutate(),
      learnerSegments.mutate(),
    ])
  }

  return {
    overview: overview.data,
    topicAccuracy: topicAccuracy.data,
    engagement: engagement.data,
    responseTimes: responseTimes.data,
    retentionCurves: retentionCurves.data,
    learnerSegments: learnerSegments.data,
    isLoading,
    error,
    refetch,
  }
}
