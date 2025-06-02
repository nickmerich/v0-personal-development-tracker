"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EnhancedDatabaseService } from "@/lib/enhanced-database-service"
import { DatabaseDiagnostics } from "@/lib/database-diagnostics"
import { CheckCircle, XCircle, AlertCircle, Database, RefreshCw, Play } from "lucide-react"

interface DiagnosticResult {
  step: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export default function DatabaseSetupPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [setupComplete, setSetupComplete] = useState(false)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setIsRunning(true)
    try {
      const result = await DatabaseDiagnostics.runFullDiagnostic()
      setDiagnostics(result.diagnostics)
    } catch (error) {
      console.error("Diagnostics failed:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const initializeDatabase = async () => {
    setIsRunning(true)
    try {
      const status = await EnhancedDatabaseService.initialize()
      setDbStatus(status)
      setSetupComplete(status.connected)
    } catch (error) {
      console.error("Database initialization failed:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Database Setup & Diagnostics
            </CardTitle>
            <CardDescription>Diagnose and resolve database connection issues for The Gryt application</CardDescription>
          </CardHeader>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={runDiagnostics} disabled={isRunning} variant="outline">
            {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Run Diagnostics
          </Button>

          <Button onClick={initializeDatabase} disabled={isRunning}>
            {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Initialize Database
          </Button>
        </div>

        {/* Database Status */}
        {dbStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(dbStatus.connected ? "success" : "error")}>
                  {dbStatus.connected ? "Connected" : "Disconnected"}
                </Badge>
                <Badge variant="outline">Mode: {dbStatus.mode}</Badge>
              </div>

              {dbStatus.lastError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{dbStatus.lastError}</p>
                </div>
              )}

              {setupComplete && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">
                    ✅ Database setup complete! You can now use all features of The Gryt.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Diagnostics Results */}
        {diagnostics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Results</CardTitle>
              <CardDescription>Detailed analysis of database connection requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {diagnostics.map((diagnostic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(diagnostic.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{diagnostic.step}</span>
                        <Badge className={getStatusColor(diagnostic.status)}>{diagnostic.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{diagnostic.message}</p>
                    </div>
                  </div>

                  {diagnostic.details && (
                    <details className="ml-8 text-sm">
                      <summary className="cursor-pointer text-gray-500 hover:text-gray-700">View Details</summary>
                      <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                        {JSON.stringify(diagnostic.details, null, 2)}
                      </pre>
                    </details>
                  )}

                  {index < diagnostics.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Environment Variables Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables Setup</CardTitle>
            <CardDescription>Required environment variables for database connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Required Variables (choose one):</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">NEON_DATABASE_URL</code> - Primary database URL
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">NEON_DATABASE_URL</code> - Neon-specific URL
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">POSTGRES_URL</code> - PostgreSQL URL
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Example Format:</h4>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                postgresql://username:password@hostname:port/database?sslmode=require
              </code>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> If you're using Vercel, add the environment variable in your project settings.
                For local development, add it to your <code>.env.local</code> file.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open("/auth-test", "_blank")}
            >
              🔧 Open Auth Test Page
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.open("/", "_blank")}>
              🏠 Return to Main App
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.reload()}>
              🔄 Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
