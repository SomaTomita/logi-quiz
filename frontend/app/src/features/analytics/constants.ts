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

export const SRS_INTERVALS = [1, 3, 7, 14, 30] as const

export const BOX_LABELS = [
  'Box 0 (1日)',
  'Box 1 (3日)',
  'Box 2 (7日)',
  'Box 3 (14日)',
  'Box 4 (30日)',
] as const

export const BOX_COLORS = [
  CHART_COLORS.error,
  CHART_COLORS.secondary,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.success,
] as const

export const getBoxLabel = (level: number): string =>
  BOX_LABELS[level] ?? `Box ${level}`

export const getBoxColor = (level: number): string =>
  BOX_COLORS[level] ?? CHART_COLORS.gray
