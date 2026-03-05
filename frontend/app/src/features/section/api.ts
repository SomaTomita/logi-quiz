import { apiClient } from '@/shared/api/client'
import type { Section } from './types'

export const fetchSections = () => apiClient.get<Section[]>('/sections')
