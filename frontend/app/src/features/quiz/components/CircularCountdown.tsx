import { useEffect, useState, useRef } from 'react'
import { Box, Typography } from '@mui/material'

interface CircularCountdownProps {
  duration: number
  onTimeUp: () => void
}

const SIZE = 52
const STROKE_WIDTH = 4
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = Math.round(2 * Math.PI * RADIUS * 100) / 100

const CircularCountdown = ({ duration, onTimeUp }: CircularCountdownProps) => {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (elapsed >= duration) {
      clearInterval(intervalRef.current)
      setTimeout(onTimeUp, 100)
    }
  }, [elapsed, duration, onTimeUp])

  const remaining = Math.max(Math.ceil(duration - elapsed), 0)
  const progress = Math.min(elapsed / duration, 1)
  const offset = CIRCUMFERENCE * progress

  const getColor = () => {
    if (remaining <= 2) return '#EF4444'
    if (remaining <= 5) return '#F59E0B'
    return '#4F46E5'
  }

  const color = getColor()

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={STROKE_WIDTH}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, color, fontSize: '0.9rem' }}>
          {remaining}
        </Typography>
      </Box>
    </Box>
  )
}

export default CircularCountdown
