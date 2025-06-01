import { Redis } from "@upstash/redis"

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export class RedisService {
  // Session management
  static async cacheSession(sessionToken: string, userId: string, ttl: number = 7 * 24 * 60 * 60): Promise<boolean> {
    try {
      await redis.setex(`session:${sessionToken}`, ttl, userId)
      return true
    } catch (error) {
      console.error("Error caching session:", error)
      return false
    }
  }

  static async getCachedSession(sessionToken: string): Promise<string | null> {
    try {
      const userId = await redis.get(`session:${sessionToken}`)
      return userId as string | null
    } catch (error) {
      console.error("Error getting cached session:", error)
      return null
    }
  }

  static async invalidateSession(sessionToken: string): Promise<boolean> {
    try {
      await redis.del(`session:${sessionToken}`)
      return true
    } catch (error) {
      console.error("Error invalidating session:", error)
      return false
    }
  }

  // User data caching
  static async cacheUserData(userId: string, userData: any, ttl: number = 60 * 60): Promise<boolean> {
    try {
      await redis.setex(`user:${userId}:data`, ttl, JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Error caching user data:", error)
      return false
    }
  }

  static async getCachedUserData(userId: string): Promise<any | null> {
    try {
      const data = await redis.get(`user:${userId}:data`)
      return data ? JSON.parse(data as string) : null
    } catch (error) {
      console.error("Error getting cached user data:", error)
      return null
    }
  }

  // Activity tracking
  static async trackUserActivity(userId: string, activity: string): Promise<boolean> {
    try {
      const timestamp = Date.now()
      await redis.lpush(`user:${userId}:activity`, `${timestamp}:${activity}`)
      await redis.ltrim(`user:${userId}:activity`, 0, 99) // Keep last 100 activities
      return true
    } catch (error) {
      console.error("Error tracking user activity:", error)
      return false
    }
  }

  static async getUserActivity(userId: string, limit = 10): Promise<string[]> {
    try {
      const activities = await redis.lrange(`user:${userId}:activity`, 0, limit - 1)
      return activities as string[]
    } catch (error) {
      console.error("Error getting user activity:", error)
      return []
    }
  }

  // Progress tracking
  static async updateProgress(userId: string, category: string, progress: number): Promise<boolean> {
    try {
      await redis.hset(`user:${userId}:progress`, { [category]: progress })
      return true
    } catch (error) {
      console.error("Error updating progress:", error)
      return false
    }
  }

  static async getProgress(userId: string): Promise<Record<string, number>> {
    try {
      const progress = await redis.hgetall(`user:${userId}:progress`)
      return progress as Record<string, number>
    } catch (error) {
      console.error("Error getting progress:", error)
      return {}
    }
  }

  // Leaderboard
  static async updateLeaderboard(userId: string, score: number): Promise<boolean> {
    try {
      await redis.zadd("leaderboard", { score, member: userId })
      return true
    } catch (error) {
      console.error("Error updating leaderboard:", error)
      return false
    }
  }

  static async getLeaderboard(limit = 10): Promise<Array<{ userId: string; score: number }>> {
    try {
      const results = await redis.zrevrange("leaderboard", 0, limit - 1, { withScores: true })
      const leaderboard: Array<{ userId: string; score: number }> = []

      for (let i = 0; i < results.length; i += 2) {
        leaderboard.push({
          userId: results[i] as string,
          score: results[i + 1] as number,
        })
      }

      return leaderboard
    } catch (error) {
      console.error("Error getting leaderboard:", error)
      return []
    }
  }

  // Backup queue
  static async queueDataBackup(userId: string, userData: any): Promise<boolean> {
    try {
      const backupItem = {
        userId,
        data: userData,
        timestamp: Date.now(),
      }
      await redis.lpush("backup:queue", JSON.stringify(backupItem))
      return true
    } catch (error) {
      console.error("Error queuing data backup:", error)
      return false
    }
  }

  static async processBackupQueue(limit = 10): Promise<Array<{ userId: string; data: any }>> {
    try {
      const items = await redis.lrange("backup:queue", 0, limit - 1)
      if (items.length > 0) {
        await redis.ltrim("backup:queue", items.length, -1)
      }

      return items.map((item) => JSON.parse(item as string))
    } catch (error) {
      console.error("Error processing backup queue:", error)
      return []
    }
  }
}
