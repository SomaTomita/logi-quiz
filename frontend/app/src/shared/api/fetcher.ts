import { apiClient } from './client'

/**
 * Generic SWR fetcher that unwraps the Axios response envelope.
 * Use as the default fetcher for useSWR calls.
 */
export const fetcher = <T>(url: string): Promise<T> =>
  apiClient.get<T>(url).then((res) => res.data)
