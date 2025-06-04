"use client"

import { useEffect } from "react"

export function MobileTouchOptimizer() {
  useEffect(() => {
    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0
    const preventZoom = (e: TouchEvent) => {
      const now = new Date().getTime()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }

    // Prevent pinch zoom
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    // Add touch event listeners
    document.addEventListener("touchend", preventZoom, { passive: false })
    document.addEventListener("touchmove", preventPinchZoom, { passive: false })

    // Improve scroll performance
    const improveScrolling = () => {
      document.body.style.webkitOverflowScrolling = "touch"
      document.body.style.overflowScrolling = "touch"
    }

    improveScrolling()

    // Cleanup
    return () => {
      document.removeEventListener("touchend", preventZoom)
      document.removeEventListener("touchmove", preventPinchZoom)
    }
  }, [])

  return null
}
