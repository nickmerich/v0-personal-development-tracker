"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Settings,
  FolderSyncIcon as Sync,
  ExternalLink,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Wifi,
} from "lucide-react"
import { calendarService, type CalendarEvent, type CalendarProvider } from "@/lib/calendar-integration"

interface IntegratedCalendarViewProps {
  userData: any
  onTaskUpdate?: (taskId: string, updates: any) => void
}

export function IntegratedCalendarView({ userData, onTaskUpdate }: IntegratedCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [providers, setProviders] = useState<CalendarProvider[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

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

  useEffect(() => {
    loadCalendarData()
    const interval = setInterval(loadCalendarData, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Load events for current month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const monthEvents = calendarService.getEvents(startOfMonth, endOfMonth)
    setEvents(monthEvents)
  }, [currentDate])

  const loadCalendarData = async () => {
    setProviders(calendarService.getProviders())
    setLastSync(new Date())
  }

  const handleSync = async () => {
    setIsLoading(true)
    try {
      await calendarService.syncAllCalendars()
      await loadCalendarData()

      // Refresh events
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      const monthEvents = calendarService.getEvents(startOfMonth, endOfMonth)
      setEvents(monthEvents)

      setLastSync(new Date())
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderConnect = async (providerId: string) => {
    setIsLoading(true)
    try {
      let success = false

      switch (providerId) {
        case "google":
          success = await calendarService.connectGoogleCalendar()
          break
        case "outlook":
          success = await calendarService.connectOutlookCalendar()
          break
        case "apple":
          // For Apple, we'd need credentials
          success = await calendarService.connectAppleCalendar("user@icloud.com", "app-password")
          break
      }

      if (success) {
        await loadCalendarData()
        await handleSync()
      }
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderDisconnect = async (providerId: string) => {
    await calendarService.disconnectProvider(providerId)
    await loadCalendarData()

    // Refresh events
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const monthEvents = calendarService.getEvents(startOfMonth, endOfMonth)
    setEvents(monthEvents)
  }

  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  }

  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return calendarService.getEventsForDay(date)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDayClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(date)
    const dayEvents = getEventsForDay(day)
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0])
      setShowEventDetails(true)
    }
  }

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "google":
        return "🔵"
      case "outlook":
        return "🔷"
      case "apple":
        return "🍎"
      default:
        return "📅"
    }
  }

  const connectedProviders = providers.filter((p) => p.connected)
  const disconnectedProviders = providers.filter((p) => !p.connected)

  return (
    <div className="space-y-6">
      {/* Calendar Integration Status */}
      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-forest-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-forest-600" />
                Integrated Calendar
              </CardTitle>
              <CardDescription className="text-stone-600">
                Your unified view of all calendar events and Gryt tasks
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {connectedProviders.map((provider) => (
              <Badge key={provider.id} variant="secondary" className="bg-forest-100 text-forest-800 border-forest-200">
                {getProviderIcon(provider.id)} {provider.name} - Connected
              </Badge>
            ))}
            {connectedProviders.length === 0 && (
              <Badge variant="outline" className="border-stone-300 text-stone-600">
                No calendars connected
              </Badge>
            )}
          </div>

          {lastSync && (
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Wifi className="h-4 w-4" />
              Last synced: {lastSync.toLocaleTimeString()}
            </div>
          )}
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
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-stone-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: getFirstDayOfMonth() }, (_, i) => (
              <div key={`empty-${i}`} className="p-2 h-24"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: getDaysInMonth() }, (_, i) => {
              const day = i + 1
              const dayEvents = getEventsForDay(day)
              const today = isToday(day)

              return (
                <div
                  key={day}
                  className={`p-2 h-24 border rounded-md cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    today
                      ? "border-forest-500 bg-forest-50 shadow-md"
                      : "border-forest-200 hover:bg-forest-25 hover:border-forest-300"
                  } touch-manipulation`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${today ? "text-forest-700" : "text-forest-800"}`}>
                        {day}
                      </span>
                      {dayEvents.length > 0 && <div className="w-2 h-2 bg-forest-600 rounded-full" />}
                    </div>

                    <div className="flex-1 mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <div
                          key={idx}
                          className="text-xs p-1 rounded truncate"
                          style={{ backgroundColor: event.color + "20", color: event.color }}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-stone-500">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-forest-800">Upcoming Events</CardTitle>
            <CardDescription className="text-stone-600">Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .filter(
                  (event) => event.start >= new Date() && event.start <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                )
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-forest-50 rounded-md border border-forest-200 cursor-pointer hover:bg-forest-100 transition-colors"
                    onClick={() => {
                      setSelectedEvent(event)
                      setShowEventDetails(true)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                        <span className="font-medium text-forest-800">{event.title}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getProviderIcon(event.source)} {event.source}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-stone-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.start.toLocaleDateString()} at{" "}
                        {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {events.length === 0 && <p className="text-stone-600 text-center py-4">No upcoming events</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-forest-800">Calendar Stats</CardTitle>
            <CardDescription className="text-stone-600">This month's overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest-800">Total Events</span>
                <span className="text-sm font-medium text-forest-600">{events.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest-800">Gryt Tasks</span>
                <span className="text-sm font-medium text-forest-600">
                  {events.filter((e) => e.source === "gryt").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest-800">External Events</span>
                <span className="text-sm font-medium text-forest-600">
                  {events.filter((e) => e.source !== "gryt").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest-800">Connected Calendars</span>
                <span className="text-sm font-medium text-forest-600">{connectedProviders.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-white border-forest-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-forest-800 flex items-center gap-2">
              <Settings className="h-5 w-5 text-forest-600" />
              Calendar Integration Settings
            </DialogTitle>
            <DialogDescription className="text-stone-600">
              Connect and manage your external calendar integrations
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="providers">Calendar Providers</TabsTrigger>
              <TabsTrigger value="sync">Sync Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="providers" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-forest-800">Connected Calendars</h3>
                {connectedProviders.map((provider) => (
                  <Card key={provider.id} className="border-forest-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getProviderIcon(provider.id)}</div>
                          <div>
                            <h4 className="font-medium text-forest-800">{provider.name}</h4>
                            <p className="text-sm text-stone-600">
                              Last synced: {provider.lastSync?.toLocaleString() || "Never"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProviderDisconnect(provider.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <h3 className="text-lg font-semibold text-forest-800 pt-4">Available Calendars</h3>
                {disconnectedProviders.map((provider) => (
                  <Card key={provider.id} className="border-forest-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getProviderIcon(provider.id)}</div>
                          <div>
                            <h4 className="font-medium text-forest-800">{provider.name}</h4>
                            <p className="text-sm text-stone-600">Connect to sync events and tasks</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleProviderConnect(provider.id)}
                          disabled={isLoading}
                          className="bg-forest-600 text-white hover:bg-forest-700"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sync" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-forest-800">Synchronization Settings</h3>

                <Card className="border-forest-200">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-forest-800">Auto Sync</h4>
                        <p className="text-sm text-stone-600">Automatically sync calendars every 15 minutes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-forest-800">Export Gryt Tasks</h4>
                        <p className="text-sm text-stone-600">Add your Gryt tasks to external calendars</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-forest-800">Import External Events</h4>
                        <p className="text-sm text-stone-600">Show external calendar events in Gryt</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-forest-800">Sync Notifications</h4>
                        <p className="text-sm text-stone-600">Get notified when sync completes or fails</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Close
            </Button>
            <Button className="bg-forest-600 text-white hover:bg-forest-700">Save Settings</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="bg-white border-forest-200">
          <DialogHeader>
            <DialogTitle className="text-forest-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-forest-600" />
              Event Details
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-forest-800">{selectedEvent.title}</h3>
                {selectedEvent.description && <p className="text-stone-600 mt-1">{selectedEvent.description}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-stone-500" />
                  <span className="text-sm">
                    {selectedEvent.start.toLocaleDateString()} at{" "}
                    {selectedEvent.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {selectedEvent.end &&
                      ` - ${selectedEvent.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-stone-500" />
                    <span className="text-sm">{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-stone-500" />
                    <span className="text-sm">{selectedEvent.attendees.join(", ")}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedEvent.color }} />
                  <span className="text-sm capitalize">{selectedEvent.source} Calendar</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEventDetails(false)}>
                  Close
                </Button>
                {selectedEvent.source === "gryt" && (
                  <Button className="bg-forest-600 text-white hover:bg-forest-700">Edit Task</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
