import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const result = await DatabaseService.initializeTables()

    return NextResponse.json({
      success: result.success,
      error: result.error,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database initialization API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
