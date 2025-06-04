import { ErrorHandler } from "./error-handler"

export class DiagnosticsService {
  static async runDiagnostics(): Promise<{
    status: "healthy" | "warning" | "error"
    checks: Array<{ name: string; status: "pass" | "fail"; message: string }>
  }> {
    const checks = []

    // Check localStorage availability
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      checks.push({ name: "localStorage", status: "pass" as const, message: "Available" })
    } catch (error) {
      checks.push({ name: "localStorage", status: "fail" as const, message: "Not available" })
    }

    // Check if running in browser
    const isBrowser = typeof window !== "undefined"
    checks.push({
      name: "environment",
      status: isBrowser ? "pass" : ("fail" as const),
      message: isBrowser ? "Browser environment" : "Server environment",
    })

    // Check error handler
    try {
      const errorHandler = ErrorHandler.getInstance()
      checks.push({ name: "errorHandler", status: "pass" as const, message: "Initialized" })
    } catch (error) {
      checks.push({ name: "errorHandler", status: "fail" as const, message: "Failed to initialize" })
    }

    // Check API health
    try {
      const response = await fetch("/api/health")
      if (response.ok) {
        checks.push({ name: "apiHealth", status: "pass" as const, message: "API responding" })
      } else {
        checks.push({ name: "apiHealth", status: "fail" as const, message: `API error: ${response.status}` })
      }
    } catch (error) {
      checks.push({ name: "apiHealth", status: "fail" as const, message: "API not reachable" })
    }

    // Determine overall status
    const failedChecks = checks.filter((check) => check.status === "fail")
    const status = failedChecks.length === 0 ? "healthy" : failedChecks.length <= 1 ? "warning" : "error"

    return { status, checks }
  }

  static async getSystemInfo(): Promise<{
    userAgent: string
    url: string
    timestamp: string
    localStorage: boolean
    sessionStorage: boolean
    indexedDB: boolean
  }> {
    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      localStorage: this.checkStorageAvailability("localStorage"),
      sessionStorage: this.checkStorageAvailability("sessionStorage"),
      indexedDB: "indexedDB" in window,
    }
  }

  private static checkStorageAvailability(type: "localStorage" | "sessionStorage"): boolean {
    try {
      const storage = window[type]
      const test = "__storage_test__"
      storage.setItem(test, test)
      storage.removeItem(test)
      return true
    } catch (error) {
      return false
    }
  }
}
