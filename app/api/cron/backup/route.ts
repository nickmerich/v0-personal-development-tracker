import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron job (you might want to add authentication)
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Process backup queue
    await DataService.processBackupQueue()

    // Cleanup expired sessions
    await DataService.cleanupExpiredSessions()

    return NextResponse.json({ success: true, message: "Backup processing completed" })
  } catch (error) {
    console.error("Backup cron job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
