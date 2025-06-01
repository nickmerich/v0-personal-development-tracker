import { DatabaseService, type User } from "./database"
import { RedisService } from "./redis"
import { storage } from "./storage"

export class DataService {
  // Initialize the service
  static async initialize(): Promise<boolean> {
    try {
      await DatabaseService.initializeTables()
      console.log("Data service initialized successfully")
      return true
    } catch (error) {
      console.error("Error initializing data service:", error)
      return false
    }
  }

  // User authentication
  static async createUser(email: string, name: string): Promise<User | null> {
    try {
      const user = await DatabaseService.createUser(email, name)
      if (user) {
        // Track user creation activity
        await RedisService.trackUserActivity(user.id, "user_created")
      }
      return user
    } catch (error) {
      console.error("Error creating user:", error)
      return null
    }
  }

  static async authenticateUser(email: string): Promise<User | null> {
    try {
      return await DatabaseService.getUserByEmail(email)
    } catch (error) {
      console.error("Error authenticating user:", error)
      return null
    }
  }

  // Session management
  static async createSession(userId: string): Promise<string | null> {
    try {
      const sessionToken = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      const dbSuccess = await DatabaseService.createSession(userId, sessionToken, expiresAt)
      const cacheSuccess = await RedisService.cacheSession(sessionToken, userId, 7 * 24 * 60 * 60) // 7 days in seconds

      if (dbSuccess && cacheSuccess) {
        await RedisService.trackUserActivity(userId, "session_created")
        return sessionToken
      }

      return null
    } catch (error) {
      console.error("Error creating session:", error)
      return null
    }
  }

  static async validateSession(sessionToken: string): Promise<User | null> {
    try {
      // Try cache first for speed
      const cachedUserId = await RedisService.getCachedSession(sessionToken)
      if (cachedUserId) {
        const user = await DatabaseService.getUserById(cachedUserId)
        if (user) {
          await RedisService.trackUserActivity(user.id, "session_validated")
          return user
        }
      }

      // Fallback to database
      const user = await DatabaseService.getSessionUser(sessionToken)
      if (user) {
        // Re-cache the session
        await RedisService.cacheSession(sessionToken, user.id)
        await RedisService.trackUserActivity(user.id, "session_validated")
      }

      return user
    } catch (error) {
      console.error("Error validating session:", error)
      return null
    }
  }

  static async destroySession(sessionToken: string): Promise<boolean> {
    try {
      const dbSuccess = await DatabaseService.deleteSession(sessionToken)
      const cacheSuccess = await RedisService.invalidateSession(sessionToken)
      return dbSuccess && cacheSuccess
    } catch (error) {
      console.error("Error destroying session:", error)
      return false
    }
  }

  // Data persistence with multi-layer approach
  static async saveUserData(userId: string, userData: any): Promise<boolean> {
    try {
      // 1. Save to localStorage immediately (for offline access)
      storage.setUserData(userData)

      // 2. Cache in Redis for fast access
      await RedisService.cacheUserData(userId, userData)

      // 3. Queue for database backup
      await RedisService.queueDataBackup(userId, userData)

      // 4. Save to database immediately for critical data
      const dbSuccess = await DatabaseService.saveUserData(userId, userData)

      if (dbSuccess) {
        await RedisService.trackUserActivity(userId, "data_saved")

        // Update progress tracking
        if (userData.tasks) {
          const totalTasks = Object.values(userData.tasks).flat().length
          const completedTasks = Object.values(userData.tasks)
            .flat()
            .filter((task: any) => task.completed).length
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          await RedisService.updateProgress(userId, "overall", progress)

          // Update leaderboard
          await RedisService.updateLeaderboard(userId, userData.gamification?.totalXp || 0)
        }
      }

      return dbSuccess
    } catch (error) {
      console.error("Error saving user data:", error)
      return false
    }
  }

  static async getUserData(userId: string): Promise<any | null> {
    try {
      // 1. Try cache first for speed
      let userData = await RedisService.getCachedUserData(userId)

      if (!userData) {
        // 2. Fallback to database
        userData = await DatabaseService.getUserData(userId)

        if (userData) {
          // Re-cache the data
          await RedisService.cacheUserData(userId, userData)
        } else {
          // 3. Fallback to localStorage (for offline/migration scenarios)
          userData = storage.getUserData()
        }
      }

      if (userData) {
        await RedisService.trackUserActivity(userId, "data_accessed")
      }

      return userData
    } catch (error) {
      console.error("Error getting user data:", error)
      // Final fallback to localStorage
      return storage.getUserData()
    }
  }

  // Migration from localStorage to database
  static async migrateLocalStorageData(userId: string): Promise<boolean> {
    try {
      const localData = storage.getUserData()
      if (localData) {
        const success = await this.saveUserData(userId, localData)
        if (success) {
          await RedisService.trackUserActivity(userId, "data_migrated")
          console.log("Successfully migrated localStorage data to database")
        }
        return success
      }
      return true // No data to migrate
    } catch (error) {
      console.error("Error migrating localStorage data:", error)
      return false
    }
  }

  // Sync data across devices
  static async syncUserData(userId: string): Promise<any | null> {
    try {
      // Get the latest data from database
      const dbData = await DatabaseService.getUserData(userId)
      const localData = storage.getUserData()

      if (!dbData && localData) {
        // Upload local data to database
        await this.saveUserData(userId, localData)
        return localData
      } else if (dbData && !localData) {
        // Download database data to local storage
        storage.setUserData(dbData)
        return dbData
      } else if (dbData && localData) {
        // Merge data (database takes precedence for conflicts)
        const mergedData = { ...localData, ...dbData }
        storage.setUserData(mergedData)
        await this.saveUserData(userId, mergedData)
        return mergedData
      }

      return dbData || localData
    } catch (error) {
      console.error("Error syncing user data:", error)
      return null
    }
  }

  // Analytics and insights
  static async getUserProgress(userId: string): Promise<Record<string, number>> {
    return await RedisService.getProgress(userId)
  }

  static async getUserActivity(userId: string, limit = 10): Promise<string[]> {
    return await RedisService.getUserActivity(userId, limit)
  }

  static async getLeaderboard(limit = 10): Promise<Array<{ userId: string; score: number }>> {
    return await RedisService.getLeaderboard(limit)
  }

  // Background tasks
  static async processBackupQueue(): Promise<void> {
    try {
      const backupItems = await RedisService.processBackupQueue()

      for (const item of backupItems) {
        await DatabaseService.saveUserData(item.userId, item.data)
      }

      if (backupItems.length > 0) {
        console.log(`Processed ${backupItems.length} backup items`)
      }
    } catch (error) {
      console.error("Error processing backup queue:", error)
    }
  }

  static async cleanupExpiredSessions(): Promise<void> {
    try {
      await DatabaseService.cleanupExpiredSessions()
      console.log("Cleaned up expired sessions")
    } catch (error) {
      console.error("Error cleaning up expired sessions:", error)
    }
  }
}
