import { Box, Typography, Button } from '@mui/material'
import InboxRoundedIcon from '@mui/icons-material/InboxRounded'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState = ({ icon, title, description, actionLabel, onAction }: EmptyStateProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 3,
      textAlign: 'center',
    }}
  >
    <Box sx={{ color: 'text.secondary', mb: 2, opacity: 0.5 }}>
      {icon ?? <InboxRoundedIcon sx={{ fontSize: 56 }} />}
    </Box>
    <Typography variant="h5" sx={{ mb: 1 }}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360 }}>
        {description}
      </Typography>
    )}
    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
)

export default EmptyState
