import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ChartContainer from './ChartContainer'
import { CHART_COLORS, SECTION_PALETTE } from '../constants'
import type { ResponseTimeData } from '../types'

interface ResponseTimeChartProps {
  data: ResponseTimeData
}

const speedColor = (ms: number) => {
  if (ms <= 3000) return CHART_COLORS.success
  if (ms <= 7000) return CHART_COLORS.secondary
  return CHART_COLORS.error
}

const ResponseTimeChart = ({ data }: ResponseTimeChartProps) => {
  const { t } = useTranslation()
  const histogramData = data.histogram.map((b) => ({
    range: `${(b.binStart / 1000).toFixed(0)}-${(b.binEnd / 1000).toFixed(0)}s`,
    count: b.count,
    binStart: b.binStart,
  }))

  const sectionData = data.bySection.map((s) => ({
    name: s.sectionName,
    avgMs: s.avgMs,
    avgSec: (s.avgMs / 1000).toFixed(1),
    attemptCount: s.attemptCount,
  }))

  const correlationData = data.correctnessCorrelation.map((c) => ({
    bucket: c.speedBucket,
    accuracy: c.accuracyRate,
    attempts: c.totalAttempts,
  }))

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <ChartContainer
            title={t('analytics.responseTimeDistTitle')}
            subtitle={t('analytics.responseTimeDistSubtitle')}
            isLoading={false}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => [value, t('analytics.responseCountLabel')]} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {histogramData.map((entry, i) => (
                    <Cell key={i} fill={speedColor(entry.binStart)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Box>

        <Box sx={{ flex: 1 }}>
          <ChartContainer
            title={t('analytics.sectionResponseTitle')}
            subtitle={t('analytics.sectionResponseSubtitle')}
            isLoading={false}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sectionData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="ms" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(1)}s`, t('analytics.avgResponseTimeLabel')]} />
                <Bar dataKey="avgMs" radius={[0, 4, 4, 0]}>
                  {sectionData.map((_, i) => (
                    <Cell key={i} fill={SECTION_PALETTE[i % SECTION_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Box>
      </Box>

      <ChartContainer
        title={t('analytics.correlationTitle')}
        subtitle={t('analytics.correlationSubtitle')}
        isLoading={false}
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={correlationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="bucket" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === 'accuracy' ? [`${value}%`, t('analytics.accuracyLabel')] : [value, t('analytics.responseCountLabel')]
              }
            />
            <Bar dataKey="accuracy" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="accuracy" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Box>
  )
}

export default ResponseTimeChart
