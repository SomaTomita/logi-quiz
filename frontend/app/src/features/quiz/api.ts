import { apiClient } from '@/shared/api/client'
import type { Quiz } from './types'

export const fetchQuizzes = (sectionId: string) =>
  apiClient.get<Quiz[]>(`/sections/${sectionId}/quizzes`)
