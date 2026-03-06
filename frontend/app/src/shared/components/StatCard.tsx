import { Box, Paper, Typography } from '@mui/material'

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
}

const StatCard = ({ icon, value, label }: StatCardProps) => (
  <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </Paper>
)

export default StatCard
