import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

async function getCurrentUser(sessionToken: string) {
  const sessions = await sql`
    SELECT u.id, u.email, u.name
    FROM user_sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_token = ${sessionToken} AND s.expires_at > NOW() AND u.is_active = true
  `
  return sessions.length > 0 ? sessions[0] : null
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const user = await getCurrentUser(sessionToken)
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 })
    }

    const { userData } = await request.json()

    if (!userData) {
      return NextResponse.json({ success: false, error: "No data to migrate" }, { status: 400 })
    }

    // Start transaction
    await sql`BEGIN`

    try {
      // Update user profile
      if (userData.myWhy || userData.bigGoal || userData.startDate) {
        await sql`
          UPDATE user_profiles 
          SET 
            my_why = COALESCE(${userData.myWhy || null}, my_why),
            big_goal = COALESCE(${userData.bigGoal || null}, big_goal),
            start_date = COALESCE(${userData.startDate || null}, start_date),
            updated_at = NOW()
          WHERE user_id = ${user.id}
        `
      }

      // Migrate categories
      if (userData.categories && Array.isArray(userData.categories)) {
        for (const categoryName of userData.categories) {
          await sql`
            INSERT INTO categories (user_id, name, is_active)
            VALUES (${user.id}, ${categoryName}, true)
            ON CONFLICT DO NOTHING
          `
        }
      }

      // Migrate affirmations
      if (userData.affirmations && Array.isArray(userData.affirmations)) {
        for (let i = 0; i < userData.affirmations.length; i++) {
          const affirmation = userData.affirmations[i]
          await sql`
            INSERT INTO affirmations (user_id, content, sort_order, is_active)
            VALUES (${user.id}, ${affirmation}, ${i}, true)
            ON CONFLICT DO NOTHING
          `
        }
      }

      // Migrate gamification data
      if (userData.gamification) {
        const gam = userData.gamification
        await sql`
          UPDATE gamification 
          SET 
            level = COALESCE(${gam.level || null}, level),
            xp = COALESCE(${gam.xp || null}, xp),
            total_xp = COALESCE(${gam.totalXp || null}, total_xp),
            current_streak = COALESCE(${gam.streak || null}, current_streak),
            achievements = COALESCE(${JSON.stringify(gam.achievements || [])}, achievements),
            badges = COALESCE(${JSON.stringify(gam.badges || [])}, badges),
            updated_at = NOW()
          WHERE user_id = ${user.id}
        `
      }

      // Update settings
      await sql`
        UPDATE user_settings 
        SET 
          notification_settings = COALESCE(${JSON.stringify(userData.notificationSettings || {})}, notification_settings),
          calendar_preferences = COALESCE(${JSON.stringify(userData.calendarPreferences || {})}, calendar_preferences),
          setup_completed = COALESCE(${userData.setupCompleted || false}, setup_completed),
          updated_at = NOW()
        WHERE user_id = ${user.id}
      `

      // Create backup record
      await sql`
        INSERT INTO data_backups (user_id, backup_data, backup_type)
        VALUES (${user.id}, ${JSON.stringify(userData)}, 'migration')
      `

      await sql`COMMIT`

      return NextResponse.json({ success: true, message: "Data migrated successfully" })
    } catch (error) {
      await sql`ROLLBACK`
      throw error
    }
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ success: false, error: "Migration failed" }, { status: 500 })
  }
}
