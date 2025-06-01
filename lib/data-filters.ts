import type { KPIMetrics } from "./kpi-service"
import type { AnalyticsData } from "./analytics-service"

export interface FilterOptions {
  dateRange: {
    start: Date
    end: Date
  }
  categories: string[]
  metrics: string[]
  insightTypes: string[]
  sortBy: string
  sortOrder: "asc" | "desc"
  groupBy?: string
}

export interface FilteredData {
  metrics: Partial<KPIMetrics>
  insights: any[]
  recommendations: any[]
  alerts: any[]
}

export class DataFilterService {
  static applyFilters(data: AnalyticsData, filters: FilterOptions): FilteredData {
    const filteredInsights = this.filterInsights(data.insights, filters)
    const filteredRecommendations = this.filterRecommendations(data.recommendations, filters)
    const filteredAlerts = this.filterAlerts(data.alerts, filters)
    const filteredMetrics = this.filterMetrics(data.metrics, filters)

    return {
      metrics: filteredMetrics,
      insights: this.sortData(filteredInsights, filters.sortBy, filters.sortOrder),
      recommendations: this.sortData(filteredRecommendations, filters.sortBy, filters.sortOrder),
      alerts: this.sortData(filteredAlerts, filters.sortBy, filters.sortOrder),
    }
  }

  private static filterInsights(insights: any[], filters: FilterOptions): any[] {
    return insights.filter((insight) => {
      // Filter by insight type
      if (filters.insightTypes.length > 0 && !filters.insightTypes.includes(insight.type)) {
        return false
      }

      // Filter by category
      if (filters.categories.length > 0 && insight.category && !filters.categories.includes(insight.category)) {
        return false
      }

      return true
    })
  }

  private static filterRecommendations(recommendations: any[], filters: FilterOptions): any[] {
    return recommendations.filter((rec) => {
      // Filter by category
      if (filters.categories.length > 0 && !filters.categories.includes(rec.category)) {
        return false
      }

      return true
    })
  }

  private static filterAlerts(alerts: any[], filters: FilterOptions): any[] {
    return alerts.filter((alert) => {
      // Filter by date range
      const alertDate = new Date(alert.timestamp)
      if (alertDate < filters.dateRange.start || alertDate > filters.dateRange.end) {
        return false
      }

      // Filter by category
      if (filters.categories.length > 0 && alert.category && !filters.categories.includes(alert.category)) {
        return false
      }

      return true
    })
  }

  private static filterMetrics(metrics: KPIMetrics, filters: FilterOptions): Partial<KPIMetrics> {
    const filtered: Partial<KPIMetrics> = {}

    // Include only selected metrics
    if (filters.metrics.includes("overallProgress")) filtered.overallProgress = metrics.overallProgress
    if (filters.metrics.includes("streakDays")) filtered.streakDays = metrics.streakDays
    if (filters.metrics.includes("weeklyProgress")) filtered.weeklyProgress = metrics.weeklyProgress
    if (filters.metrics.includes("consistencyScore")) filtered.consistencyScore = metrics.consistencyScore
    if (filters.metrics.includes("momentumScore")) filtered.momentumScore = metrics.momentumScore
    if (filters.metrics.includes("balanceScore")) filtered.balanceScore = metrics.balanceScore

    // Filter category progress by selected categories
    if (filters.categories.length > 0) {
      filtered.categoryProgress = {}
      filters.categories.forEach((category) => {
        if (metrics.categoryProgress[category] !== undefined) {
          filtered.categoryProgress![category] = metrics.categoryProgress[category]
        }
      })
    } else {
      filtered.categoryProgress = metrics.categoryProgress
    }

    return filtered
  }

  private static sortData(data: any[], sortBy: string, sortOrder: "asc" | "desc"): any[] {
    return [...data].sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      // Handle different data types
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  static getAvailableFilters(data: AnalyticsData): {
    categories: string[]
    metrics: string[]
    insightTypes: string[]
    sortOptions: string[]
  } {
    const categories = [
      ...new Set([
        ...Object.keys(data.metrics.categoryProgress),
        ...data.insights.map((i) => i.category).filter(Boolean),
        ...data.recommendations.map((r) => r.category).filter(Boolean),
        ...data.alerts.map((a) => a.category).filter(Boolean),
      ]),
    ]

    const metrics = [
      "overallProgress",
      "streakDays",
      "weeklyProgress",
      "monthlyProgress",
      "consistencyScore",
      "momentumScore",
      "balanceScore",
      "tasksCompleted",
      "milestonesCompleted",
    ]

    const insightTypes = [...new Set(data.insights.map((i) => i.type))]

    const sortOptions = ["title", "priority", "type", "category", "timestamp", "value", "impact"]

    return {
      categories,
      metrics,
      insightTypes,
      sortOptions,
    }
  }
}
