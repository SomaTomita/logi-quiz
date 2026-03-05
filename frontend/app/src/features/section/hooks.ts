import { useState, useEffect } from 'react'
import { fetchSections } from './api'
import type { Section } from './types'

export const useSections = () => {
  const [sections, setSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchSections()
      .then((res) => setSections(res.data))
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return { sections, isLoading, error }
}
