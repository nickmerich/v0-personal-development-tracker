import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { DataService } from "@/services/data-service"

export async function POST() {
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

    const syncedData = await DataService.syncUserData(user.id)

    return NextResponse.json({ userData: syncedData })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
