import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import { fetcher } from '@/shared/api/fetcher'
import type { Section } from './types'

export const useSections = () => {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en' : 'ja'

  const { data, error, isLoading, mutate } = useSWR<Section[]>(
    `/sections?locale=${locale}`,
    fetcher,
  )

  return { sections: data ?? [], isLoading, error, refetch: mutate }
}
