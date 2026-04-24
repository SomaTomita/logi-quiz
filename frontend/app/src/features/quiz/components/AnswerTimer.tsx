import { useEffect, useState, useRef } from 'react'
import { LinearProgress, Box } from '@mui/material'

interface AnswerTimerProps {
  duration: number
  onTimeUp: () => void
}

const AnswerTimer = ({ duration, onTimeUp }: AnswerTimerProps) => {
  const [counter, setCounter] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCounter((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (counter >= duration) {
      clearInterval(intervalRef.current)
      setTimeout(onTimeUp, 100)
    }
  }, [counter, duration, onTimeUp])

  const progress = (counter / duration) * 100
  const isWarning = counter >= duration - 2

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
      <LinearProgress
        variant="determinate"
        value={Math.min(progress, 100)}
        sx={{
          height: 5,
          '& .MuiLinearProgress-bar': {
            backgroundColor: isWarning ? 'error.main' : 'primary.main',
            transition: 'width 1s linear',
          },
          backgroundColor: 'transparent',
        }}
      />
    </Box>
  )
}

export default AnswerTimer
