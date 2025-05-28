"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, BookOpen, Calendar, ExternalLink } from "lucide-react"
import { EnhancedJournalModal } from "@/components/enhanced-journal-modal"
import { CalendarSyncModal } from "@/components/calendar-sync-modal"

interface CalendarViewProps {
  userData: any
  onJournalUpdate?: (date: string, entry: any) => void
}

export function CalendarView({ userData, onJournalUpdate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showJournal, setShowJournal] = useState(false)
  const [showCalendarSync, setShowCalendarSync] = useState(false)

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getDayProgress = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    // Calculate progress based on completed tasks for that day
    let totalTasks = 0
    let completedTasks = 0

    Object.keys(userData.tasks || {}).forEach((category) => {
      const categoryTasks = userData.tasks[category] || []
      categoryTasks.forEach((task) => {
        if (task.scheduledDate === dateString) {
          totalTasks++
          if (task.completed) completedTasks++
        }
      })
    })

    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  }

  const hasExpeditionLog = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return userData.journalEntries && userData.journalEntries[dateString]
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const handleDayClick = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateString)
    setShowJournal(true)
  }

  const getExternalEvents = (day: number) => {
    // Mock external calendar events - in real app, this would come from synced calendars
    const mockEvents = [
      { title: "Team Meeting", time: "10:00 AM", source: "Google Calendar" },
      { title: "Training Session", time: "6:00 PM", source: "Apple Calendar" },
    ]

    // Return random events for demo purposes
    return Math.random() > 0.8 ? mockEvents.slice(0, Math.floor(Math.random() * 2) + 1) : []
  }

  return (
    <div className="space-y-4">
      {/* Calendar Sync Card */}
      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-forest-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-forest-600" />
                Expedition Calendar Integration
              </CardTitle>
              <CardDescription className="text-stone-600">
                Sync with your external calendars to see all events alongside your mountain journey
              </CardDescription>
            </div>
            <Button onClick={() => setShowCalendarSync(true)} className="bg-forest-600 text-white hover:bg-forest-700">
              <ExternalLink className="mr-2 h-4 w-4" />
              Sync Calendars
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-forest-100 text-forest-800 border-forest-200">
              Google Calendar - Connected
            </Badge>
            <Badge variant="secondary" className="bg-stone-100 text-stone-800 border-stone-200">
              Apple Calendar - Connected
            </Badge>
            <Badge variant="outline" className="border-stone-300 text-stone-600">
              Outlook - Not Connected
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Calendar */}
      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-forest-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <CardDescription className="text-stone-600">
                Track your daily expedition progress and log entries
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousMonth}
                className="border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextMonth}
                className="border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-stone-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="p-2 h-20"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const progress = getDayProgress(day)
              const today = isToday(day)
              const hasLog = hasExpeditionLog(day)
              const externalEvents = getExternalEvents(day)

              return (
                <div
                  key={day}
                  className={`p-2 h-20 border rounded-md cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    today
                      ? "border-forest-500 bg-forest-50 shadow-md"
                      : "border-forest-200 hover:bg-forest-25 hover:border-forest-300"
                  } touch-manipulation min-h-[80px]`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${today ? "text-forest-700" : "text-forest-800"}`}>
                        {day}
                      </span>
                      <div className="flex gap-1">
                        {hasLog && <div className="w-2 h-2 bg-forest-600 rounded-full" title="Expedition log entry" />}
                        {externalEvents.length > 0 && (
                          <div className="w-2 h-2 bg-earth-600 rounded-full" title="External events" />
                        )}
                      </div>
                    </div>

                    {externalEvents.length > 0 && (
                      <div className="flex-1 mt-1">
                        {externalEvents.slice(0, 2).map((event, idx) => (
                          <div key={idx} className="text-xs text-stone-600 truncate">
                            {event.title}
                          </div>
                        ))}
                        {externalEvents.length > 2 && (
                          <div className="text-xs text-stone-500">+{externalEvents.length - 2} more</div>
                        )}
                      </div>
                    )}

                    <div className="mt-auto">
                      <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-forest-500 to-forest-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Legend */}
      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-forest-600 rounded-full" />
              <span className="text-forest-800">Expedition Log</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-earth-600 rounded-full" />
              <span className="text-forest-800">External Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-gradient-to-r from-forest-500 to-forest-600 rounded-full" />
              <span className="text-forest-800">Daily Climb Progress</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-forest-800">Recent Expedition Logs</CardTitle>
            <CardDescription className="text-stone-600">Your latest mountain reflections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(userData.journalEntries || {})
                .slice(-5)
                .map(([date, entry]: [string, any]) => (
                  <div key={date} className="p-3 bg-forest-50 rounded-md border border-forest-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-forest-800">{new Date(date).toLocaleDateString()}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDate(date)
                          setShowJournal(true)
                        }}
                        className="text-forest-600 hover:bg-forest-100"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </div>
                    {entry.weather && (
                      <p className="text-xs text-stone-600 mt-1">
                        Weather: {WEATHER_OPTIONS.find((w) => w.value === entry.weather)?.label || entry.weather}
                      </p>
                    )}
                  </div>
                ))}

              {Object.keys(userData.journalEntries || {}).length === 0 && (
                <p className="text-stone-600 text-center py-4">No expedition logs yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-forest-800">Climbing Streaks</CardTitle>
            <CardDescription className="text-stone-600">Your consistency tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest-800">Daily expedition logging</span>
                <span className="text-sm font-medium text-forest-600">
                  {Object.keys(userData.journalEntries || {}).length} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest-800">Task completion</span>
                <span className="text-sm font-medium text-forest-600">12 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest-800">Summit progress</span>
                <span className="text-sm font-medium text-forest-600">8 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {selectedDate && (
        <EnhancedJournalModal
          isOpen={showJournal}
          onClose={() => {
            setShowJournal(false)
            setSelectedDate(null)
          }}
          date={selectedDate}
        />
      )}

      <CalendarSyncModal isOpen={showCalendarSync} onClose={() => setShowCalendarSync(false)} />
    </div>
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
