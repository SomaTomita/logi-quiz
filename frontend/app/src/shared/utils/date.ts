export const formatDate = (clearedAt: string): string => {
  const date = new Date(clearedAt)
  const formatted = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  }).format(date)
  // "2024/01/15 14:30" → "2024-01-15 14:30"
  return formatted.replace(/\//g, '-')
}
