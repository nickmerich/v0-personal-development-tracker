"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  connectionType: string
}

export function MobilePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    const measurePerformance = () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const memory = (performance as any).memory

      const metrics: PerformanceMetrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
        connectionType: (navigator as any).connection?.effectiveType || "unknown",
      }

      setMetrics(metrics)

      // Log performance issues
      if (metrics.loadTime > 3000) {
        console.warn("Slow load time detected:", metrics.loadTime + "ms")
      }

      if (metrics.memoryUsage > 50) {
        console.warn("High memory usage detected:", metrics.memoryUsage + "MB")
      }
    }

    // Measure after page load
    if (document.readyState === "complete") {
      measurePerformance()
    } else {
      window.addEventListener("load", measurePerformance)
    }

    return () => {
      window.removeEventListener("load", measurePerformance)
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development" || !metrics) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-50 max-w-xs">
      <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
      <div>Render: {metrics.renderTime.toFixed(0)}ms</div>
      <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
      <div>Connection: {metrics.connectionType}</div>
    </div>
  )
}
