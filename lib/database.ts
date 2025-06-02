import { neon } from "@neondatabase/serverless"

// Use the environment variable with the provided connection string as fallback
const connectionString =
  process.env.NEON_NEON_NEON_NEON_DATABASE_URL ||
  "postgresql://neondb_owner:npg_QIW8j3bkHver@ep-steep-pond-a4puzhff-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

if (!connectionString) {
  throw new Error("Database connection string not found")
}

console.log("🔗 Database connection configured:", connectionString.replace(/:[^:@]*@/, ":***@"))

const sql = neon(connectionString)

export { sql }

export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
  setup_completed: boolean
}

export interface UserData {
  id: string
  user_id: string
  data_key: string
  data_value: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  session_token: string
  expires_at: string
  created_at: string
}

export class DatabaseService {
  // Test database connection with detailed diagnostics
  static async testConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log("🔍 Testing database connection...")
      console.log("🔗 Using connection string:", connectionString.replace(/:[^:@]*@/, ":***@"))

      const result = await sql`
        SELECT 
          NOW() as current_time,
          version() as postgres_version,
          current_database() as database_name,
          current_user as user_name,
          inet_server_addr() as server_ip,
          inet_server_port() as server_port
      `

      console.log("✅ Database connection successful!")
      console.log("📊 Connection details:", result[0])

