import { Box, Typography, Chip } from '@mui/material'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import ChartContainer from './ChartContainer'
import { CHART_COLORS, SEGMENT_COLORS, getBoxLabel } from '../constants'
import type { LearnerSegmentData, SegmentKey } from '../types'

interface LearnerSegmentChartProps {
  data: LearnerSegmentData
}

const LearnerSegmentChart = ({ data }: LearnerSegmentChartProps) => {
  const { t } = useTranslation()
  // Group scatter data by segment
  const segmentGroups = data.segments.reduce<Record<string, { x: number; y: number; z: number; label: string }[]>>(
    (acc, user) => {
      const key = user.segment
      if (!acc[key]) acc[key] = []
      acc[key].push({
        x: user.avgResponseMs / 1000,
        y: user.accuracy,
        z: user.totalAttempts,
        label: user.segmentLabel,
      })
      return acc
    },
    {},
  )

  // Segment summary cards
  const summaryData = data.segmentSummary.map((s) => ({
    name: s.label,
    segment: s.segment,
    userCount: s.userCount,
    avgAccuracy: s.avgAccuracy,
    avgResponseSec: (s.avgResponseMs / 1000).toFixed(1),
  }))

  // SRS impact comparison
  const srsImpact = data.srsImpactBySegment

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Segment summary chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {summaryData.map((s) => (
          <Chip
            key={s.segment}
            label={`${t('analytics.segmentUserCount', { label: s.name, count: s.userCount })} (${s.avgAccuracy}%, ${s.avgResponseSec}s)`}
            sx={{
              bgcolor: SEGMENT_COLORS[s.segment],
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Scatter plot */}
        <Box sx={{ flex: 8 }}>
          <ChartContainer
            title={t('analytics.learnerSegmentTitle')}
            subtitle={t('analytics.learnerSegmentSubtitle')}
            isLoading={false}
          >
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ bottom: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={t('analytics.responseTimeAxis')}
                  unit="s"
                  tick={{ fontSize: 11 }}
                  label={{ value: t('analytics.responseTimeAxis'), position: 'bottom', fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={t('analytics.accuracyAxis')}
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  label={{ value: t('analytics.accuracyAxis'), angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="z" range={[40, 400]} name={t('analytics.attemptCountLabel')} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <Box role="tooltip" aria-live="polite" sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, border: '1px solid rgba(0,0,0,0.1)' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{d.label}</Typography>
                        <Typography variant="caption" display="block">{t('analytics.accuracyAxis')}: {d.y}%</Typography>
                        <Typography variant="caption" display="block">{t('analytics.responseTimeAxis')}: {d.x.toFixed(1)}s</Typography>
                        <Typography variant="caption" display="block">{t('analytics.attemptCountLabel')}: {d.z}</Typography>
                      </Box>
                    )
                  }}
                />
                {/* Quadrant reference lines */}
                <ReferenceLine y={70} stroke={CHART_COLORS.gray} strokeDasharray="5 5" />
                <ReferenceLine x={5} stroke={CHART_COLORS.gray} strokeDasharray="5 5" />

                {Object.entries(segmentGroups).map(([segment, points]) => (
                  <Scatter
                    key={segment}
                    data={points}
                    fill={SEGMENT_COLORS[segment as SegmentKey]}
                    fillOpacity={0.7}
                    name={points[0]?.label || segment}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Box>

        {/* Per-segment SRS outcomes */}
        <Box sx={{ flex: 4 }}>
          <ChartContainer
            title={t('analytics.segmentSrsTitle')}
            subtitle={t('analytics.segmentSrsSubtitle')}
            isLoading={false}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {srsImpact.map((impact) => {
                const retentionData = impact.retentionByBox
                  .filter((b) => b.retention !== null)
                  .map((b) => ({
                    box: getBoxLabel(b.boxLevel, t),
                    retention: b.retention,
                  }))

                if (retentionData.length === 0) return null

                return (
                  <Box key={impact.segment}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: SEGMENT_COLORS[impact.segment] }}>
                      {t('analytics.segmentUserCount', { label: impact.label, count: impact.userCount })}
                    </Typography>
                    <ResponsiveContainer width="100%" height={60}>
                      <BarChart data={retentionData} layout="vertical" margin={{ left: 0, right: 0 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="box" hide />
                        <Tooltip formatter={(v: number) => [`${v}%`, t('analytics.retentionRateLabel')]} />
                        <Bar dataKey="retention" radius={[0, 4, 4, 0]}>
                          {retentionData.map((_, i) => (
                            <Cell key={i} fill={SEGMENT_COLORS[impact.segment]} fillOpacity={0.3 + i * 0.15} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )
              })}
            </Box>
          </ChartContainer>
        </Box>
      </Box>
    </Box>
  )
}

export default LearnerSegmentChart
