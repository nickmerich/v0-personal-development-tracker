import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const result = await DatabaseService.testConnection()

    return NextResponse.json({
      success: result.success,
      details: result.details,
      error: result.error,
      timestamp: new Date().toISOString(),
      connectionInfo: {
        host: "ep-steep-pond-a4puzhff-pooler.us-east-1.aws.neon.tech",
        database: "neondb",
        user: "neondb_owner",
        ssl: "required",
      },
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
