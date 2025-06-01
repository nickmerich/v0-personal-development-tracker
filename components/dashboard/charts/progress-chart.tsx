"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressChartProps {
  data: number[]
  title: string
  description?: string
  color?: string
  showArea?: boolean
}

export function ProgressChart({ data, title, description, color = "#10b981", showArea = false }: ProgressChartProps) {
  const chartData = data.map((value, index) => ({
    day: index + 1,
    value,
    date: new Date(Date.now() - (data.length - 1 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  }))

  const ChartComponent = showArea ? AreaChart : LineChart

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-forest-800">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              labelFormatter={(value) => `Day ${value}`}
              formatter={(value: number, name) => [value, "Tasks Completed"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            {showArea ? (
              <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.3} strokeWidth={2} />
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
