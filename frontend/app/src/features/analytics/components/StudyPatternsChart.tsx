import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
} from 'recharts'
import { Box } from '@mui/material'
import ChartContainer from './ChartContainer'
import { CHART_COLORS } from '../constants'
import type { EngagementData } from '../types'

interface StudyPatternsChartProps {
  data: EngagementData
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`
}

const StudyPatternsChart = ({ data }: StudyPatternsChartProps) => {
  const trendData = data.activeUsers.map((d) => ({
    date: formatDate(d.periodStart),
    activeUsers: d.activeUsers,
    avgStudyTime: d.avgStudyTime,
    totalStudyTime: d.totalStudyTime,
  }))

  const distData = data.studyTimeDistribution

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ flex: 7 }}>
        <ChartContainer
          title="学習パターン推移"
          subtitle="アクティブユーザー数と平均学習時間のトレンド"
          isLoading={false}
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="avgStudyTime"
                fill={CHART_COLORS.primaryLight}
                fillOpacity={0.15}
                stroke={CHART_COLORS.primaryLight}
                name="平均学習時間(分)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="activeUsers"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="アクティブユーザー"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Box>

      <Box sx={{ flex: 5 }}>
        <ChartContainer
          title="学習時間分布"
          subtitle="1日あたりの学習時間ヒストグラム"
          isLoading={false}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} label={{ value: '分', position: 'right', fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`${value}件`, 'セッション数']} />
              <Bar dataKey="count" fill={CHART_COLORS.info} radius={[4, 4, 0, 0]} name="count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Box>
    </Box>
  )
}

export default StudyPatternsChart