      return {
        success: true,
        details: result[0],
      }
    } catch (error) {
      console.error("❌ Database connection failed:", error)

      // Enhanced error reporting
      let errorMessage = "Unknown connection error"
      if (error instanceof Error) {
        errorMessage = error.message
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack?.split("\n").slice(0, 3).join("\n"),
        })
      }

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  // Initialize database tables with comprehensive schema
  static async initializeTables(): Promise<{ success: boolean; error?: string; tablesCreated?: string[] }> {
    const tablesCreated: string[] = []

    try {
      console.log("🏗️ Initializing database tables...")

      // Create users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          setup_completed BOOLEAN DEFAULT FALSE,
          last_login TIMESTAMP WITH TIME ZONE,
          timezone VARCHAR(50) DEFAULT 'UTC'
        )
      `
      tablesCreated.push("users")

      // Create user_profiles table
      await sql`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          start_date DATE NOT NULL,
          my_why TEXT,
          big_goal TEXT,
          profile_picture_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        )
      `
      tablesCreated.push("user_profiles")

      // Create categories table
      await sql`
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          color VARCHAR(7) DEFAULT '#16a34a',
          icon VARCHAR(50),
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, name)
        )
      `
      tablesCreated.push("categories")

      // Create tasks table
      await sql`
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
      tablesCreated.push("tasks")

      // Create user_sessions table
      await sql`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          session_token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
      tablesCreated.push("user_sessions")

      // Create user_data table for flexible data storage
      await sql`
        CREATE TABLE IF NOT EXISTS user_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          data_key VARCHAR(255) NOT NULL,
          data_value JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, data_key)
        )
      `
      tablesCreated.push("user_data")

      // Create performance indexes
      console.log("📈 Creating performance indexes...")
      await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
      await sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, scheduled_date)`
      await sql`CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(user_id, completed, completed_at)`
      await sql`CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id, sort_order)`
      await sql`CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)`
      await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_user_data_key ON user_data(user_id, data_key)`

      // Create update triggers for updated_at columns
      console.log("⚡ Creating database triggers...")
      await sql`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql'
      `

      // Apply triggers to tables
      const triggerTables = ["users", "user_profiles", "tasks", "user_data"]
      for (const table of triggerTables) {
        await sql`
          DROP TRIGGER IF EXISTS ${sql(`update_${table}_updated_at`)} ON ${sql(table)};
          CREATE TRIGGER ${sql(`update_${table}_updated_at`)} 
            BEFORE UPDATE ON ${sql(table)}
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `
      }

      console.log("✅ Database tables initialized successfully")
      console.log("📋 Tables created:", tablesCreated)

      return {
        success: true,
        tablesCreated,
      }
    } catch (error) {
      console.error("❌ Error initializing database tables:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown initialization error",
        tablesCreated,
      }
    }
  }

  // Enhanced user management operations
  static async createUser(email: string, name: string): Promise<User | null> {
    try {
      console.log("👤 Creating user:", email)

      const result = await sql`
        INSERT INTO users (email, name)
        VALUES (${email}, ${name})
        RETURNING *
      `

      console.log("✅ User created successfully:", result[0].email)
      return result[0] as User
    } catch (error) {
      console.error("❌ Error creating user:", error)

      // Check for duplicate email error
      if (error instanceof Error && error.message.includes("duplicate key")) {
        console.log("ℹ️ User already exists, fetching existing user")
        return await this.getUserByEmail(email)
      }

      return null
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await sql`
        SELECT * FROM users WHERE email = ${email}
      `
      return (result[0] as User) || null
    } catch (error) {
      console.error("❌ Error getting user by email:", error)
      return null
    }
  }

  static async getUserById(userId: string): Promise<User | null> {
    try {
      const result = await sql`
        SELECT * FROM users WHERE id = ${userId}
      `
      return (result[0] as User) || null
    } catch (error) {
      console.error("❌ Error getting user by ID:", error)
      return null
    }
  }

  // Enhanced user data operations
  static async saveUserData(userId: string, dataKey: string, dataValue: any): Promise<boolean> {
    try {
      console.log(`💾 Saving user data: ${dataKey} for user ${userId}`)

      await sql`
        INSERT INTO user_data (user_id, data_key, data_value)
        VALUES (${userId}, ${dataKey}, ${JSON.stringify(dataValue)})
        ON CONFLICT (user_id, data_key) 
        DO UPDATE SET 
          data_value = EXCLUDED.data_value,
          updated_at = NOW()
      `

      console.log(`✅ User data saved: ${dataKey}`)
      return true
    } catch (error) {
      console.error("❌ Error saving user data:", error)
      return false
    }
  }

  static async getUserData(userId: string, dataKey?: string): Promise<any> {
    try {
      let result
      if (dataKey) {
        result = await sql`
          SELECT data_value FROM user_data 
          WHERE user_id = ${userId} AND data_key = ${dataKey}
        `
        return result[0]?.data_value || null
      } else {
        result = await sql`
          SELECT data_key, data_value FROM user_data 
          WHERE user_id = ${userId}
        `
        const data: Record<string, any> = {}
        result.forEach((row: any) => {
          data[row.data_key] = row.data_value
        })
        return data
      }
    } catch (error) {
      console.error("❌ Error getting user data:", error)
      return null
    }
  }

  // Session management with enhanced security
  static async createSession(userId: string, sessionToken: string, expiresAt: Date): Promise<boolean> {
    try {
      await sql`
        INSERT INTO user_sessions (user_id, session_token, expires_at)
        VALUES (${userId}, ${sessionToken}, ${expiresAt.toISOString()})
      `
      console.log("✅ Session created for user:", userId)
      return true
    } catch (error) {
      console.error("❌ Error creating session:", error)
      return false
    }
  }

  static async getSessionUser(sessionToken: string): Promise<User | null> {
    try {
      const result = await sql`
        SELECT u.* FROM users u
        JOIN user_sessions s ON u.id = s.user_id
        WHERE s.session_token = ${sessionToken}
        AND s.expires_at > NOW()
      `
      return (result[0] as User) || null
    } catch (error) {
      console.error("❌ Error getting session user:", error)
      return null
    }
  }

  static async deleteSession(sessionToken: string): Promise<boolean> {
    try {
      await sql`
        DELETE FROM user_sessions WHERE session_token = ${sessionToken}
      `
      return true
    } catch (error) {
      console.error("❌ Error deleting session:", error)
      return false
    }
  }

  // Database maintenance and analytics
  static async cleanupExpiredSessions(): Promise<{ success: boolean; deletedCount?: number }> {
    try {
      const result = await sql`
        DELETE FROM user_sessions WHERE expires_at < NOW()
        RETURNING id
      `
      const deletedCount = result.length
      console.log(`🧹 Cleaned up expired sessions: ${deletedCount} removed`)
      return { success: true, deletedCount }
    } catch (error) {
      console.error("❌ Error cleaning up expired sessions:", error)
      return { success: false }
    }
  }

  // Enhanced analytics and reporting
  static async getDatabaseStats(): Promise<any> {
    try {
      const stats = await sql`
        SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM users WHERE setup_completed = true) as completed_setups,
          (SELECT COUNT(*) FROM tasks) as total_tasks,
          (SELECT COUNT(*) FROM tasks WHERE completed = true) as completed_tasks,
          (SELECT COUNT(*) FROM categories) as total_categories,
          (SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW()) as active_sessions,
          (SELECT COUNT(*) FROM user_data) as total_user_data_records
      `

      const tableStats = await sql`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes
        FROM pg_stat_user_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
      `

      return {
        ...stats[0],
        tableStats: tableStats,
      }
    } catch (error) {
      console.error("❌ Error getting database stats:", error)
      return null
    }
  }

  // Health check with comprehensive diagnostics
  static async healthCheck(): Promise<{
    success: boolean
    connectionTime?: number
    queryTime?: number
    tableCount?: number
    error?: string
  }> {
    const startTime = Date.now()

    try {
      // Test connection
      const connectionStart = Date.now()
      await sql`SELECT 1`
      const connectionTime = Date.now() - connectionStart

      // Test query performance
      const queryStart = Date.now()
      const tableResult = await sql`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      const queryTime = Date.now() - queryStart

      return {
        success: true,
        connectionTime,
        queryTime,
        tableCount: Number.parseInt(tableResult[0].table_count),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Export convenience functions
export async function testDatabaseConnection() {
  return await DatabaseService.testConnection()
}

export async function initializeDatabase() {
  return await DatabaseService.initializeTables()
}

export async function getDatabaseHealth() {
  return await DatabaseService.healthCheck()
}
