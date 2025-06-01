"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Plus, X, GripVertical } from "lucide-react"
import type { KPIMetrics } from "@/lib/kpi-service"
import { ProgressChart } from "./charts/progress-chart"
import { CategoryChart } from "./charts/category-chart"
import { ActivityHeatmap } from "./charts/activity-heatmap"

interface Widget {
  id: string
  type: "progress-trend" | "category-progress" | "activity-heatmap" | "quick-stats"
  title: string
  size: "small" | "medium" | "large"
  position: number
}

interface WidgetSystemProps {
  metrics: KPIMetrics
}

const DEFAULT_WIDGETS: Widget[] = [
  { id: "1", type: "quick-stats", title: "Quick Stats", size: "small", position: 0 },
  { id: "2", type: "progress-trend", title: "Progress Trend", size: "medium", position: 1 },
  { id: "3", type: "category-progress", title: "Category Progress", size: "medium", position: 2 },
  { id: "4", type: "activity-heatmap", title: "Activity Heatmap", size: "large", position: 3 },
]

export function WidgetSystem({ metrics }: WidgetSystemProps) {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS)
  const [isCustomizing, setIsCustomizing] = useState(false)

  const removeWidget = (widgetId: string) => {
    setWidgets(widgets.filter((w) => w.id !== widgetId))
  }

  const addWidget = (type: Widget["type"]) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: getWidgetTitle(type),
      size: "medium",
      position: widgets.length,
    }
    setWidgets([...widgets, newWidget])
  }

  const getWidgetTitle = (type: Widget["type"]): string => {
    switch (type) {
      case "progress-trend":
        return "Progress Trend"
      case "category-progress":
        return "Category Progress"
      case "activity-heatmap":
        return "Activity Heatmap"
      case "quick-stats":
        return "Quick Stats"
      default:
        return "Widget"
    }
  }

  const renderWidget = (widget: Widget) => {
    const baseClasses = "relative"
    const sizeClasses = {
      small: "col-span-1",
      medium: "col-span-1 md:col-span-2",
      large: "col-span-1 md:col-span-2 lg:col-span-3",
    }

    const content = (() => {
      switch (widget.type) {
        case "progress-trend":
          return (
            <ProgressChart
              data={metrics.progressTrend}
              title="30-Day Progress Trend"
              description="Tasks completed over the last 30 days"
              showArea={true}
            />
          )

        case "category-progress":
          return (
            <CategoryChart
              data={metrics.categoryProgress}
              title="Category Progress"
              description="Progress across all categories"
              type="bar"
            />
          )

        case "activity-heatmap":
          return (
            <ActivityHeatmap
              data={metrics.activityHeatmap}
              title="Activity Heatmap"
              description="Your activity over the last 90 days"
            />
          )

        case "quick-stats":
          return (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-forest-800">Quick Stats</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-800">{metrics.tasksCompletedToday}</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">{metrics.averageTasksPerDay}</div>
                    <div className="text-xs text-muted-foreground">Avg/Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">{metrics.journalEntriesCount}</div>
                    <div className="text-xs text-muted-foreground">Journal Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-700">{metrics.journalStreakDays}</div>
                    <div className="text-xs text-muted-foreground">Journal Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )

        default:
          return <div>Unknown widget type</div>
      }
    })()

    return (
      <div key={widget.id} className={`${baseClasses} ${sizeClasses[widget.size]}`}>
        {isCustomizing && (
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => removeWidget(widget.id)}>
              <X className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-6 w-6 p-0 cursor-move">
              <GripVertical className="h-3 w-3" />
            </Button>
          </div>
        )}
        {content}
      </div>
    )
  }

  const availableWidgets = [
    { type: "progress-trend" as const, label: "Progress Trend" },
    { type: "category-progress" as const, label: "Category Progress" },
    { type: "activity-heatmap" as const, label: "Activity Heatmap" },
    { type: "quick-stats" as const, label: "Quick Stats" },
  ]

  return (
    <div className="space-y-6">
      {/* Customization Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-forest-800">Dashboard Analytics</h2>
          <p className="text-muted-foreground">Comprehensive view of your progress and performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsCustomizing(!isCustomizing)}>
            <Settings className="h-4 w-4 mr-2" />
            {isCustomizing ? "Done" : "Customize"}
          </Button>
        </div>
      </div>

      {/* Add Widget Panel */}
      {isCustomizing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Widgets</CardTitle>
            <CardDescription>Click to add widgets to your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableWidgets.map(({ type, label }) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => addWidget(type)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-3 w-3" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Widget Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {widgets.sort((a, b) => a.position - b.position).map(renderWidget)}
      </div>

      {widgets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="text-muted-foreground">No widgets configured</div>
              <Button onClick={() => setIsCustomizing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Widgets
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
