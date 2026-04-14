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
            title="回答時間分布"
            subtitle="回答にかかった時間のヒストグラム"
            isLoading={false}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => [`${value}回`, '回答数']} />
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
            title="セクション別回答時間"
            subtitle="各セクションの平均回答時間比較"
            isLoading={false}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sectionData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="ms" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(1)}s`, '平均回答時間']} />
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
        title="回答速度と正答率の相関"
        subtitle="速く回答するほど正答率が高い傾向があるか？"
        isLoading={false}
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={correlationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="bucket" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === 'accuracy' ? [`${value}%`, '正答率'] : [value, '回答数']
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
