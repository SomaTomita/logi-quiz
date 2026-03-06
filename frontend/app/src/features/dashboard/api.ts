import { apiClient } from '@/shared/api/client'
import type { DashboardSaveData } from './types'

export const saveDashboardData = (data: DashboardSaveData) =>
  apiClient.post('/dashboard/section_cleared', {
    playTime: data.playTime,
    questionsCleared: data.questionsCleared,
    sectionId: data.sectionResult?.sectionId,
    correctAnswers: data.sectionResult?.correctAnswers,
    learningDate: data.learningStack?.date,
    totalClear: data.learningStack?.totalClear,
  })

export const fetchDashboardData = () =>
  apiClient.get('/dashboard/dashboard_data')
