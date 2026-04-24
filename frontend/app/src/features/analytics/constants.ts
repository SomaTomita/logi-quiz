export const CHART_COLORS = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  secondary: '#F59E0B',
  success: '#10B981',
  error: '#EF4444',
  info: '#3B82F6',
  purple: '#8B5CF6',
  gray: '#94A3B8',
} as const

import type { SegmentKey } from './types'

export const SEGMENT_COLORS: Record<SegmentKey, string> = {
  fast_accurate: CHART_COLORS.success,
  slow_accurate: CHART_COLORS.info,
  fast_inaccurate: CHART_COLORS.secondary,
  struggling: CHART_COLORS.error,
}

export const SECTION_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.error,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  '#EC4899',
  '#14B8A6',
] as const

import type { TFunction } from 'i18next'

export const SRS_INTERVALS = [1, 3, 7, 14, 30] as const

export const getBoxLabels = (t: TFunction) => [
  t('analytics.boxLabel0'),
  t('analytics.boxLabel1'),
  t('analytics.boxLabel2'),
  t('analytics.boxLabel3'),
  t('analytics.boxLabel4'),
]

export const BOX_COLORS = [
  CHART_COLORS.error,
  CHART_COLORS.secondary,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.success,
] as const

export const getBoxLabel = (level: number, t: TFunction): string =>
  getBoxLabels(t)[level] ?? `Box ${level}`

export const getBoxColor = (level: number): string =>
  BOX_COLORS[level] ?? CHART_COLORS.gray
