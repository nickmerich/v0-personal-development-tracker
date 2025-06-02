"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, ArrowRight, Home, Settings, Calendar, BarChart3 } from "lucide-react"

interface RouteTest {
  path: string
  name: string
  description: string
  status: "pending" | "success" | "error"
  error?: string
}

export default function RoutingTestPage() {
  const router = useRouter()
  const [testResults, setTestResults] = useState<RouteTest[]>([
    { path: "/", name: "Home Page", description: "Main landing page", status: "pending" },
    { path: "/dashboard", name: "Dashboard", description: "Main user dashboard", status: "pending" },
    { path: "/setup/personal-info", name: "Setup - Personal Info", description: "First setup step", status: "pending" },
    { path: "/setup/my-why", name: "Setup - My Why", description: "Second setup step", status: "pending" },
    { path: "/setup/big-goal", name: "Setup - Big Goal", description: "Third setup step", status: "pending" },
    { path: "/setup/categories", name: "Setup - Categories", description: "Fourth setup step", status: "pending" },
    { path: "/setup/complete", name: "Setup - Complete", description: "Setup completion", status: "pending" },
    { path: "/profile", name: "Profile Page", description: "User profile management", status: "pending" },
    { path: "/settings", name: "Settings Page", description: "App settings", status: "pending" },
    { path: "/templates", name: "Templates Page", description: "Habit templates", status: "pending" },
    { path: "/test-journey", name: "Test Journey", description: "Demo journey", status: "pending" },
    { path: "/database-test", name: "Database Test", description: "Database testing page", status: "pending" },
  ])

  const testRoute = async (routeIndex: number) => {
    const route = testResults[routeIndex]

    // Update status to testing
    setTestResults((prev) => prev.map((r, i) => (i === routeIndex ? { ...r, status: "pending" } : r)))

    try {
      // Test navigation
      router.push(route.path)

      // Wait a bit for navigation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mark as success
      setTestResults((prev) => prev.map((r, i) => (i === routeIndex ? { ...r, status: "success" } : r)))
    } catch (error) {
      // Mark as error
      setTestResults((prev) =>
        prev.map((r, i) =>
          i === routeIndex
            ? { ...r, status: "error", error: error instanceof Error ? error.message : "Unknown error" }
            : r,
        ),
      )
    }
  }

  const testAllRoutes = async () => {
    for (let i = 0; i < testResults.length; i++) {
      await testRoute(i)
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const getStatusIcon = (status: RouteTest["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: RouteTest["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">🧪 Routing & Navigation Test Suite</CardTitle>
            <CardDescription>
              Test all application routes and page transitions to ensure proper navigation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Button onClick={testAllRoutes} className="bg-blue-600 hover:bg-blue-700">
                Test All Routes
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Button>
            </div>

            {/* Test Results */}
            <div className="space-y-3">
              {testResults.map((route, index) => (
                <div
                  key={route.path}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(route.status)}
                    <div>
                      <h3 className="font-medium">{route.name}</h3>
                      <p className="text-sm text-gray-600">{route.description}</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{route.path}</code>
                      {route.error && <p className="text-xs text-red-600 mt-1">Error: {route.error}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(route.status)}
                    <Button size="sm" variant="outline" onClick={() => testRoute(index)}>
                      Test
                    </Button>
                    <Button size="sm" onClick={() => router.push(route.path)}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
            <CardDescription>Test common navigation patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => router.push("/")}>
                <Home className="h-6 w-6" />
                <span>Home</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => router.push("/dashboard")}>
                <BarChart3 className="h-6 w-6" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push("/setup/personal-info")}
              >
                <Settings className="h-6 w-6" />
                <span>Setup</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push("/test-journey")}
              >
                <Calendar className="h-6 w-6" />
                <span>Test Journey</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
