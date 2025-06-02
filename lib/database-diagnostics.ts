interface DatabaseDiagnostic {
  step: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export class DatabaseDiagnostics {
  private static diagnostics: DatabaseDiagnostic[] = []

  static async runFullDiagnostic(): Promise<{
    success: boolean
    diagnostics: DatabaseDiagnostic[]
    recommendedAction: string
  }> {
    this.diagnostics = []

    // Step 1: Check environment variables
    await this.checkEnvironmentVariables()

    // Step 2: Test database connection
    await this.testDatabaseConnection()

    // Step 3: Verify database permissions
    await this.verifyDatabasePermissions()

    // Step 4: Check network connectivity
    await this.checkNetworkConnectivity()

    const hasErrors = this.diagnostics.some((d) => d.status === "error")
    const recommendedAction = this.getRecommendedAction()

    return {
      success: !hasErrors,
      diagnostics: this.diagnostics,
      recommendedAction,
    }
  }

  private static async checkEnvironmentVariables() {
    const envVars = [
      "NEON_NEON_DATABASE_URL",
      "DATABASE_URL",
      "POSTGRES_URL",
      "NEON_POSTGRES_URL",
      "NEON_NEON_DATABASE_URL",
    ]

    const foundVars = envVars.filter((varName) => {
      const value = process.env[varName]
      return value && value.length > 0
    })

    if (foundVars.length === 0) {
      this.diagnostics.push({
        step: "Environment Variables",
        status: "error",
        message: "No database URL environment variables found",
        details: {
          checkedVariables: envVars,
          foundVariables: foundVars,
          suggestion: "Add a database URL environment variable",
        },
      })
    } else {
      this.diagnostics.push({
        step: "Environment Variables",
        status: "success",
        message: `Found ${foundVars.length} database URL(s)`,
        details: { foundVariables: foundVars },
      })
    }
  }

  private static async testDatabaseConnection() {
    try {
      const { neon } = await import("@neondatabase/serverless")

      const databaseUrl = this.getDatabaseUrl()

      if (!databaseUrl) {
        this.diagnostics.push({
          step: "Database Connection",
          status: "error",
          message: "No database URL available for connection test",
        })
        return
      }

      const sql = neon(databaseUrl)
      const result = await sql`SELECT 1 as test, NOW() as timestamp`

      this.diagnostics.push({
        step: "Database Connection",
        status: "success",
        message: "Database connection successful",
        details: {
          testResult: result[0],
          connectionTime: new Date().toISOString(),
        },
      })
    } catch (error) {
      this.diagnostics.push({
        step: "Database Connection",
        status: "error",
        message: "Database connection failed",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          errorType: error instanceof Error ? error.constructor.name : "Unknown",
        },
      })
    }
  }

  private static async verifyDatabasePermissions() {
    try {
      const { neon } = await import("@neondatabase/serverless")
      const databaseUrl = this.getDatabaseUrl()

      if (!databaseUrl) {
        this.diagnostics.push({
          step: "Database Permissions",
          status: "error",
          message: "Cannot verify permissions without database URL",
        })
        return
      }

      const sql = neon(databaseUrl)

      // Test basic permissions
      await sql`SELECT current_user, current_database()`

      // Test table creation permissions
      await sql`CREATE TABLE IF NOT EXISTS permission_test (id SERIAL PRIMARY KEY)`
      await sql`DROP TABLE IF EXISTS permission_test`

      this.diagnostics.push({
        step: "Database Permissions",
        status: "success",
        message: "Database permissions verified",
      })
    } catch (error) {
      this.diagnostics.push({
        step: "Database Permissions",
        status: "error",
        message: "Insufficient database permissions",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      })
    }
  }

  private static async checkNetworkConnectivity() {
    try {
      // Test basic network connectivity
      const response = await fetch("https://httpbin.org/get", {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        this.diagnostics.push({
          step: "Network Connectivity",
          status: "success",
          message: "Network connectivity verified",
        })
      } else {
        this.diagnostics.push({
          step: "Network Connectivity",
          status: "warning",
          message: "Network connectivity issues detected",
        })
      }
    } catch (error) {
      this.diagnostics.push({
        step: "Network Connectivity",
        status: "error",
        message: "Network connectivity failed",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      })
    }
  }

  private static getDatabaseUrl(): string | null {
    const envVars = ["NEON_DATABASE_URL", "DATABASE_URL", "POSTGRES_URL", "NEON_POSTGRES_URL", "NEON_NEON_DATABASE_URL"]

    for (const varName of envVars) {
      const value = process.env[varName]
      if (value && value.length > 0) {
        return value
      }
    }

    return null
  }

  private static getRecommendedAction(): string {
    const hasEnvError = this.diagnostics.some((d) => d.step === "Environment Variables" && d.status === "error")

    const hasConnectionError = this.diagnostics.some((d) => d.step === "Database Connection" && d.status === "error")

    if (hasEnvError) {
      return "Add database URL environment variable (e.g., DATABASE_URL or NEON_DATABASE_URL)"
    }

    if (hasConnectionError) {
      return "Check database URL format and network connectivity"
    }

    return "Database connection appears to be working correctly"
  }

  static getLastDiagnostics(): DatabaseDiagnostic[] {
    return this.diagnostics
  }
}
