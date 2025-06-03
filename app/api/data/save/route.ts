import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await DataService.validateSession(sessionToken)

    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const userData = await request.json()

    const success = await DataService.saveUserData(user.id, userData)

    if (!success) {
      return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Save data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
