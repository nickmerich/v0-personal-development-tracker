import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    // Initialize data service
    await DataService.initialize()

    // Try to get existing user or create new one
    let user = await DataService.authenticateUser(email)

    if (!user) {
      user = await DataService.createUser(email, name)
    }

    if (!user) {
      return NextResponse.json({ error: "Failed to create or authenticate user" }, { status: 500 })
    }

    // Create session
    const sessionToken = await DataService.createSession(user.id)

    if (!sessionToken) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    // Set session cookie
    const response = NextResponse.json({ success: true, user })
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
