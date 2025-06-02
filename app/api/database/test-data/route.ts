import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, dataKey, dataValue } = await request.json()

    // Get user by email
    const user = await DatabaseService.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Save data
    const success = await DatabaseService.saveUserData(user.id, dataKey, dataValue)

    return NextResponse.json({
      success,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test data save API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const dataKey = searchParams.get("dataKey")

    if (!email) {
      return NextResponse.json({ success: false, error: "Email parameter required" }, { status: 400 })
    }

    // Get user by email
    const user = await DatabaseService.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Get data
    const data = await DatabaseService.getUserData(user.id, dataKey || undefined)

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test data get API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
