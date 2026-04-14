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
import ChartContainer from './ChartContainer'
import { CHART_COLORS, SRS_INTERVALS, getBoxLabel, getBoxColor } from '../constants'
import type { RetentionCurveData } from '../types'

interface SrsRetentionChartProps {
  data: RetentionCurveData
}

const SrsRetentionChart = ({ data }: SrsRetentionChartProps) => {
  // --- Retention variance by box level (proves fixed intervals are suboptimal) ---
  const varianceData = data.retentionDecay.map((d) => ({
    boxLevel: getBoxLabel(d.boxLevel),
    meanRetention: d.meanRetention,
    stdDev: d.stdDev,
    minRetention: d.minRetention,
    maxRetention: d.maxRetention,
    userCount: d.userCount,
    interval: `${d.fixedIntervalDays}日`,
  }))

  // --- Box distribution ---
  const boxDistData = data.boxDistribution.map((d) => ({
    name: getBoxLabel(d.boxLevel),
    count: d.count,
    percentage: d.percentage,
  }))

  // --- Retention rate by box with expected interval ---
  const retentionByBoxData = data.retentionByBox.map((d) => ({
    name: getBoxLabel(d.boxLevel),
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
          SRS固定間隔分析結果
        </Typography>
        <Typography variant="body2">
          {critique.conclusion}
        </Typography>
      </Alert>

      {/* Retention variance chart — the key visualization */}
      <ChartContainer
        title="ボックスレベル別 記憶定着率のばらつき"
        subtitle="同じ固定間隔でもユーザーごとに記憶定着率が大きく異なることを示す（標準偏差が高いほど個人差が大きい）"
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
                    <Typography variant="caption" display="block">固定間隔: {d.interval}</Typography>
                    <Typography variant="caption" display="block">平均定着率: {d.meanRetention}%</Typography>
                    <Typography variant="caption" display="block" color="error.main">
                      標準偏差: {d.stdDev}% (範囲: {d.minRetention}%-{d.maxRetention}%)
                    </Typography>
                    <Typography variant="caption" display="block">ユーザー数: {d.userCount}</Typography>
                  </Box>
                )
              }}
            />
            <Legend />
            <ReferenceLine y={85} stroke={CHART_COLORS.success} strokeDasharray="5 5" label="目標85%" />
            <Bar
              dataKey="meanRetention"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
              name="平均記憶定着率"
            />
            <Line
              type="monotone"
              dataKey="stdDev"
              stroke={CHART_COLORS.error}
              strokeWidth={2}
              dot={{ r: 5, fill: CHART_COLORS.error }}
              name="標準偏差 (個人差)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Box level distribution */}
        <Box sx={{ flex: 1 }}>
          <ChartContainer
            title="ボックスレベル分布"
            subtitle="SRSボックス別の問題数"
            isLoading={false}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={boxDistData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number, name: string) =>
                  name === 'count' ? [`${value}問`, '問題数'] : [`${value}%`, '割合']
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
            title="ボックスレベル別定着率"
            subtitle="各レベルの定着率と復習間隔"
            isLoading={false}
          >
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={retentionByBoxData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine y={85} stroke={CHART_COLORS.success} strokeDasharray="5 5" />
                <Bar dataKey="retentionRate" radius={[4, 4, 0, 0]} name="定着率">
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
                  name="復習間隔(日)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Box>
      </Box>

      {/* Time to mastery */}
      {masteryDist.length > 0 && (
        <ChartContainer
          title="習得までの日数分布"
          subtitle={`Box 4到達までの平均${data.timeToMastery.avgDays ?? '-'}日 (中央値: ${data.timeToMastery.medianDays ?? '-'}日)`}
          isLoading={false}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={masteryDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} label={{ value: '日', position: 'right', fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`${value}問`, '問題数']} />
              <Bar dataKey="count" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {/* Annotation */}
      <Box sx={{ px: 2, py: 1.5, bgcolor: 'rgba(79, 70, 229, 0.04)', borderRadius: 3, border: '1px solid rgba(79, 70, 229, 0.12)' }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          固定間隔の復習スケジュール（{SRS_INTERVALS.join('日→')}日）は、学習者ごとの記憶定着パターンの違いに適応できません。
          上のグラフは、同じボックスレベルでも学習者の特性（回答速度・正答率）によって記憶保持率が大きく異なることを示しています。
          適応型アルゴリズムは、個人の記憶パターンに基づいて復習間隔を動的に調整する必要があります。
        </Typography>
      </Box>
    </Box>
  )
}

export default SrsRetentionChart
