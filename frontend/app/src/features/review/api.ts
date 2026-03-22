import { apiClient } from '@/shared/api/client'
import type { ReviewIndexResponse, ReviewCompleteResponse } from './types'

export const fetchReviewQueue = (params?: { sectionId?: string; limit?: number }) =>
  apiClient.get<ReviewIndexResponse>('/reviews', { params })

export const completeReview = (questionResults: { questionId: number; choiceId: number | null; correct: boolean }[]) =>
  apiClient.post<ReviewCompleteResponse>('/reviews/complete', { questionResults })
