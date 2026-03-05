declare module 'react-calendar-heatmap' {
  import { ComponentType } from 'react'

  interface CalendarHeatmapValue {
    date: string
    count?: number
    [key: string]: unknown
  }

  interface CalendarHeatmapProps {
    startDate: Date
    endDate: Date
    values: CalendarHeatmapValue[]
    classForValue?: (value: CalendarHeatmapValue | null) => string
    tooltipDataAttrs?: (value: CalendarHeatmapValue | null) => Record<string, string> | null
    showWeekdayLabels?: boolean
    horizontal?: boolean
    gutterSize?: number
    onClick?: (value: CalendarHeatmapValue) => void
  }

  const CalendarHeatmap: ComponentType<CalendarHeatmapProps>
  export default CalendarHeatmap
}
