import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }

    // Verify session and get user
    const sessions = await sql`
      SELECT u.id, u.email, u.name, u.created_at, s.expires_at
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ${sessionToken} AND s.expires_at > NOW() AND u.is_active = true
    `

    if (sessions.length === 0) {
      // Invalid or expired session
      cookieStore.delete("session_token")
      return NextResponse.json({ user: null })
    }

    const session = sessions[0]

    return NextResponse.json({
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        createdAt: session.created_at,
        hasCloudBackup: true,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ user: null })
  }
}
