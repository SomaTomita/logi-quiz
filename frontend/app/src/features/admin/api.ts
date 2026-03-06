import { apiClient } from '@/shared/api/client'
import type { QuizFormData } from './types'

export const createQuiz = (sectionId: number | string, data: QuizFormData) =>
  apiClient.post(`/admin/sections/${sectionId}/quizzes`, { quiz: data })

export const fetchAdminQuizzes = (sectionId: number | string) =>
  apiClient.get(`/admin/sections/${sectionId}/quizzes`)

export const fetchAdminQuiz = (sectionId: string, quizId: string) =>
  apiClient.get(`/admin/sections/${sectionId}/quizzes/${quizId}`)

export const updateQuiz = (sectionId: string, quizId: string, data: Record<string, unknown>) =>
  apiClient.put(`/admin/sections/${sectionId}/quizzes/${quizId}`, { quiz: data })

export const deleteQuiz = (sectionId: number | string, quizId: number) =>
  apiClient.delete(`/admin/sections/${sectionId}/quizzes/${quizId}`)

export const createSection = (sectionName: string) =>
  apiClient.post('/admin/sections', { section: { sectionName } })

export const updateSection = (sectionId: number, sectionName: string) =>
  apiClient.put(`/admin/sections/${sectionId}`, { section: { sectionName } })

export const deleteSection = (sectionId: number) => apiClient.delete(`/admin/sections/${sectionId}`)
