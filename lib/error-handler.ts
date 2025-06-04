// Global error handler for the application
export class ErrorHandler {
  private static instance: ErrorHandler | null = null
  private errorQueue: Array<{ error: Error; context: string; timestamp: Date }> = []
  private isInitialized = false

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  static initialize(): void {
    const instance = ErrorHandler.getInstance()
    if (!instance.isInitialized) {
      instance.setupGlobalHandlers()
      instance.isInitialized = true
    }
  }

  static logError(error: Error, context = "Unknown"): void {
    const instance = ErrorHandler.getInstance()
    instance.handleError(error, context)
  }

  // Handle and log errors
  handleError(error: Error, context = "Unknown"): void {
    const errorEntry = {
      error,
      context,
      timestamp: new Date(),
    }

    this.errorQueue.push(errorEntry)

    // Log to console in development
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      console.error(`[${context}] Error:`, error)
    }

    // Keep only last 50 errors
    if (this.errorQueue.length > 50) {
      this.errorQueue.shift()
    }

    // Report error
    this.reportError(errorEntry)
  }

  private reportError(errorEntry: { error: Error; context: string; timestamp: Date }): void {
    if (typeof window === "undefined") return

    try {
      // Store in localStorage for now
      const existingErrors = JSON.parse(localStorage.getItem("errorLogs") || "[]")
      existingErrors.push({
        message: errorEntry.error.message,
        stack: errorEntry.error.stack,
        context: errorEntry.context,
        timestamp: errorEntry.timestamp.toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      })

      // Keep only last 10 errors in localStorage
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10)
      }

      localStorage.setItem("errorLogs", JSON.stringify(existingErrors))
    } catch (storageError) {
      console.error("Failed to store error log:", storageError)
    }
  }

  private setupGlobalHandlers(): void {
    if (typeof window === "undefined") return

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError(new Error(`Unhandled promise rejection: ${event.reason}`), "UnhandledPromiseRejection")
    })

    // Handle global errors
    window.addEventListener("error", (event) => {
      this.handleError(new Error(`Global error: ${event.message} at ${event.filename}:${event.lineno}`), "GlobalError")
    })
  }

  // Get recent errors for debugging
  getRecentErrors(): Array<{ error: Error; context: string; timestamp: Date }> {
    return [...this.errorQueue].reverse()
  }

  // Clear error queue
  clearErrors(): void {
    this.errorQueue = []
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("errorLogs")
      } catch (error) {
        console.error("Failed to clear error logs:", error)
      }
    }
  }
}

// Safe async wrapper
export async function safeAsync<T>(
  asyncFunction: () => Promise<T>,
  context = "AsyncOperation",
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await asyncFunction()
    return { data, error: null }
  } catch (error) {
    const errorHandler = ErrorHandler.getInstance()
    const errorObj = error instanceof Error ? error : new Error(String(error))
    errorHandler.handleError(errorObj, context)
    return { data: null, error: errorObj }
  }
}
