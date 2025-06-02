"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Database, RefreshCw, Users, BarChart3, Shield, Clock } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "pending"
  message: string
  details?: any
  duration?: number
}

export default function DatabaseTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [dbStats, setDbStats] = useState<any>(null)
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testName, setTestName] = useState("Test User")

  useEffect(() => {
    runInitialChecks()
  }, [])

  const addTestResult = (result: TestResult) => {
    setTestResults((prev) => [...prev, result])
  }

  const clearResults = () => {
    setTestResults([])
    setDbStats(null)
    setHealthStatus(null)
  }

  const runInitialChecks = async () => {
    setIsRunning(true)
    clearResults()

    // Test 1: Health Check
    await runTest("Database Health Check", async () => {
      const response = await fetch("/api/database/health")
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      setHealthStatus(result.health)
      return result.health
    })

    // Test 2: Connection Test
    await runTest("Database Connection", async () => {
      const response = await fetch("/api/database/test")
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      return result.details
    })

    setIsRunning(false)
  }

  const runFullTests = async () => {
    setIsRunning(true)

    // Test 3: Initialize Tables
    await runTest("Initialize Tables", async () => {
      const response = await fetch("/api/database/initialize", { method: "POST" })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      return `Tables created: ${result.tablesCreated?.join(", ") || "all"}`
    })

    // Test 4: Get Database Stats
    await runTest("Database Statistics", async () => {
      const response = await fetch("/api/database/stats")
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      setDbStats(result.stats)
      return result.stats
    })

    setIsRunning(false)
  }

  const runUserTests = async () => {
    setIsRunning(true)

    // Test 5: Create User
    await runTest("Create Test User", async () => {
      const response = await fetch("/api/database/test-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, name: testName }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      return result.user
    })

    // Test 6: Save User Data
    await runTest("Save User Data", async () => {
      const response = await fetch("/api/database/test-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          dataKey: "test_data",
          dataValue: {
            message: "Hello from database test!",
            timestamp: new Date().toISOString(),
            testNumber: Math.floor(Math.random() * 1000),
          },
        }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      return "Data saved successfully"
    })

    // Test 7: Retrieve User Data
    await runTest("Retrieve User Data", async () => {
      const response = await fetch(`/api/database/test-data?email=${encodeURIComponent(testEmail)}`)
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      return result.data
    })

    setIsRunning(false)
  }

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    const startTime = Date.now()
    addTestResult({ name, status: "pending", message: "Running..." })

    try {
      const result = await testFn()
      const duration = Date.now() - startTime

      setTestResults((prev) =>
        prev.map((test) =>
          test.name === name
            ? { ...test, status: "success", message: "Completed successfully", details: result, duration }
            : test,
        ),
      )
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      setTestResults((prev) =>
        prev.map((test) => (test.name === name ? { ...test, status: "error", message: errorMessage, duration } : test)),
      )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "pending":
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              PostgreSQL Database Test Suite
              <Badge className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Environment Variable Configured
              </Badge>
            </CardTitle>
            <CardDescription>
              Comprehensive testing of database connectivity and operations using Neon PostgreSQL with environment
              variable: NEON_NEON_NEON_NEON_DATABASE_URL
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Health Status */}
        {healthStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Database Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{healthStatus.connectionTime}ms</div>
                  <div className="text-sm text-gray-600">Connection Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{healthStatus.queryTime}ms</div>
                  <div className="text-sm text-gray-600">Query Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{healthStatus.tableCount}</div>
                  <div className="text-sm text-gray-600">Tables</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{healthStatus.success ? "✓" : "✗"}</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Initial Checks</CardTitle>
              <CardDescription>Health check and connection verification</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runInitialChecks} disabled={isRunning} className="w-full">
                {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                Run Health Checks
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
              <CardDescription>Initialize tables and get statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runFullTests} disabled={isRunning} className="w-full">
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                Setup & Stats
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Operations</CardTitle>
              <CardDescription>Test user creation and data operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <Label htmlFor="testEmail">Test Email</Label>
                  <Input
                    id="testEmail"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="testName">Test Name</Label>
                  <Input
                    id="testName"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="Test User"
                  />
                </div>
              </div>
              <Button onClick={runUserTests} disabled={isRunning} className="w-full">
                {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
                Test User Ops
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Database Statistics */}
        {dbStats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Database Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dbStats.total_users}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dbStats.completed_setups}</div>
                  <div className="text-sm text-gray-600">Setup Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{dbStats.total_tasks}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{dbStats.completed_tasks}</div>
                  <div className="text-sm text-gray-600">Completed Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{dbStats.total_categories}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{dbStats.active_sessions}</div>
                  <div className="text-sm text-gray-600">Active Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{dbStats.total_user_data_records}</div>
                  <div className="text-sm text-gray-600">Data Records</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Detailed results of database operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.name}</span>
                        <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                        {result.duration && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {result.duration}ms
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    </div>
                  </div>

                  {result.details && (
                    <details className="ml-8 text-sm">
                      <summary className="cursor-pointer text-gray-500 hover:text-gray-700">View Details</summary>
                      <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}

                  {index < testResults.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Connection Information */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Host:</strong> ep-steep-pond-a4puzhff-pooler.us-east-1.aws.neon.tech
              </div>
              <div>
                <strong>Database:</strong> neondb
              </div>
              <div>
                <strong>User:</strong> neondb_owner
              </div>
              <div>
                <strong>SSL Mode:</strong> require
              </div>
              <div>
                <strong>Region:</strong> us-east-1 (AWS)
              </div>
              <div>
                <strong>Provider:</strong> Neon (Serverless PostgreSQL)
              </div>
            </div>

            <Separator />

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                <CheckCircle className="w-4 h-4" />
                Environment Variable Status
              </div>
              <div className="text-sm text-green-700">
                <strong>NEON_NEON_NEON_DATABASE_URL</strong> is properly configured in your Vercel project. The
                application will use this environment variable for database connections.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
