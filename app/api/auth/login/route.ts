import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { DataService } from "@/services/data"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await DataService.createUser(email, name || email.split("@")[0])

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    const sessionToken = await DataService.createSession(user.id)

    if (!sessionToken) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    const response = NextResponse.json({ user })
    const cookieStore = await cookies()
    cookieStore.set("session", sessionToken, {
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
