import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ success: false, error: "Email and name are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id, email, name FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = await sql`
      INSERT INTO users (email, name, email_verified, is_active)
      VALUES (${email}, ${name}, true, true)
      RETURNING id, email, name, created_at
    `

    if (newUser.length === 0) {
      return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
    }

    const user = newUser[0]

    // Create user profile
    await sql`
      INSERT INTO user_profiles (user_id)
      VALUES (${user.id})
    `

    // Create user settings
    await sql`
      INSERT INTO user_settings (user_id, setup_completed)
      VALUES (${user.id}, false)
    `

    // Create gamification record
    await sql`
      INSERT INTO gamification (user_id)
      VALUES (${user.id})
    `

    // Create session
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await sql`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (${user.id}, ${sessionToken}, ${expiresAt})
    `

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
        hasCloudBackup: true,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
