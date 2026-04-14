import { Box } from '@mui/material'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import PercentRoundedIcon from '@mui/icons-material/PercentRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import StatCard from '@/shared/components/StatCard'
import type { AnalyticsOverview } from '../types'

interface OverviewKpisProps {
  data: AnalyticsOverview
}

const OverviewKpis = ({ data }: OverviewKpisProps) => (
  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
    <StatCard
      icon={<PeopleRoundedIcon />}
      value={data.activeUsers30d}
      label="30日間アクティブユーザー"
    />
    <StatCard
      icon={<PercentRoundedIcon />}
      value={`${data.overallAccuracy}%`}
      label="総合正答率"
    />
    <StatCard
      icon={<SpeedRoundedIcon />}
      value={data.avgResponseTimeMs ? `${(data.avgResponseTimeMs / 1000).toFixed(1)}s` : '-'}
      label="平均回答時間"
    />
    <StatCard
      icon={<EmojiEventsRoundedIcon />}
      value={`${data.masteryRate}%`}
      label="習得率 (Box 4)"
    />
  </Box>
)

export default OverviewKpis
