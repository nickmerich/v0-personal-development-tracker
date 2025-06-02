import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseHealth } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const health = await getDatabaseHealth()

    return NextResponse.json({
      success: health.success,
      health,
      timestamp: new Date().toISOString(),
      environment: {
        hasConnectionString: !!process.env.NEON_NEON_NEON_NEON_DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    console.error("Database health API error:", error)

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
