"use client"

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  source: "gryt" | "google" | "outlook" | "apple"
  color?: string
}

export interface CalendarProvider {
  id: string
  name: string
  connected: boolean
  color: string
}

export class CalendarIntegration {
  private providers: CalendarProvider[] = [
    { id: "gryt", name: "The Gryt", connected: true, color: "#16a34a" },
    { id: "google", name: "Google Calendar", connected: false, color: "#4285f4" },
    { id: "outlook", name: "Outlook", connected: false, color: "#0078d4" },
    { id: "apple", name: "Apple Calendar", connected: false, color: "#007aff" },
  ]

  async getProviders(): Promise<CalendarProvider[]> {
    return this.providers
  }

  async connectProvider(providerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/calendar/${providerId}/auth`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        const provider = this.providers.find((p) => p.id === providerId)
        if (provider) {
          provider.connected = true
        }
        return { success: true }
      } else {
        return { success: false, error: "Failed to connect calendar" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  async syncEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await fetch("/api/calendar/sync", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        return data.events || []
      } else {
        return []
      }
    } catch (error) {
      console.error("Error syncing events:", error)
      return []
    }
  }

  async createEvent(event: Omit<CalendarEvent, "id">): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/calendar/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
        credentials: "include",
      })

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: "Failed to create event" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }
}

export const calendarIntegration = new CalendarIntegration()
