import { neon } from "@neondatabase/serverless"

// Enhanced database service with better error handling and connection management
export class EnhancedDatabaseService {
  private static sql: any = null
  private static isInitialized = false

  // Initialize database connection
  static async initialize(): Promise<{ success: boolean; error?: string }> {
    try {
      // Try multiple environment variable names
      const databaseUrl =
        process.env.NEON_NEON_DATABASE_URL ||
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        process.env.NEON_NEON_DATABASE_URL

      if (!databaseUrl) {
        console.warn("No database URL found, running in localStorage-only mode")
        return { success: false, error: "No database URL configured" }
      }

      this.sql = neon(databaseUrl)

      // Test connection
      await this.sql`SELECT 1 as test`

      this.isInitialized = true
      console.log("Database connection established successfully")

      return { success: true }
    } catch (error) {
      console.error("Database initialization failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown database error",
      }
    }
  }

  // Create all necessary tables
  static async createTables(): Promise<{ success: boolean; error?: string }> {
    if (!this.sql) {
      return { success: false, error: "Database not initialized" }
    }

    try {
      // Users table
      await this.sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login TIMESTAMP WITH TIME ZONE,
          setup_completed BOOLEAN DEFAULT FALSE,
          timezone VARCHAR(50) DEFAULT 'UTC'
        )
      `

      // User profiles table
      await this.sql`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          start_date DATE NOT NULL,
          my_why TEXT,
          big_goal TEXT,
          profile_picture_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `

      // Categories table
      await this.sql`
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          color VARCHAR(7) DEFAULT '#16a34a',
          icon VARCHAR(50),
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `

      // Tasks table
      await this.sql`
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          completed BOOLEAN DEFAULT FALSE,
          completed_at TIMESTAMP WITH TIME ZONE,
          scheduled_date DATE,
          priority INTEGER DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `

      // Create indexes for performance
      await this.sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, scheduled_date)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(user_id, completed, completed_at)`

      console.log("Database tables created successfully")
      return { success: true }
    } catch (error) {
      console.error("Error creating tables:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error creating tables",
      }
    }
  }

  // Check if database is available
  static isAvailable(): boolean {
    return this.isInitialized && this.sql !== null
  }

  // Get database instance
  static getDatabase() {
    return this.sql
  }
}
