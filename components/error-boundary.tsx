"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  const handleReload = () => {
    resetError()
    window.location.reload()
  }

  const handleClearData = () => {
    if (confirm("This will clear all your data and restart the app. Are you sure?")) {
      localStorage.clear()
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 to-stone-50 p-4">
      <Card className="w-full max-w-md border-red-200 bg-white shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">Something went wrong</CardTitle>
          <CardDescription className="text-red-600">
            We encountered an unexpected error. Don't worry, your data is likely still safe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <details className="text-sm">
              <summary className="cursor-pointer text-stone-600 hover:text-stone-800">Technical details</summary>
              <pre className="mt-2 p-2 bg-stone-100 rounded text-xs overflow-auto">{error.message}</pre>
            </details>
          )}

          <div className="space-y-2">
            <Button onClick={resetError} className="w-full bg-forest-600 text-white hover:bg-forest-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button onClick={handleReload} variant="outline" className="w-full">
              Reload Page
            </Button>

            <Button
              onClick={handleClearData}
              variant="outline"
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
            >
              Clear Data & Restart
            </Button>
          </div>

          <p className="text-xs text-stone-500 text-center">
            If the problem persists, try clearing your browser cache or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>,
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
