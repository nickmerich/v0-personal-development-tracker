"use client"

import type React from "react"
import { Component, type ReactNode } from "react"

interface SafeComponentWrapperProps {
  children: ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface SafeComponentWrapperState {
  hasError: boolean
  error: Error | null
}

export class SafeComponentWrapper extends Component<SafeComponentWrapperProps, SafeComponentWrapperState> {
  constructor(props: SafeComponentWrapperProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): SafeComponentWrapperState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("SafeComponentWrapper caught an error:", error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold text-red-800 mb-4">🏗️ Building Interrupted</h1>
        <p className="text-red-600 mb-4">Something went wrong while building your experience.</p>
        <p className="text-sm text-red-500 mb-6">{error.message}</p>
        <div className="space-y-2">
          <button
            onClick={reset}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Resume Building
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  )
}
