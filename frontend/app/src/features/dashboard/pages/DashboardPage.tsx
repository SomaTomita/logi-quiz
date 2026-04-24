import { useTranslation } from 'react-i18next'
import { Typography, Paper, Box, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import CalendarHeatmap from 'react-calendar-heatmap'
import { Tooltip } from 'react-tooltip'
import 'react-calendar-heatmap/dist/styles.css'
import { useDashboard } from '../hooks'
import { formatDate } from '@/shared/utils/date'
import Loading from '@/shared/components/Loading'
import PageHeader from '@/shared/components/PageHeader'
import StatCard from '@/shared/components/StatCard'
import EmptyState from '@/shared/components/EmptyState'
import type { DashboardData } from '../types'

const colorScale = ['#C7D2FE', '#818CF8', '#4F46E5', '#3730A3']

const getScoreColor = (correct: number) => {
  if (correct >= 8) return 'success.main'
  if (correct >= 5) return 'warning.main'
  return 'error.main'
}

const calcStreak = (logs: DashboardData['studyLogsPastYear']): number => {
  if (!logs || logs.length === 0) return 0
  const dates = new Set(logs.map((l) => l.date))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (dates.has(key)) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

const DashboardPage = () => {
  const { t } = useTranslation()
  const { data, isLoading, error, user } = useDashboard()

  if (isLoading) return <Loading />

  if (error) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8 }}>
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <ErrorOutlineIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight={600}>
            {t('dashboard.loadError')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('common.networkError')}
          </Typography>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            {t('common.reload')}
          </Button>
        </Paper>
      </Box>
    )
  }

  if (!data || !user) return null

  const streak = calcStreak(data.studyLogsPastYear)

  return (
    <>
      <PageHeader title={t('dashboard.pageTitle')} subtitle={t('dashboard.pageSubtitle', { name: user.name })} />

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <StatCard
          icon={<AccessTimeRoundedIcon />}
          value={t('dashboard.minutes', { value: Math.floor(data.totalPlayTime / 60) })}
          label={t('dashboard.totalPlayTime')}
        />
        <StatCard
          icon={<CheckCircleRoundedIcon />}
          value={data.totalQuestionsCleared}
          label={t('dashboard.totalCorrect')}
        />
        <StatCard
          icon={<LocalFireDepartmentRoundedIcon />}
          value={t('dashboard.days', { value: streak })}
          label={t('dashboard.streak')}
        />
      </Box>

      {/* Heatmap */}
      <Paper sx={{ p: 3, mb: 4, overflowX: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t('dashboard.calendarTitle')}
        </Typography>
        <CalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={(data.studyLogsPastYear || []).map((log) => ({
            date: log.date,
            count: log.studyTime,
          }))}
          classForValue={(value) => {
            if (!value) return 'color-empty'
            return `color-scale-${value.count}`
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) return null
            return { 'data-tip': t('dashboard.heatmapTooltip', { date: value.date, count: value.count }) }
          }}
        />
        <Tooltip />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
            {t('common.less')}
          </Typography>
          {colorScale.map((color, i) => (
            <Box
              key={i}
              sx={{ width: 14, height: 14, backgroundColor: color, mx: '2px', borderRadius: 0.5 }}
            />
          ))}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            {t('common.more')}
          </Typography>
        </Box>
      </Paper>

      {/* Recent sessions */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t('dashboard.recentSessions')}
      </Typography>
      {data.clearedSections.length === 0 ? (
        <EmptyState
          title={t('dashboard.noHistory')}
          description={t('dashboard.noHistoryDescription')}
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {data.clearedSections.map((section, index) => (
            <Paper key={index} sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 6,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: getScoreColor(section.correctAnswers),
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {section.sectionName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(section.clearedAt)}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: getScoreColor(section.correctAnswers) }}
              >
                {section.correctAnswers}/10
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </>
  )
}

export default DashboardPage
