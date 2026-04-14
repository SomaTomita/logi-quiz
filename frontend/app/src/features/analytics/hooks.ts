import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/features/auth/store'
import {
  fetchAnalyticsOverview,
  fetchTopicAccuracy,
  fetchEngagement,
  fetchResponseTimes,
  fetchRetentionCurves,
  fetchLearnerSegments,
} from './api'
import type {
  AnalyticsOverview,
  TopicAccuracyData,
  EngagementData,
  ResponseTimeData,
  RetentionCurveData,
  LearnerSegmentData,
} from './types'

interface AnalyticsState {
  overview: AnalyticsOverview | null
  topicAccuracy: TopicAccuracyData | null
  engagement: EngagementData | null
  responseTimes: ResponseTimeData | null
  retentionCurves: RetentionCurveData | null
  learnerSegments: LearnerSegmentData | null
  isLoading: boolean
  error: Error | null
}

export const useAnalytics = () => {
  const user = useAuthStore((s) => s.user)
  const [state, setState] = useState<AnalyticsState>({
    overview: null,
    topicAccuracy: null,
    engagement: null,
    responseTimes: null,
    retentionCurves: null,
    learnerSegments: null,
    isLoading: true,
    error: null,
  })

  const userId = user?.id ?? null

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const [overview, topicAccuracy, engagement, responseTimes, retentionCurves, learnerSegments] =
        await Promise.all([
          fetchAnalyticsOverview(),
          fetchTopicAccuracy(),
          fetchEngagement(),
          fetchResponseTimes(),
          fetchRetentionCurves(),
          fetchLearnerSegments(),
        ])

      setState({
        overview: overview.data.data,
        topicAccuracy: topicAccuracy.data.data,
        engagement: engagement.data.data,
        responseTimes: responseTimes.data.data,
        retentionCurves: retentionCurves.data.data,
        learnerSegments: learnerSegments.data.data,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Failed to load analytics'),
      }))
    }
  }, [])

  useEffect(() => {
    if (!userId) {
      setState({
        overview: null,
        topicAccuracy: null,
        engagement: null,
        responseTimes: null,
        retentionCurves: null,
        learnerSegments: null,
        isLoading: false,
        error: null,
      })
      return
    }

    load()
  }, [userId, load])

  return { ...state, refetch: load }
}
