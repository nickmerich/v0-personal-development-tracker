import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // Try to get existing user first
    let user = await DatabaseService.getUserByEmail(email)

    if (!user) {
      // Create new user if doesn't exist
      user = await DatabaseService.createUser(email, name)
    }

    return NextResponse.json({
      success: true,
      user,
      created: !user,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test user API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
