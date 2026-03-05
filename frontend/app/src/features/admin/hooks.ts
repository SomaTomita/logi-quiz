import { useState, useEffect } from 'react'
import { fetchSections } from '@/features/section/api'
import type { Section } from '@/features/section/types'

export const useAdminSections = () => {
  const [sections, setSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSections()
      .then((res) => setSections(res.data))
      .catch((err) => console.error('Error fetching sections:', err))
      .finally(() => setIsLoading(false))
  }, [])

  return { sections, setSections, isLoading, setIsLoading }
}
