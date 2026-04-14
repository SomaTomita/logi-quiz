import { apiClient } from '@/shared/api/client'
import type {
  AnalyticsOverview,
  TopicAccuracyData,
  EngagementData,
  ResponseTimeData,
  RetentionCurveData,
  LearnerSegmentData,
} from './types'

type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly'

export const fetchAnalyticsOverview = () =>
  apiClient.get<{ data: AnalyticsOverview }>('/admin/analytics/overview')

export const fetchTopicAccuracy = (period: AnalyticsPeriod = 'weekly') =>
  apiClient.get<{ data: TopicAccuracyData }>('/admin/analytics/topic_accuracy', {
    params: { period },
  })

export const fetchEngagement = (period: AnalyticsPeriod = 'monthly') =>
  apiClient.get<{ data: EngagementData }>('/admin/analytics/engagement', {
    params: { period },
  })

export const fetchResponseTimes = () =>
  apiClient.get<{ data: ResponseTimeData }>('/admin/analytics/response_times')

export const fetchRetentionCurves = () =>
  apiClient.get<{ data: RetentionCurveData }>('/admin/analytics/retention_curves')

export const fetchLearnerSegments = () =>
  apiClient.get<{ data: LearnerSegmentData }>('/admin/analytics/learner_segments')
