export const formatDate = (clearedAt: string): string => {
  const date = new Date(clearedAt)
  date.setHours(date.getHours() + 9)
  const formattedDate = date.toISOString().split('T')[0]
  const formattedTime = date.toISOString().split('T')[1].split(':').slice(0, 2).join(':')
  return `${formattedDate} ${formattedTime}`
}
