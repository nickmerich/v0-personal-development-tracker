import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { DataService } from "@/services/data-service"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (sessionToken) {
      await DataService.destroySession(sessionToken)
    }

    const response = NextResponse.json({ success: true })
    cookieStore.delete("session")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
