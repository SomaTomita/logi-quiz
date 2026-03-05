import { memo } from 'react'
import {
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CalendarHeatmap from 'react-calendar-heatmap'
import { Tooltip } from 'react-tooltip'
import { formatDate } from '@/shared/utils/date'
import type { User } from '@/features/auth/types'
import type { DashboardData } from '../types'

const ClearedSectionInfo = styled('div')({
  overflowY: 'auto',
  maxHeight: 150,
  padding: 8,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
})

const colorScale = ['#bbf7d0', '#4ade80', '#16a34a', '#166534']

interface DashboardDisplayProps {
  user: User
  data: DashboardData
}

const DashboardDisplay = memo(({ user, data }: DashboardDisplayProps) => (
  <Box sx={{ p: 3, mb: 10 }}>
    <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
      {user.name}さんのダッシュボード
    </Typography>

    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            mb: 3,
            borderTop: '4px solid #0d9488',
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            総プレイ時間
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            {Math.floor(data.total_play_time / 60)}分
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={2} />
      <Grid item xs={12} md={5}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            mb: 3,
            borderTop: '4px solid #059669',
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            総問題クリア数
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            {data.total_questions_cleared}回
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            過去10回の履歴
          </Typography>
          <ClearedSectionInfo>
            <Table stickyHeader size="small" sx={{ mb: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>セクション名</TableCell>
                  <TableCell align="right">正解数</TableCell>
                  <TableCell align="right">クリア日時</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.cleared_sections.map((section, index) => (
                  <TableRow key={index}>
                    <TableCell>{section.section_name}</TableCell>
                    <TableCell align="right">{section.correct_answers}/10</TableCell>
                    <TableCell align="right">{formatDate(section.cleared_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ClearedSectionInfo>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={2} sx={{ p: 3, mt: 2, pb: 5, overflowX: 'auto', position: 'relative' }}>
          <Typography variant="h5" sx={{ mb: 1.5 }}>
            学習記録
          </Typography>
          <CalendarHeatmap
            startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
            endDate={new Date()}
            values={(data.study_logs_past_year || []).map((log) => ({
              date: log.date,
              count: log.study_time,
            }))}
            classForValue={(value) => {
              if (!value) return 'color-empty'
              return `color-scale-${value.count}`
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) return null
              return { 'data-tip': `${value.date}: ${value.count}回` }
            }}
          />
          <Tooltip />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'absolute',
              bottom: 8,
              right: 16,
            }}
          >
            <span style={{ fontSize: 10, marginRight: 5 }}>Less</span>
            {colorScale.map((color, i) => (
              <Box key={i} sx={{ width: 15, height: 15, backgroundColor: color, mx: '2px' }} />
            ))}
            <span style={{ fontSize: 10, marginLeft: 5 }}>More</span>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
))

DashboardDisplay.displayName = 'DashboardDisplay'

export default DashboardDisplay
