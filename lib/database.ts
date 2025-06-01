import { neon } from "@neondatabase/serverless"

// Use the correct environment variable name
const sql = neon(process.env.NEON_NEON_DATABASE_URL || process.env.DATABASE_URL || "")

export { sql }

export interface User {
  id: number
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface UserData {
  id: number
  user_id: number
  data_key: string
  data_value: Record<string, any>
  created_at: string
  updated_at: string
}

export class DatabaseService {
  // Initialize database tables
  static async initializeTables() {
    try {
      // Create users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Create user_data table
      await sql`
        CREATE TABLE IF NOT EXISTS user_data (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          data_key VARCHAR(255) NOT NULL,
          data_value JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, data_key)
        )
      `

      // Create user_sessions table
      await sql`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          session_token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Create indexes
      await sql`CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token)`
      await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`

      // Create update function
      await sql`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql'
      `

      // Create triggers
      await sql`
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
      `

      await sql`
        DROP TRIGGER IF EXISTS update_user_data_updated_at ON user_data;
        CREATE TRIGGER update_user_data_updated_at BEFORE UPDATE ON user_data
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
      `

      console.log("Database tables initialized successfully")
      return { success: true }
    } catch (error) {
      console.error("Error initializing database tables:", error)
      return { success: false, error }
    }
  }

  // User management
  static async createUser(email: string, name: string): Promise<User | null> {
    try {
      const result = await sql`
        INSERT INTO users (email, name)
        VALUES (${email}, ${name})
        RETURNING *
      `
      return result[0] as User
    } catch (error) {
      console.error("Error creating user:", error)
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
      console.error("Error getting user by email:", error)
      return null
    }
  }

  static async getUserById(userId: number): Promise<User | null> {
    try {
      const result = await sql`
        SELECT * FROM users WHERE id = ${userId}
      `
      return (result[0] as User) || null
    } catch (error) {
      console.error("Error getting user by ID:", error)
      return null
    }
  }

  // User data management
  static async saveUserData(userId: number, userData: Partial<UserData>): Promise<boolean> {
    try {
      // Check if user data exists
      const existing = await sql`
        SELECT id FROM user_data WHERE user_id = ${userId}
      `

      if (existing.length > 0) {
        // Update existing data
        for (const key in userData) {
          if (userData.hasOwnProperty(key)) {
            await sql`
              INSERT INTO user_data (user_id, data_key, data_value)
              VALUES (${userId}, ${key}, ${JSON.stringify(userData[key])})
              ON CONFLICT (user_id, data_key) DO UPDATE SET
                data_value = EXCLUDED.data_value,
                updated_at = NOW()
            `
          }
        }
      } else {
        // Insert new data
        for (const key in userData) {
          if (userData.hasOwnProperty(key)) {
            await sql`
              INSERT INTO user_data (user_id, data_key, data_value)
              VALUES (${userId}, ${key}, ${JSON.stringify(userData[key])})
            `
          }
        }
      }

      return true
    } catch (error) {
      console.error("Error saving user data:", error)
      return false
    }
  }

  static async getUserData(userId: number): Promise<UserData | null> {
    try {
      const result = await sql`
        SELECT * FROM user_data WHERE user_id = ${userId}
      `

      if (result.length === 0) return null

      const data = result.reduce(
        (acc, curr) => {
          acc[curr.data_key] = curr.data_value
          return acc
        },
        {} as Record<string, any>,
      )

      return {
        id: result[0].id,
        user_id: result[0].user_id,
        ...data,
        created_at: result[0].created_at,
        updated_at: result[0].updated_at,
      } as UserData
    } catch (error) {
      console.error("Error getting user data:", error)
      return null
    }
  }

  // Session management
  static async createSession(userId: number, sessionToken: string, expiresAt: Date): Promise<boolean> {
    try {
      await sql`
        INSERT INTO user_sessions (user_id, session_token, expires_at)
        VALUES (${userId}, ${sessionToken}, ${expiresAt.toISOString()})
      `
      return true
    } catch (error) {
      console.error("Error creating session:", error)
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
      console.error("Error getting session user:", error)
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
      console.error("Error deleting session:", error)
      return false
    }
  }

  static async cleanupExpiredSessions(): Promise<boolean> {
    try {
      await sql`
        DELETE FROM user_sessions WHERE expires_at < NOW()
      `
      return true
    } catch (error) {
      console.error("Error cleaning up expired sessions:", error)
      return false
    }
  }
}

export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    return { success: true, result }
  } catch (error) {
    console.error("Database connection error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
