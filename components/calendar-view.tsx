"use client"
import { IntegratedCalendarView } from "@/components/integrated-calendar-view"

interface CalendarViewProps {
  userData: any
  onJournalUpdate?: (date: string, entry: any) => void
}

export function CalendarView({ userData, onJournalUpdate }: CalendarViewProps) {
  return (
    <IntegratedCalendarView
      userData={userData}
      onTaskUpdate={(taskId, updates) => {
        // Handle task updates
        console.log("Task updated:", taskId, updates)
      }}
    />
  )
}

// Weather options for the calendar view
const WEATHER_OPTIONS = [
  { value: "summit", label: "Summit Weather", emoji: "🏔️", color: "text-forest-600" },
  { value: "clear", label: "Clear Skies", emoji: "☀️", color: "text-earth-600" },
  { value: "partly_cloudy", label: "Partly Cloudy", emoji: "⛅", color: "text-stone-600" },
  { value: "overcast", label: "Overcast", emoji: "☁️", color: "text-stone-500" },
  { value: "stormy", label: "Stormy", emoji: "⛈️", color: "text-stone-700" },
  { value: "foggy", label: "Foggy", emoji: "🌫️", color: "text-stone-600" },
]
