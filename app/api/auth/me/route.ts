import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Check if session exists and is valid
    const sessions = await sql`
      SELECT u.id, u.email, u.name, u.created_at, s.expires_at
      FROM users u
      JOIN user_sessions s ON u.id = s.user_id
      WHERE s.session_token = ${sessionToken}
      AND s.expires_at > NOW()
    `

    if (sessions.length === 0) {
      // Session expired or invalid
      const response = NextResponse.json({ user: null }, { status: 200 })
      response.cookies.delete("session_token")
      return response
    }

    const user = sessions[0]
    return NextResponse.json({
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
        hasCloudBackup: true,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
