import { apiClient } from '@/shared/api/client'
import type { DashboardSaveData } from './types'

export const saveDashboardData = (data: DashboardSaveData, userId: number) =>
  apiClient.post(`/dashboard/${userId}/section_cleared`, {
    play_time: data.playTime,
    questions_cleared: data.questions_cleared,
    section_id: data.sectionResult?.sectionId,
    correct_answers: data.sectionResult?.correctAnswers,
    learning_date: data.learningStack?.date,
    total_clear: data.learningStack?.totalClear,
  })

export const fetchDashboardData = (userId: number | string) =>
  apiClient.get(`/dashboard/${userId}/dashboard_data`)
