import { memo, type ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

interface SessionTopBarProps {
  currentIndex: number
  totalCount: number
  onExit: () => void
  /** Slot for right side (e.g. timer or badge) */
  rightSlot?: ReactNode
  /** Slot for center badge (e.g. "復習" chip) */
  centerExtra?: ReactNode
}

const SessionTopBar = memo(
  ({ currentIndex, totalCount, onExit, rightSlot, centerExtra }: SessionTopBarProps) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        py: 2,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        bgcolor: 'background.paper',
      }}
    >
      <Button
        startIcon={<CloseRoundedIcon />}
        onClick={onExit}
        sx={{ color: 'text.secondary', fontWeight: 600 }}
      >
        退出
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {centerExtra}
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          {currentIndex + 1} / {totalCount}
        </Typography>
      </Box>
      {rightSlot ?? <Box sx={{ width: 52 }} />}
    </Box>
  ),
)

SessionTopBar.displayName = 'SessionTopBar'

export default SessionTopBar
