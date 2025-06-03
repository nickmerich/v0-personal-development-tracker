import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { DataService } from "@/services/DataService"

export async function GET() {
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

    const userData = await DataService.getUserData(user.id)

    return NextResponse.json({ userData })
  } catch (error) {
    console.error("Load data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
