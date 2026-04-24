import { Box } from '@mui/material'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PercentRoundedIcon from '@mui/icons-material/PercentRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import { useTranslation } from 'react-i18next'
import StatCard from '@/shared/components/StatCard'
import type { AnalyticsOverview } from '../types'

interface OverviewKpisProps {
  data: AnalyticsOverview
}

const OverviewKpis = ({ data }: OverviewKpisProps) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      <StatCard
        icon={<PeopleRoundedIcon />}
        value={data.activeUsers30d}
        label={t('analytics.activeUsers30d')}
      />
      <StatCard
        icon={<PercentRoundedIcon />}
        value={`${data.overallAccuracy}%`}
        label={t('analytics.overallAccuracy')}
      />
      <StatCard
        icon={<SpeedRoundedIcon />}
        value={data.avgResponseTimeMs ? `${(data.avgResponseTimeMs / 1000).toFixed(1)}s` : '-'}
        label={t('analytics.avgResponseTime')}
      />
      <StatCard
        icon={<EmojiEventsRoundedIcon />}
        value={`${data.masteryRate}%`}
        label={t('analytics.masteryRate')}
      />
    </Box>
  )
}

export default OverviewKpis
