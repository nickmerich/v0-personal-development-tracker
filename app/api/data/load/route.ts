import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await DataService.validateSession(sessionToken)

    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const userData = await DataService.getUserData(user.id)

    return NextResponse.json({ data: userData })
  } catch (error) {
    console.error("Load data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
