"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-service"

export default function AuthTestPage() {
  const [testResults, setTestResults] = useState<any>({})
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testName, setTestName] = useState("Test User")
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()

  useEffect(() => {
    runSystemTests()
  }, [])

  const runSystemTests = async () => {
    const results: any = {}

    // Test API endpoints
    try {
      const meResponse = await fetch("/api/auth/me")
      results.apiMe = {
        status: meResponse.status,
        ok: meResponse.ok,
        data: await meResponse.json(),
      }
    } catch (error) {
      results.apiMe = { error: error instanceof Error ? error.message : "Unknown error" }
    }

    // Test auth context
    results.authContext = {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      error: auth.error,
    }

    setTestResults(results)
  }

  const testSignUp = async () => {
    setIsLoading(true)
    try {
      const result = await auth.signUp(testEmail, testName)
      setTestResults((prev) => ({
        ...prev,
        signUp: result,
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        signUp: { error: error instanceof Error ? error.message : "Unknown error" },
      }))
    }
    setIsLoading(false)
  }

  const testSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await auth.signIn(testEmail, testName)
      setTestResults((prev) => ({
        ...prev,
        signIn: result,
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        signIn: { error: error instanceof Error ? error.message : "Unknown error" },
      }))
    }
    setIsLoading(false)
  }

  const testSignOut = async () => {
    setIsLoading(true)
    try {
      const result = await auth.signOut()
      setTestResults((prev) => ({
        ...prev,
        signOut: { success: result },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        signOut: { error: error instanceof Error ? error.message : "Unknown error" },
      }))
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Authentication Test Suite</h1>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">API Endpoints</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(testResults.apiMe, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold">Auth Context</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(testResults.authContext, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Test Email</Label>
              <Input id="email" type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="name">Test Name</Label>
              <Input id="name" value={testName} onChange={(e) => setTestName(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={testSignUp} disabled={isLoading}>
              Test Sign Up
            </Button>
            <Button onClick={testSignIn} disabled={isLoading}>
              Test Sign In
            </Button>
            <Button onClick={testSignOut} disabled={isLoading}>
              Test Sign Out
            </Button>
            <Button onClick={runSystemTests} variant="outline">
              Refresh Tests
            </Button>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            {testResults.signUp && (
              <div>
                <h3 className="font-semibold">Sign Up Result</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.signUp, null, 2)}
                </pre>
              </div>
            )}
            {testResults.signIn && (
              <div>
                <h3 className="font-semibold">Sign In Result</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.signIn, null, 2)}
                </pre>
              </div>
            )}
            {testResults.signOut && (
              <div>
                <h3 className="font-semibold">Sign Out Result</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.signOut, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
