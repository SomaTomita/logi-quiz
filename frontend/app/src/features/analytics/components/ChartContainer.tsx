import { Box, Paper, Typography, Skeleton } from '@mui/material'

interface ChartContainerProps {
  title: string
  subtitle?: string
  isLoading?: boolean
  children: React.ReactNode
  height?: number
}

const ChartContainer = ({ title, subtitle, isLoading, children, height = 300 }: ChartContainerProps) => (
  <Paper sx={{ p: 3 }}>
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    {isLoading ? (
      <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 2 }} />
    ) : (
      children
    )}
  </Paper>
)

export default ChartContainer
