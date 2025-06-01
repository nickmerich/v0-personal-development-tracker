"use client"

import { useCallback, useEffect, useRef } from "react"

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(callback: () => void, options = { threshold: 0.1, rootMargin: "0px" }) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<HTMLDivElement | null>(null)

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        elementRef.current = node

        // Disconnect previous observer if exists
        if (observerRef.current) {
          observerRef.current.disconnect()
        }

        // Create new observer
        observerRef.current = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            callback()
            // Disconnect after triggering
            observerRef.current?.disconnect()
          }
        }, options)

        // Start observing
        observerRef.current.observe(node)
      }
    },
    [callback, options],
  )

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return setRef
}

// Performance metrics tracking
export function useDashboardMetrics() {
  const metricsRef = useRef({
    loadStart: 0,
    firstContentfulPaint: 0,
    timeToInteractive: 0,
  })

  useEffect(() => {
    // Mark load start time
    metricsRef.current.loadStart = performance.now()

    // Track first contentful paint
    const paintObserver = new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          metricsRef.current.firstContentfulPaint = entry.startTime
          console.log(`First Contentful Paint: ${Math.round(entry.startTime)}ms`)
        }
      }
    })

    paintObserver.observe({ type: "paint", buffered: true })

    // Mark time to interactive when idle
    const markTimeToInteractive = () => {
      metricsRef.current.timeToInteractive = performance.now() - metricsRef.current.loadStart
      console.log(`Time to Interactive: ${Math.round(metricsRef.current.timeToInteractive)}ms`)
    }

    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(markTimeToInteractive)
    } else {
      setTimeout(markTimeToInteractive, 0)
    }

    return () => {
      paintObserver.disconnect()
    }
  }, [])

  return metricsRef.current
}

// Memory management
export function useMemoryOptimizer() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const cleanupMemory = () => {
      // Clear image cache if supported
      if ("caches" in window) {
        caches.keys().then((keyList) => {
          keyList.forEach((key) => {
            if (key.includes("image-cache")) {
              caches.delete(key)
            }
          })
        })
      }

      // Schedule next cleanup
      timeoutId = setTimeout(cleanupMemory, 5 * 60 * 1000) // 5 minutes
    }

    // Start cleanup cycle
    timeoutId = setTimeout(cleanupMemory, 5 * 60 * 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])
}
