"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface NotificationContextType {
  showNotification: (title: string, message: string, type?: "success" | "error" | "info" | "warning") => void
  requestPermission: () => Promise<boolean>
  scheduleReminder: (title: string, message: string, scheduledTime: Date) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return false
    }

    if (permission === "granted") {
      return true
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === "granted"
  }

  const showNotification = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
  ) => {
    if (permission !== "granted") {
      console.log("Notification permission not granted")
      return
    }

    const notification = new Notification(title, {
      body: message,
      icon: getIconForType(type),
      badge: "/favicon.ico",
      tag: `${type}-${Date.now()}`,
      requireInteraction: type === "error",
    })

    // Auto-close after 5 seconds for non-error notifications
    if (type !== "error") {
      setTimeout(() => notification.close(), 5000)
    }

    // Play sound based on type
    playNotificationSound(type)
  }

  const scheduleReminder = (title: string, message: string, scheduledTime: Date) => {
    const now = new Date()
    const delay = scheduledTime.getTime() - now.getTime()

    if (delay <= 0) {
      showNotification(title, message, "info")
      return
    }

    setTimeout(() => {
      showNotification(title, message, "info")
    }, delay)
  }

  const getIconForType = (type: string): string => {
    switch (type) {
      case "success":
        return "✅"
      case "error":
        return "❌"
      case "warning":
        return "⚠️"
      default:
        return "ℹ️"
    }
  }

  const playNotificationSound = (type: string) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different frequencies for different types
      switch (type) {
        case "success":
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
          break
        case "error":
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1)
          break
        case "warning":
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(700, audioContext.currentTime + 0.1)
          break
        default:
          oscillator.frequency.setValueAtTime(500, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      }

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (e) {
      console.log("Audio not available")
    }
  }

  const value: NotificationContextType = {
    showNotification,
    requestPermission,
    scheduleReminder,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
