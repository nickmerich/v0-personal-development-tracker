"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Settings, FolderSyncIcon as Sync, ChevronLeft, ChevronRight } from "lucide-react"
import { calendarService, type CalendarEvent, type CalendarProvider } from "@/lib/calendar-integration"

interface IntegratedCalendarViewProps {
  userData?: any
  onTaskUpdate?: (taskId: string, updates: any) => void
}

export function IntegratedCalendarView({ userData, onTaskUpdate }: IntegratedCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [providers, setProviders] = useState<CalendarProvider[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    loadCalendarData()
  }, [])

  useEffect(() => {
    loadEventsForMonth()
  }, [currentDate])

  const loadCalendarData = async () => {
    try {
      const providerList = calendarService.getProviders()
      setProviders(providerList)
    } catch (error) {
      console.error("Error loading calendar data:", error)
    }
  }

  const loadEventsForMonth = () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      const monthEvents = calendarService.getEvents(startOfMonth, endOfMonth)
      setEvents(monthEvents)
    } catch (error) {
      console.error("Error loading events:", error)
    }
  }

  const handleSync = async () => {
    setIsLoading(true)
    try {
      await calendarService.syncAllCalendars()
      await loadCalendarData()
      loadEventsForMonth()
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const connectedProviders = providers.filter((p) => p.connected)

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-forest-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-forest-600" />
                Integrated Calendar
              </CardTitle>
              <CardDescription className="text-stone-600">
                Your unified view of all calendar events and tasks
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isLoading}
                className="border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                <Sync className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Sync
              </Button>
              <Button variant="outline" size="sm" className="border-forest-300 text-forest-600 hover:bg-forest-50">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {connectedProviders.map((provider) => (
              <Badge key={provider.id} variant="secondary" className="bg-forest-100 text-forest-800">
                {provider.icon} {provider.name}
              </Badge>
            ))}
            {connectedProviders.length === 0 && (
              <Badge variant="outline" className="border-stone-300 text-stone-600">
                No calendars connected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-forest-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <CardDescription className="text-stone-600">{events.length} events this month</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousMonth}
                className="border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextMonth}
                className="border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-stone-600">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-stone-400" />
            <p>Calendar view will be implemented here</p>
            <p className="text-sm mt-2">
              {events.length > 0 ? `${events.length} events loaded` : "No events for this month"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
