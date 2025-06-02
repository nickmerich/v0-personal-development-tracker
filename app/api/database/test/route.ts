import { type NextRequest, NextResponse } from "next/server"
import { EnhancedDatabaseService } from "@/lib/enhanced-database-service"
import { DatabaseDiagnostics } from "@/lib/database-diagnostics"

export async function GET(request: NextRequest) {
  try {
    // Run comprehensive diagnostics
    const diagnostics = await DatabaseDiagnostics.runFullDiagnostic()

    // Attempt database initialization
    const dbStatus = await EnhancedDatabaseService.initialize()

    return NextResponse.json({
      success: diagnostics.success && dbStatus.connected,
      diagnostics: diagnostics.diagnostics,
      databaseStatus: dbStatus,
      recommendedAction: diagnostics.recommendedAction,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case "initialize":
        const status = await EnhancedDatabaseService.initialize()
        return NextResponse.json({ success: status.connected, status })

      case "test-connection":
        const isConnected = await EnhancedDatabaseService.testConnection()
        return NextResponse.json({ success: isConnected, connected: isConnected })

      case "run-diagnostics":
        const diagnostics = await DatabaseDiagnostics.runFullDiagnostic()
        return NextResponse.json(diagnostics)

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Database test API POST error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
