import { Box, Typography } from '@mui/material'

interface ScoreRingProps {
  correct: number
  total: number
  size?: number
}

const ScoreRing = ({ correct, total, size = 140 }: ScoreRingProps) => {
  const percentage = total > 0 ? (correct / total) * 100 : 0
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage >= 80) return '#10B981'
    if (percentage >= 50) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, color: getColor(), lineHeight: 1 }}>
          {correct}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          / {total}
        </Typography>
      </Box>
    </Box>
  )
}

export default ScoreRing
