import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { DataService } from "@/app/_services/DataService"

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

    const success = await DataService.migrateLocalStorageData(user.id)

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
