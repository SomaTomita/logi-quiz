import { Box } from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import ChartContainer from './ChartContainer'
import { CHART_COLORS, SECTION_PALETTE } from '../constants'
import type { TopicAccuracyData } from '../types'

interface TopicPerformanceChartProps {
  data: TopicAccuracyData
}

const TopicPerformanceChart = ({ data }: TopicPerformanceChartProps) => {
  const { t } = useTranslation()
  const barData = data.current.map((s) => ({
    name: s.sectionName,
    accuracy: s.accuracyRate,
    avgTime: s.avgResponseTimeMs ? Math.round(s.avgResponseTimeMs / 1000) : 0,
  }))

  const radarData = data.current.map((s) => ({
    section: s.sectionName.length > 8 ? s.sectionName.slice(0, 8) + '...' : s.sectionName,
    accuracy: s.accuracyRate,
    fullName: s.sectionName,
  }))

  const showRadar = data.current.length >= 3 && data.current.length <= 10

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ flex: 7 }}>
        <ChartContainer title={t('analytics.topicAccuracyTitle')} subtitle={t('analytics.topicAccuracySubtitle')} isLoading={false}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === 'accuracy' ? [`${value}%`, t('analytics.accuracyLabel')] : [`${value}s`, t('analytics.avgTimeLabel')]
                }
              />
              <Bar dataKey="accuracy" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} name="accuracy" />
              <Bar dataKey="avgTime" fill={CHART_COLORS.secondary} radius={[0, 4, 4, 0]} name="avgTime" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Box>

      {showRadar && (
        <Box sx={{ flex: 5 }}>
          <ChartContainer title={t('analytics.topicBalanceTitle')} subtitle={t('analytics.topicBalanceSubtitle')} isLoading={false}>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,0,0,0.08)" />
                <PolarAngleAxis dataKey="section" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => [`${value}%`, t('analytics.accuracyLabel')]} />
                <Radar
                  dataKey="accuracy"
                  stroke={CHART_COLORS.primary}
                  fill={CHART_COLORS.primaryLight}
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Box>
      )}
    </Box>
  )
}

export default TopicPerformanceChart
