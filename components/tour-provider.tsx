"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { TourOverlay, tourStyles } from "./tour-overlay"
import { tourManager } from "@/lib/tour-system"

interface TourContextType {
  startTour: (tourId: string) => void
  isTourActive: boolean
  currentTourId: string | null
}

const TourContext = createContext<TourContextType | null>(null)

export function useTour() {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}

interface TourProviderProps {
  children: React.ReactNode
}

export function TourProvider({ children }: TourProviderProps) {
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentTourId, setCurrentTourId] = useState<string | null>(null)

  useEffect(() => {
    // Inject tour styles
    const styleElement = document.createElement("style")
    styleElement.textContent = tourStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    // Check if we should auto-start any tours
    const checkAutoStartTours = () => {
      // Check for welcome tour on first visit
      if (tourManager.shouldAutoStartTour("welcome")) {
        startTour("welcome")
      }
    }

    // Delay to ensure DOM is ready
    const timer = setTimeout(checkAutoStartTours, 1000)
    return () => clearTimeout(timer)
  }, [])

  const startTour = (tourId: string) => {
    const success = tourManager.startTour(tourId, {
      onTourComplete: () => {
        setIsTourActive(false)
        setCurrentTourId(null)

        // Clean up highlights
        document.querySelectorAll(".tour-highlight").forEach((el) => {
          el.classList.remove("tour-highlight")
        })
      },
      onTourSkip: () => {
        setIsTourActive(false)
        setCurrentTourId(null)

        // Clean up highlights
        document.querySelectorAll(".tour-highlight").forEach((el) => {
          el.classList.remove("tour-highlight")
        })
      },
    })

    if (success) {
      setIsTourActive(true)
      setCurrentTourId(tourId)
    }
  }

  const handleCloseTour = () => {
    setIsTourActive(false)
    setCurrentTourId(null)

    // Clean up highlights
    document.querySelectorAll(".tour-highlight").forEach((el) => {
      el.classList.remove("tour-highlight")
    })
  }

  return (
    <TourContext.Provider value={{ startTour, isTourActive, currentTourId }}>
      {children}
      <TourOverlay isVisible={isTourActive} onClose={handleCloseTour} />
    </TourContext.Provider>
  )
}
