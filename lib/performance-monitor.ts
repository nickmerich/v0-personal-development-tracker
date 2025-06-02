export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map()
  private static isEnabled = true

  // Start timing an operation
  static startTiming(operation: string): () => void {
    if (!this.isEnabled) return () => {}

    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      this.recordMetric(operation, duration)
    }
  }

  // Record a metric
  static recordMetric(name: string, value: number): void {
    if (!this.isEnabled) return

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const values = this.metrics.get(name)!
    values.push(value)

    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  // Get performance statistics
  static getStats(operation?: string): Record<string, any> {
    if (operation) {
      const values = this.metrics.get(operation) || []
      return this.calculateStats(operation, values)
    }

    const allStats: Record<string, any> = {}
    for (const [name, values] of this.metrics.entries()) {
      allStats[name] = this.calculateStats(name, values)
    }

    return allStats
  }

  private static calculateStats(name: string, values: number[]) {
    if (values.length === 0) {
      return { name, count: 0, avg: 0, min: 0, max: 0 }
    }

    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    return {
      name,
      count: values.length,
      avg: Math.round(avg * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
    }
  }

  // Monitor page load performance
  static monitorPageLoad(): void {
    if (typeof window === "undefined") return

    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

      if (navigation) {
        this.recordMetric("page-load-total", navigation.loadEventEnd - navigation.fetchStart)
        this.recordMetric("dom-content-loaded", navigation.domContentLoadedEventEnd - navigation.fetchStart)
        this.recordMetric("first-paint", navigation.responseEnd - navigation.fetchStart)
      }
    })
  }

  // Get performance report
  static getReport(): string {
    const stats = this.getStats()
    const report = ["=== Performance Report ==="]

    for (const [name, data] of Object.entries(stats)) {
      report.push(`${name}: avg=${data.avg}ms, min=${data.min}ms, max=${data.max}ms (${data.count} samples)`)
    }

    return report.join("\n")
  }

  // Enable/disable monitoring
  static setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }
}
