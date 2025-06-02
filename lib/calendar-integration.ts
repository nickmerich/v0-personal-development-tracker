interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  source: "google" | "outlook" | "apple" | "gryt"
  color?: string
  location?: string
  attendees?: string[]
}

interface CalendarProvider {
  id: string
  name: string
  connected: boolean
  lastSync?: Date
  syncEnabled: boolean
}

class CalendarIntegrationService {
  private providers: Map<string, CalendarProvider> = new Map()
  private events: CalendarEvent[] = []
  private syncInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeProviders()
    this.startAutoSync()
  }

  private initializeProviders() {
    const defaultProviders: CalendarProvider[] = [
      {
        id: "google",
        name: "Google Calendar",
        connected: false,
        syncEnabled: true,
      },
      {
        id: "outlook",
        name: "Microsoft Outlook",
        connected: false,
        syncEnabled: true,
      },
      {
        id: "apple",
        name: "Apple Calendar",
        connected: false,
        syncEnabled: true,
      },
    ]

    defaultProviders.forEach((provider) => {
      this.providers.set(provider.id, provider)
    })
  }

  // Google Calendar Integration
  async connectGoogleCalendar(): Promise<boolean> {
    try {
      // In a real implementation, this would use Google Calendar API
      const response = await this.initiateOAuthFlow("google", {
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: `${window.location.origin}/api/calendar/google/callback`,
        scope: "https://www.googleapis.com/auth/calendar.readonly",
      })

      if (response.success) {
        const provider = this.providers.get("google")!
        provider.connected = true
        provider.lastSync = new Date()
        this.providers.set("google", provider)

        await this.syncGoogleCalendar()
        return true
      }
      return false
    } catch (error) {
      console.error("Google Calendar connection failed:", error)
      return false
    }
  }

  private async syncGoogleCalendar(): Promise<CalendarEvent[]> {
    try {
      // Mock Google Calendar events for demo
      const mockEvents: CalendarEvent[] = [
        {
          id: "google-1",
          title: "Team Meeting",
          description: "Weekly team sync",
          start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
          source: "google",
          color: "#4285f4",
          location: "Conference Room A",
        },
        {
          id: "google-2",
          title: "Workout Session",
          start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // +1.5 hours
          source: "google",
          color: "#34a853",
        },
      ]

      // In real implementation, fetch from Google Calendar API
      this.addEvents(mockEvents)
      return mockEvents
    } catch (error) {
      console.error("Google Calendar sync failed:", error)
      return []
    }
  }

  // Microsoft Outlook Integration
  async connectOutlookCalendar(): Promise<boolean> {
    try {
      const response = await this.initiateOAuthFlow("outlook", {
        clientId: process.env.MICROSOFT_CLIENT_ID,
        redirectUri: `${window.location.origin}/api/calendar/outlook/callback`,
        scope: "https://graph.microsoft.com/calendars.read",
      })

      if (response.success) {
        const provider = this.providers.get("outlook")!
        provider.connected = true
        provider.lastSync = new Date()
        this.providers.set("outlook", provider)

        await this.syncOutlookCalendar()
        return true
      }
      return false
    } catch (error) {
      console.error("Outlook Calendar connection failed:", error)
      return false
    }
  }

  private async syncOutlookCalendar(): Promise<CalendarEvent[]> {
    try {
      // Mock Outlook events for demo
      const mockEvents: CalendarEvent[] = [
        {
          id: "outlook-1",
          title: "Client Presentation",
          description: "Q4 Results Presentation",
          start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          source: "outlook",
          color: "#0078d4",
          attendees: ["client@company.com"],
        },
      ]

      this.addEvents(mockEvents)
      return mockEvents
    } catch (error) {
      console.error("Outlook Calendar sync failed:", error)
      return []
    }
  }

  // Apple Calendar Integration (via CalDAV)
  async connectAppleCalendar(username: string, password: string): Promise<boolean> {
    try {
      // In real implementation, use CalDAV protocol
      const response = await this.connectCalDAV({
        server: "caldav.icloud.com",
        username,
        password,
        port: 443,
        protocol: "https",
      })

      if (response.success) {
        const provider = this.providers.get("apple")!
        provider.connected = true
        provider.lastSync = new Date()
        this.providers.set("apple", provider)

        await this.syncAppleCalendar()
        return true
      }
      return false
    } catch (error) {
      console.error("Apple Calendar connection failed:", error)
      return false
    }
  }

  private async syncAppleCalendar(): Promise<CalendarEvent[]> {
    try {
      // Mock Apple Calendar events
      const mockEvents: CalendarEvent[] = [
        {
          id: "apple-1",
          title: "Doctor Appointment",
          start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
          source: "apple",
          color: "#007aff",
          location: "Medical Center",
        },
      ]

      this.addEvents(mockEvents)
      return mockEvents
    } catch (error) {
      console.error("Apple Calendar sync failed:", error)
      return []
    }
  }

  // Generic OAuth flow handler
  private async initiateOAuthFlow(provider: string, config: any): Promise<{ success: boolean; token?: string }> {
    return new Promise((resolve) => {
      // Mock OAuth flow - in real implementation, open popup or redirect
      const authWindow = window.open(
        `/api/calendar/${provider}/auth?${new URLSearchParams(config)}`,
        "calendar-auth",
        "width=500,height=600,scrollbars=yes,resizable=yes",
      )

      // Listen for auth completion
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed)
          // In real implementation, check for auth token
          resolve({ success: true, token: "mock-token" })
        }
      }, 1000)

      // Timeout after 5 minutes
      setTimeout(
        () => {
          clearInterval(checkClosed)
          authWindow?.close()
          resolve({ success: false })
        },
        5 * 60 * 1000,
      )
    })
  }

  // CalDAV connection for Apple Calendar
  private async connectCalDAV(config: any): Promise<{ success: boolean }> {
    // Mock CalDAV connection
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  }

  // Event management
  addEvents(events: CalendarEvent[]) {
    events.forEach((event) => {
      const existingIndex = this.events.findIndex((e) => e.id === event.id)
      if (existingIndex >= 0) {
        this.events[existingIndex] = event
      } else {
        this.events.push(event)
      }
    })
  }

  // Create Gryt task as calendar event
  async createGrytEvent(task: any): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      id: `gryt-${task.id}`,
      title: task.title,
      description: task.description,
      start: new Date(task.scheduledDate || Date.now()),
      end: new Date((task.scheduledDate || Date.now()) + 60 * 60 * 1000), // 1 hour default
      source: "gryt",
      color: "#16a34a",
    }

    this.addEvents([event])

    // Optionally sync to external calendars
    await this.exportToConnectedCalendars(event)

    return event
  }

  // Export Gryt events to connected calendars
  private async exportToConnectedCalendars(event: CalendarEvent) {
    const connectedProviders = Array.from(this.providers.values()).filter((p) => p.connected)

    for (const provider of connectedProviders) {
      try {
        switch (provider.id) {
          case "google":
            await this.exportToGoogleCalendar(event)
            break
          case "outlook":
            await this.exportToOutlookCalendar(event)
            break
          case "apple":
            await this.exportToAppleCalendar(event)
            break
        }
      } catch (error) {
        console.error(`Failed to export to ${provider.name}:`, error)
      }
    }
  }

  private async exportToGoogleCalendar(event: CalendarEvent) {
    // Implementation for Google Calendar API
    console.log("Exporting to Google Calendar:", event.title)
  }

  private async exportToOutlookCalendar(event: CalendarEvent) {
    // Implementation for Microsoft Graph API
    console.log("Exporting to Outlook Calendar:", event.title)
  }

  private async exportToAppleCalendar(event: CalendarEvent) {
    // Implementation for CalDAV
    console.log("Exporting to Apple Calendar:", event.title)
  }

  // Sync all connected calendars
  async syncAllCalendars(): Promise<void> {
    const connectedProviders = Array.from(this.providers.values()).filter((p) => p.connected && p.syncEnabled)

    for (const provider of connectedProviders) {
      try {
        switch (provider.id) {
          case "google":
            await this.syncGoogleCalendar()
            break
          case "outlook":
            await this.syncOutlookCalendar()
            break
          case "apple":
            await this.syncAppleCalendar()
            break
        }

        provider.lastSync = new Date()
        this.providers.set(provider.id, provider)
      } catch (error) {
        console.error(`Sync failed for ${provider.name}:`, error)
      }
    }
  }

  // Auto-sync every 15 minutes
  private startAutoSync() {
    this.syncInterval = setInterval(
      () => {
        this.syncAllCalendars()
      },
      15 * 60 * 1000,
    ) // 15 minutes
  }

  // Get events for a specific date range
  getEvents(startDate: Date, endDate: Date): CalendarEvent[] {
    return this.events
      .filter((event) => event.start >= startDate && event.start <= endDate)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  }

  // Get events for a specific day
  getEventsForDay(date: Date): CalendarEvent[] {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return this.getEvents(startOfDay, endOfDay)
  }

  // Get provider status
  getProviders(): CalendarProvider[] {
    return Array.from(this.providers.values())
  }

  // Disconnect a provider
  async disconnectProvider(providerId: string): Promise<boolean> {
    const provider = this.providers.get(providerId)
    if (provider) {
      provider.connected = false
      provider.lastSync = undefined
      this.providers.set(providerId, provider)

      // Remove events from this provider
      this.events = this.events.filter((event) => event.source !== providerId)

      return true
    }
    return false
  }

  // Cleanup
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
  }
}

export const calendarService = new CalendarIntegrationService()
export type { CalendarEvent, CalendarProvider }
