"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface ActivityHeatmapProps {
  data: Record<string, number>
  title: string
  description?: string
}

export function ActivityHeatmap({ data, title, description }: ActivityHeatmapProps) {
  const today = new Date()
  const startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)

  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    currentWeek.push(new Date(d))

    if (d.getDay() === 6 || d.getTime() === today.getTime()) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  }

  const getIntensity = (count: number): string => {
    if (count === 0) return "bg-gray-100"
    if (count <= 2) return "bg-green-200"
    if (count <= 4) return "bg-green-400"
    if (count <= 6) return "bg-green-600"
    return "bg-green-800"
  }

  const getIntensityText = (count: number): string => {
    if (count === 0) return "No activity"
    if (count <= 2) return "Low activity"
    if (count <= 4) return "Moderate activity"
    if (count <= 6) return "High activity"
    return "Very high activity"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-forest-800">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-2">
            <div className="flex gap-1 overflow-x-auto pb-2">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((date, dayIndex) => {
                    const dateStr = date.toISOString().split("T")[0]
                    const count = data[dateStr] || 0

                    return (
                      <TooltipRoot key={dayIndex}>
                        <TooltipTrigger>
                          <div
                            className={`w-3 h-3 rounded-sm ${getIntensity(count)} cursor-pointer transition-all hover:scale-110`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {`${date.toLocaleDateString()}: ${count} tasks completed - ${getIntensityText(count)}`}
                        </TooltipContent>
                      </TooltipRoot>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 mt-4">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
