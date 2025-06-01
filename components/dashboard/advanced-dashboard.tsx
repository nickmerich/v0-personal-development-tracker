"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  BarChart3,
  Activity,
  Target,
  RefreshCw,
} from "lucide-react"
import { AnalyticsService, type Insight, type Recommendation } from "@/lib/analytics-service"
import { DataFilterService, type FilterOptions } from "@/lib/data-filters"
import { KPICards } from "./kpi-cards"
import { ProgressChart } from "./charts/progress-chart"
import { CategoryChart } from "./charts/category-chart"
import { ActivityHeatmap } from "./charts/activity-heatmap"
import type { UserData } from "@/lib/storage"

interface AdvancedDashboardProps {
  userData: UserData
  onDataUpdate: (data: UserData) => void
}

export function AdvancedDashboard({ userData, onDataUpdate }: AdvancedDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showFilters, setShowFilters] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Generate analytics data
  const analyticsData = useMemo(() => {
    return AnalyticsService.generateAnalytics(userData)
  }, [userData])

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date(),
    },
    categories: [],
    metrics: ["overallProgress", "streakDays", "weeklyProgress", "consistencyScore", "momentumScore", "balanceScore"],
    insightTypes: [],
    sortBy: "priority",
    sortOrder: "desc",
  })

  // Apply filters
  const filteredData = useMemo(() => {
    return DataFilterService.applyFilters(analyticsData, filters)
  }, [analyticsData, filters])

  // Get available filter options
  const filterOptions = useMemo(() => {
    return DataFilterService.getAvailableFilters(analyticsData)
  }, [analyticsData])

  const handleFilterChange = useCallback((key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleExport = async (format: "csv" | "json" | "pdf") => {
    setIsExporting(true)
    try {
      const exportData = AnalyticsService.exportData(analyticsData, format)

      // Create and download file
      const blob = new Blob([exportData], {
        type: format === "json" ? "application/json" : "text/plain",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `personal-development-analytics.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const refreshData = () => {
    setLastUpdated(new Date())
    // Trigger re-calculation by updating a dummy state
    setFilters((prev) => ({ ...prev }))
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-purple-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-800">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Select onValueChange={(value) => handleExport(value as "csv" | "json" | "pdf")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Filters</CardTitle>
            <CardDescription>Customize your analytics view</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={filters.dateRange.start.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        start: new Date(e.target.value),
                      })
                    }
                  />
                  <Input
                    type="date"
                    value={filters.dateRange.end.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        end: new Date(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleFilterChange("categories", [...filters.categories, category])
                          } else {
                            handleFilterChange(
                              "categories",
                              filters.categories.filter((c) => c !== category),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <Label>Metrics</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.metrics.map((metric) => (
                    <div key={metric} className="flex items-center space-x-2">
                      <Checkbox
                        id={metric}
                        checked={filters.metrics.includes(metric)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleFilterChange("metrics", [...filters.metrics, metric])
                          } else {
                            handleFilterChange(
                              "metrics",
                              filters.metrics.filter((m) => m !== metric),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={metric} className="text-sm capitalize">
                        {metric.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: "asc" | "desc") => handleFilterChange("sortOrder", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Alerts */}
      {analyticsData.alerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyticsData.alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(alert.type)}
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-muted-foreground">{alert.message}</div>
                    </div>
                  </div>
                  <Badge variant={alert.type === "critical" ? "destructive" : "secondary"}>{alert.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Detailed
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <KPICards metrics={analyticsData.metrics} />

          <div className="grid gap-6 md:grid-cols-2">
            <ProgressChart
              data={analyticsData.metrics.progressTrend}
              title="30-Day Progress Trend"
              description="Your daily task completion over time"
              showArea={true}
            />

            <CategoryChart
              data={analyticsData.metrics.categoryProgress}
              title="Category Progress"
              description="Progress across all life areas"
              type="pie"
            />
          </div>

          <ActivityHeatmap
            data={analyticsData.metrics.activityHeatmap}
            title="Activity Heatmap"
            description="Your activity patterns over the last 90 days"
          />
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.insights.map((insight: Insight) => (
              <Card key={insight.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <CardTitle className="text-base">{insight.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(insight.trend)}
                      <Badge
                        variant={
                          insight.priority === "high"
                            ? "destructive"
                            : insight.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.value !== undefined && (
                    <div className="mt-2 text-lg font-semibold text-forest-700">
                      {insight.metric?.includes("Score") || insight.metric?.includes("Progress")
                        ? `${insight.value}%`
                        : insight.value}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Overall Trend: {analyticsData.trends.overall}
                </CardTitle>
                <CardDescription>Your general progress direction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-forest-800">
                    {analyticsData.trends.overall === "improving"
                      ? "📈"
                      : analyticsData.trends.overall === "declining"
                        ? "📉"
                        : "➡️"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analyticsData.trends.overall === "improving" &&
                      "You're making great progress! Keep up the momentum."}
                    {analyticsData.trends.overall === "declining" && "Consider adjusting your approach or goals."}
                    {analyticsData.trends.overall === "stable" &&
                      "Steady progress. Look for opportunities to accelerate."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictions</CardTitle>
                <CardDescription>Based on current trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Next Week Progress:</span>
                  <span className="font-semibold">
                    {Math.round(analyticsData.trends.predictions.nextWeekProgress)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Streak Prediction:</span>
                  <span className="font-semibold">{analyticsData.trends.predictions.streakPrediction} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Goals:</span>
                  <span className="font-semibold">{analyticsData.trends.predictions.nextMonthGoals}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Trends</CardTitle>
              <CardDescription>How each life area is trending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(analyticsData.trends.categories).map(([category, trend]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      {trend === "improving" && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {trend === "declining" && <TrendingDown className="h-4 w-4 text-red-600" />}
                      {trend === "stable" && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                      <Badge
                        variant={
                          trend === "improving" ? "default" : trend === "declining" ? "destructive" : "secondary"
                        }
                      >
                        {trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {filteredData.recommendations.map((rec: Recommendation) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge
                        variant={rec.impact === "high" ? "default" : rec.impact === "medium" ? "secondary" : "outline"}
                      >
                        {rec.impact} impact
                      </Badge>
                      <Badge
                        variant={
                          rec.effort === "low" ? "default" : rec.effort === "medium" ? "secondary" : "destructive"
                        }
                      >
                        {rec.effort} effort
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Action Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {rec.actionSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-1">Expected Outcome:</h4>
                    <p className="text-sm text-green-700">{rec.expectedOutcome}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Detailed Tab */}
        <TabsContent value="detailed" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <CategoryChart
              data={analyticsData.metrics.categoryProgress}
              title="Category Progress (Bar Chart)"
              description="Detailed breakdown by category"
              type="bar"
            />

            <Card>
              <CardHeader>
                <CardTitle>Detailed Metrics</CardTitle>
                <CardDescription>Complete performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Tasks Completed Today:</span>
                    <span className="font-semibold">{analyticsData.metrics.tasksCompletedToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasks This Week:</span>
                    <span className="font-semibold">{analyticsData.metrics.tasksCompletedThisWeek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Tasks/Day:</span>
                    <span className="font-semibold">{analyticsData.metrics.averageTasksPerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Journal Entries:</span>
                    <span className="font-semibold">{analyticsData.metrics.journalEntriesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Journal Streak:</span>
                    <span className="font-semibold">{analyticsData.metrics.journalStreakDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Streak:</span>
                    <span className="font-semibold">{analyticsData.metrics.longestStreak} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Raw Data Export</CardTitle>
              <CardDescription>Download your complete analytics data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleExport("csv")} disabled={isExporting}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport("json")} disabled={isExporting}>
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button variant="outline" onClick={() => handleExport("pdf")} disabled={isExporting}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
