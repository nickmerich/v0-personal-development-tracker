"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import { useRouter } from "next/navigation"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  errorId?: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    return {
      hasError: true,
      error,
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)

    this.setState({ errorInfo })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log to error tracking service (replace with your service)
    this.logErrorToService(error, errorInfo)
  }

  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      // In production, replace with actual error tracking service
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId,
      }

      // Store locally for now (in production, send to service)
      const existingErrors = JSON.parse(localStorage.getItem("errorLogs") || "[]")
      existingErrors.push(errorData)

      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10)
      }

      localStorage.setItem("errorLogs", JSON.stringify(existingErrors))
    } catch (logError) {
      console.error("Failed to log error:", logError)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({
  error,
  errorInfo,
  errorId,
  resetError,
}: {
  error?: Error
  errorInfo?: React.ErrorInfo
  errorId?: string
  resetError: () => void
}) {
  const router = useRouter()

  const handleReload = () => {
    resetError()
    window.location.reload()
  }

  const handleGoHome = () => {
    resetError()
    router.push("/")
  }

  const handleClearData = () => {
    if (confirm("This will clear all your data and restart the app. Are you sure?")) {
      localStorage.clear()
      window.location.href = "/"
    }
  }

  const handleReportError = () => {
    const errorReport = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Copy error report to clipboard
    navigator.clipboard
      .writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert("Error report copied to clipboard"))
      .catch(() => console.error("Failed to copy error report"))
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
            We encountered an unexpected error. Your data is safe, and we've been notified.
          </CardDescription>
          {errorId && <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">Error ID: {errorId}</div>}
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <details className="text-sm">
              <summary className="cursor-pointer text-stone-600 hover:text-stone-800 font-medium">
                Technical details
              </summary>
              <div className="mt-2 p-3 bg-stone-100 rounded text-xs overflow-auto max-h-32">
                <div className="font-medium text-red-700 mb-1">Error:</div>
                <pre className="whitespace-pre-wrap">{error.message}</pre>
                {error.stack && (
                  <>
                    <div className="font-medium text-red-700 mt-2 mb-1">Stack trace:</div>
                    <pre className="whitespace-pre-wrap text-xs">{error.stack}</pre>
                  </>
                )}
              </div>
            </details>
          )}

          <div className="space-y-2">
            <Button onClick={resetError} className="w-full bg-forest-600 text-white hover:bg-forest-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>

            <Button onClick={handleReload} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Page
            </Button>

            <Button
              onClick={handleReportError}
              variant="outline"
              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Bug className="mr-2 h-4 w-4" />
              Copy Error Report
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
            If the problem persists, please contact support with the error ID above.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void,
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Hook for handling async errors in components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    console.error("Async error:", error)
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Throw error to be caught by error boundary
  if (error) {
    throw error
  }

  return { handleError, clearError }
}
