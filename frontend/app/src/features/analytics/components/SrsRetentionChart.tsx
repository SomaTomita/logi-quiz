import { Box, Typography, Alert } from '@mui/material'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Cell,
  ComposedChart,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import ChartContainer from './ChartContainer'
import { CHART_COLORS, SRS_INTERVALS, getBoxLabel, getBoxColor } from '../constants'
import type { RetentionCurveData } from '../types'

interface SrsRetentionChartProps {
  data: RetentionCurveData
}

const SrsRetentionChart = ({ data }: SrsRetentionChartProps) => {
  const { t } = useTranslation()

  // --- Retention variance by box level (proves fixed intervals are suboptimal) ---
  const varianceData = data.retentionDecay.map((d) => ({
    boxLevel: getBoxLabel(d.boxLevel, t),
    meanRetention: d.meanRetention,
    stdDev: d.stdDev,
    minRetention: d.minRetention,
    maxRetention: d.maxRetention,
    userCount: d.userCount,
    interval: `${d.fixedIntervalDays}${t('analytics.daysUnit')}`,
  }))

  // --- Box distribution ---
  const boxDistData = data.boxDistribution.map((d) => ({
    name: getBoxLabel(d.boxLevel, t),
    count: d.count,
    percentage: d.percentage,
  }))

  // --- Retention rate by box with expected interval ---
  const retentionByBoxData = data.retentionByBox.map((d) => ({
    name: getBoxLabel(d.boxLevel, t),
    retentionRate: d.retentionRate,
    avgAttempts: d.avgAttempts,
    intervalDays: d.expectedIntervalDays,
  }))

  // --- Time to mastery distribution ---
  const masteryDist = data.timeToMastery.distribution

  const critique = data.fixedIntervalCritique

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Headline critique */}
      <Alert
        severity={critique.highVarianceCount >= 2 ? 'warning' : 'info'}
        sx={{ borderRadius: 3 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {t('analytics.srsAnalysisTitle')}
        </Typography>
        <Typography variant="body2">
          {critique.conclusion}
        </Typography>
      </Alert>

      {/* Retention variance chart — the key visualization */}
      <ChartContainer
        title={t('analytics.retentionVarianceTitle')}
        subtitle={t('analytics.retentionVarianceSubtitle')}
        isLoading={false}
      >
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={varianceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="boxLevel" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload
                return (
                  <Box role="tooltip" aria-live="polite" sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, border: '1px solid rgba(0,0,0,0.1)' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{d.boxLevel}</Typography>
                    <Typography variant="caption" display="block">{t('analytics.fixedInterval', { interval: d.interval })}</Typography>
                    <Typography variant="caption" display="block">{t('analytics.meanRetention', { value: d.meanRetention })}</Typography>
                    <Typography variant="caption" display="block" color="error.main">
                      {t('analytics.stdDevDetail', { stdDev: d.stdDev, min: d.minRetention, max: d.maxRetention })}
                    </Typography>
                    <Typography variant="caption" display="block">{t('analytics.userCount', { count: d.userCount })}</Typography>
                  </Box>
                )
              }}
            />
            <Legend />
            <ReferenceLine y={85} stroke={CHART_COLORS.success} strokeDasharray="5 5" label={t('analytics.targetLabel')} />
            <Bar
              dataKey="meanRetention"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
              name={t('analytics.meanRetentionLegend')}
            />
            <Line
              type="monotone"
              dataKey="stdDev"
              stroke={CHART_COLORS.error}
              strokeWidth={2}
              dot={{ r: 5, fill: CHART_COLORS.error }}
              name={t('analytics.stdDevLegend')}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Box level distribution */}
        <Box sx={{ flex: 1 }}>
          <ChartContainer
            title={t('analytics.boxDistTitle')}
            subtitle={t('analytics.boxDistSubtitle')}
            isLoading={false}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={boxDistData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number, name: string) =>
                  name === 'count' ? [value, t('analytics.questionCountLabel')] : [`${value}%`, t('analytics.percentageLabel')]
                } />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="count">
                  {boxDistData.map((_, i) => (
                    <Cell key={i} fill={getBoxColor(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Box>

        {/* Retention rate by box level */}
        <Box sx={{ flex: 1 }}>
          <ChartContainer
            title={t('analytics.retentionByBoxTitle')}
            subtitle={t('analytics.retentionByBoxSubtitle')}
            isLoading={false}
          >
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={retentionByBoxData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine y={85} stroke={CHART_COLORS.success} strokeDasharray="5 5" />
                <Bar dataKey="retentionRate" radius={[4, 4, 0, 0]} name={t('analytics.retentionRateLabel')}>
                  {retentionByBoxData.map((_, i) => (
                    <Cell key={i} fill={getBoxColor(i)} />
                  ))}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="intervalDays"
                  stroke={CHART_COLORS.gray}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  name={t('analytics.intervalDaysLabel')}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Box>
      </Box>

      {/* Time to mastery */}
      {masteryDist.length > 0 && (
        <ChartContainer
          title={t('analytics.masteryDistTitle')}
          subtitle={t('analytics.masteryDistSubtitle', { avg: data.timeToMastery.avgDays ?? '-', median: data.timeToMastery.medianDays ?? '-' })}
          isLoading={false}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={masteryDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} label={{ value: t('analytics.daysUnit'), position: 'right', fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [value, t('analytics.questionCountLabel')]} />
              <Bar dataKey="count" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {/* Annotation */}
      <Box sx={{ px: 2, py: 1.5, bgcolor: 'rgba(79, 70, 229, 0.04)', borderRadius: 3, border: '1px solid rgba(79, 70, 229, 0.12)' }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {t('analytics.fixedIntervalAnnotation', { intervals: SRS_INTERVALS.join(`${t('analytics.daysUnit')}→`) + t('analytics.daysUnit') })}
        </Typography>
      </Box>
    </Box>
  )
}

export default SrsRetentionChart
