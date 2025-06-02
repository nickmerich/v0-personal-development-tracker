import { neon } from "@neondatabase/serverless"
import { DatabaseDiagnostics } from "./database-diagnostics"

export interface DatabaseConfig {
  url?: string
  maxRetries?: number
  retryDelay?: number
  timeout?: number
}

export interface DatabaseStatus {
  connected: boolean
  mode: "database" | "localStorage" | "offline"
  lastError?: string
  diagnostics?: any[]
}

export class EnhancedDatabaseService {
  private static sql: any = null
  private static config: DatabaseConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 10000,
  }
  private static status: DatabaseStatus = {
    connected: false,
    mode: "localStorage",
  }

  /**
   * Initialize database connection with comprehensive error handling
   */
  static async initialize(config?: Partial<DatabaseConfig>): Promise<DatabaseStatus> {
    this.config = { ...this.config, ...config }

    try {
      // Step 1: Run diagnostics
      console.log("🔍 Running database diagnostics...")
      const diagnostic = await DatabaseDiagnostics.runFullDiagnostic()

      this.status.diagnostics = diagnostic.diagnostics

      if (!diagnostic.success) {
        console.warn("⚠️ Database diagnostics failed:", diagnostic.recommendedAction)
        this.status.lastError = diagnostic.recommendedAction
        return this.status
      }

      // Step 2: Get database URL
      const databaseUrl = this.getDatabaseUrl()
      if (!databaseUrl) {
        console.warn("⚠️ No database URL found, using localStorage mode")
        this.status.mode = "localStorage"
        return this.status
      }

      // Step 3: Establish connection with retries
      await this.connectWithRetry(databaseUrl)

      // Step 4: Initialize schema
      await this.initializeSchema()

      this.status.connected = true
      this.status.mode = "database"
      console.log("✅ Database connection established successfully")

      return this.status
    } catch (error) {
      console.error("❌ Database initialization failed:", error)
      this.status.lastError = error instanceof Error ? error.message : "Unknown error"
      this.status.mode = "localStorage"
      return this.status
    }
  }

  /**
   * Connect to database with retry logic
   */
  private static async connectWithRetry(databaseUrl: string): Promise<void> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.maxRetries!; attempt++) {
      try {
        console.log(`🔄 Database connection attempt ${attempt}/${this.config.maxRetries}`)

        this.sql = neon(databaseUrl)

        // Test connection with timeout
        const testPromise = this.sql`SELECT 1 as test, NOW() as timestamp`
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Connection timeout")), this.config.timeout),
        )

        await Promise.race([testPromise, timeoutPromise])

        console.log(`✅ Database connected on attempt ${attempt}`)
        return
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown connection error")
        console.warn(`⚠️ Connection attempt ${attempt} failed:`, lastError.message)

        if (attempt < this.config.maxRetries!) {
          await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay! * attempt))
        }
      }
    }

    throw lastError || new Error("All connection attempts failed")
  }

  /**
   * Initialize database schema
   */
  private static async initializeSchema(): Promise<void> {
    if (!this.sql) throw new Error("Database not connected")

    console.log("🏗️ Initializing database schema...")

    try {
      // Create users table
      await this.sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          setup_completed BOOLEAN DEFAULT FALSE,
          timezone VARCHAR(50) DEFAULT 'UTC'
        )
      `

      // Create user_profiles table
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

      // Create categories table
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

      // Create tasks table
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

      // Create performance indexes
      await this.sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, scheduled_date)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(user_id, completed)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id)`

      console.log("✅ Database schema initialized successfully")
    } catch (error) {
      console.error("❌ Schema initialization failed:", error)
      throw error
    }
  }

  /**
   * Get database URL from environment variables
   */
  private static getDatabaseUrl(): string | null {
    const envVars = [
      "NEON_NEON_DATABASE_URL",
      "DATABASE_URL",
      "POSTGRES_URL",
      "NEON_POSTGRES_URL",
      "NEON_NEON_DATABASE_URL",
    ]

    for (const varName of envVars) {
      const value = process.env[varName]
      if (value && value.trim().length > 0) {
        console.log(`📍 Using database URL from ${varName}`)
        return value.trim()
      }
    }

    console.warn("⚠️ No database URL found in environment variables:", envVars)
    return null
  }

  /**
   * Execute SQL query with error handling
   */
  static async query(queryFn: (sql: any) => Promise<any>): Promise<any> {
    if (!this.sql) {
      throw new Error("Database not connected. Use localStorage mode instead.")
    }

    try {
      return await queryFn(this.sql)
    } catch (error) {
      console.error("Database query failed:", error)
      throw error
    }
  }

  /**
   * Get current database status
   */
  static getStatus(): DatabaseStatus {
    return { ...this.status }
  }

  /**
   * Check if database is available
   */
  static isAvailable(): boolean {
    return this.status.connected && this.sql !== null
  }

  /**
   * Get database instance (use with caution)
   */
  static getDatabase() {
    return this.sql
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      if (!this.sql) return false
      await this.sql`SELECT 1`
      return true
    } catch {
      return false
    }
  }
}
