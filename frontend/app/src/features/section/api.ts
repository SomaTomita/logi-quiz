import { apiClient } from '@/shared/api/client'
import type { Section } from './types'

export const fetchSections = (locale: string = 'ja') =>
  apiClient.get<Section[]>(`/sections?locale=${locale}`)
