import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import { fetcher } from '@/shared/api/fetcher'
import type { Section } from '@/features/section/types'

/**
 * Admin variant of useSections.
 * Shares the same SWR cache key (per locale) so section data is deduplicated.
 */
export const useAdminSections = () => {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en' : 'ja'

  const { data, error, isLoading, mutate } = useSWR<Section[]>(
    `/sections?locale=${locale}`,
    fetcher,
  )

  const sections = data ?? []

  return {
    sections,
    isLoading,
    error,
    /** Optimistically update the local cache (e.g. after edit/delete). */
    mutate,
  }
}
