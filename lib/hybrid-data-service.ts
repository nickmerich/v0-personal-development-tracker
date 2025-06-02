import { EnhancedDatabaseService } from "./enhanced-database"
import { storage, type UserData } from "./storage"

export class HybridDataService {
  private static databaseAvailable = false
  private static initializationPromise: Promise<void> | null = null

  // Initialize the service
  static async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = this.performInitialization()
    return this.initializationPromise
  }

  private static async performInitialization(): Promise<void> {
    try {
      const dbResult = await EnhancedDatabaseService.initialize()

      if (dbResult.success) {
        const tablesResult = await EnhancedDatabaseService.createTables()
        this.databaseAvailable = tablesResult.success

        if (this.databaseAvailable) {
          console.log("✅ Database mode: Full cloud sync enabled")
        } else {
          console.log("⚠️ Hybrid mode: Database tables creation failed, using localStorage")
        }
      } else {
        console.log("📱 Local mode: No database connection, using localStorage only")
      }
    } catch (error) {
      console.error("Initialization error:", error)
      console.log("📱 Fallback mode: Using localStorage only")
    }
  }

  // Save user data with fallback strategy
  static async saveUserData(userData: UserData): Promise<{ success: boolean; mode: string }> {
    // Always save to localStorage first for immediate access
    const localSuccess = storage.setUserData(userData)

    if (!this.databaseAvailable) {
      return {
        success: localSuccess,
        mode: localSuccess ? "localStorage" : "failed",
      }
    }

    try {
      const sql = EnhancedDatabaseService.getDatabase()
      if (!sql) {
        return { success: localSuccess, mode: "localStorage" }
      }

      // Save to database (implement based on your user authentication)
      // For now, we'll use a simple approach
      const userId = this.getCurrentUserId()
      if (userId) {
        await sql`
          INSERT INTO user_data (user_id, data_key, data_value, updated_at)
          VALUES (${userId}, 'userData', ${JSON.stringify(userData)}, NOW())
          ON CONFLICT (user_id, data_key) 
          DO UPDATE SET data_value = EXCLUDED.data_value, updated_at = NOW()
        `

        return { success: true, mode: "database" }
      }
    } catch (error) {
      console.error("Database save failed, using localStorage:", error)
    }

    return { success: localSuccess, mode: "localStorage" }
  }

  // Load user data with fallback strategy
  static async loadUserData(): Promise<{ data: UserData | null; mode: string }> {
    if (!this.databaseAvailable) {
      return {
        data: storage.getUserData(),
        mode: "localStorage",
      }
    }

    try {
      const sql = EnhancedDatabaseService.getDatabase()
      const userId = this.getCurrentUserId()

      if (sql && userId) {
        const result = await sql`
          SELECT data_value FROM user_data 
          WHERE user_id = ${userId} AND data_key = 'userData'
          ORDER BY updated_at DESC 
          LIMIT 1
        `

        if (result.length > 0) {
          const dbData = result[0].data_value
          // Also update localStorage for offline access
          storage.setUserData(dbData)
          return { data: dbData, mode: "database" }
        }
      }
    } catch (error) {
      console.error("Database load failed, using localStorage:", error)
    }

    return {
      data: storage.getUserData(),
      mode: "localStorage",
    }
  }

  // Get current user ID (implement based on your auth system)
  private static getCurrentUserId(): string | null {
    // This should integrate with your authentication system
    // For now, return null to use localStorage mode
    return null
  }

  // Get service status
  static getStatus(): {
    databaseAvailable: boolean
    mode: string
    features: string[]
  } {
    const features = ["localStorage", "offline-mode"]

    if (this.databaseAvailable) {
      features.push("cloud-sync", "analytics", "backup")
    }

    return {
      databaseAvailable: this.databaseAvailable,
      mode: this.databaseAvailable ? "hybrid" : "local",
      features,
    }
  }
}
