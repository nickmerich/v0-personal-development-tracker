"use client"

// lib/calendar-integration.ts

// This file will contain functions for integrating with various calendar services.
// For example, Google Calendar, Outlook Calendar, etc.

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  source: "gryt" | "google" | "outlook" | "apple"
  color?: string
  location?: string
}

export interface CalendarProvider {
  id: string
  name: string
  connected: boolean
  color: string
  icon: string
}

export class CalendarIntegrationService {
  private providers: CalendarProvider[] = [
    { id: "gryt", name: "The Gryt", connected: true, color: "#16a34a", icon: "🏔️" },
    { id: "google", name: "Google Calendar", connected: false, color: "#4285f4", icon: "📅" },
    { id: "outlook", name: "Outlook", connected: false, color: "#0078d4", icon: "📧" },
    { id: "apple", name: "Apple Calendar", connected: false, color: "#007aff", icon: "🍎" },
  ]

  private events: CalendarEvent[] = []

  // Get all providers
  getProviders(): CalendarProvider[] {
    return [...this.providers]
  }

  // Get connected providers
  getConnectedProviders(): CalendarProvider[] {
    return this.providers.filter((p) => p.connected)
  }

  // Connect a provider
  async connectProvider(providerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate connection process
      const provider = this.providers.find((p) => p.id === providerId)
      if (!provider) {
        return { success: false, error: "Provider not found" }
      }

      // In real implementation, this would handle OAuth flow
      switch (providerId) {
        case "google":
          return await this.connectGoogleCalendar()
        case "outlook":
          return await this.connectOutlookCalendar()
        case "apple":
          return await this.connectAppleCalendar()
        default:
          return { success: false, error: "Unsupported provider" }
      }
    } catch (error) {
      console.error(`Error connecting ${providerId}:`, error)
      return { success: false, error: "Connection failed" }
    }
  }

  // Disconnect a provider
  async disconnectProvider(providerId: string): Promise<boolean> {
    try {
      const provider = this.providers.find((p) => p.id === providerId)
      if (provider) {
        provider.connected = false
        // Remove events from this provider
        this.events = this.events.filter((e) => e.source !== providerId)
        return true
      }
      return false
    } catch (error) {
      console.error(`Error disconnecting ${providerId}:`, error)
      return false
    }
  }

  // Google Calendar connection
  private async connectGoogleCalendar(): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock implementation - in real app, use Google Calendar API
      const provider = this.providers.find((p) => p.id === "google")
      if (provider) {
        provider.connected = true

        // Add mock events
        const mockEvents: CalendarEvent[] = [
          {
            id: "google-1",
            title: "Team Meeting",
            start: new Date(Date.now() + 24 * 60 * 60 * 1000),
            end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
            source: "google",
            color: "#4285f4",
            description: "Weekly team sync",
          },
        ]

        this.events.push(...mockEvents)
        return { success: true }
      }
      return { success: false, error: "Provider not found" }
    } catch (error) {
      return { success: false, error: "Google Calendar connection failed" }
    }
  }

  // Outlook Calendar connection
  private async connectOutlookCalendar(): Promise<{ success: boolean; error?: string }> {
    try {
      const provider = this.providers.find((p) => p.id === "outlook")
      if (provider) {
        provider.connected = true
        return { success: true }
      }
      return { success: false, error: "Provider not found" }
    } catch (error) {
      return { success: false, error: "Outlook Calendar connection failed" }
    }
  }

  // Apple Calendar connection
  private async connectAppleCalendar(): Promise<{ success: boolean; error?: string }> {
    try {
      const provider = this.providers.find((p) => p.id === "apple")
      if (provider) {
        provider.connected = true
        return { success: true }
      }
      return { success: false, error: "Provider not found" }
    } catch (error) {
      return { success: false, error: "Apple Calendar connection failed" }
    }
  }

  // Get events for date range
  getEvents(startDate: Date, endDate: Date): CalendarEvent[] {
    return this.events
      .filter((event) => event.start >= startDate && event.start <= endDate)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  }

  // Get events for specific day
  getEventsForDay(date: Date): CalendarEvent[] {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return this.getEvents(startOfDay, endOfDay)
  }

  // Create event
  async createEvent(eventData: Omit<CalendarEvent, "id">): Promise<{ success: boolean; error?: string }> {
    try {
      const event: CalendarEvent = {
        ...eventData,
        id: `${eventData.source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }

      this.events.push(event)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to create event" }
    }
  }

  // Sync all calendars
  async syncAllCalendars(): Promise<{ success: boolean; error?: string }> {
    try {
      const connectedProviders = this.getConnectedProviders()

      for (const provider of connectedProviders) {
        if (provider.id !== "gryt") {
          // In real implementation, sync with external calendar
          console.log(`Syncing ${provider.name}...`)
        }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Sync failed" }
    }
  }
}

// Export singleton instance
export const calendarService = new CalendarIntegrationService()
