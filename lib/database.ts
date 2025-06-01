import { neon } from "@neondatabase/serverless"

// Update the database URL to use the correct environment variable
const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface UserData {
  id: string
  user_id: string
  start_date?: string
  my_why?: string
  big_goal?: string
  categories: string[]
  tasks: Record<string, any[]>
  milestones: any[]
  journal_entries: Record<string, any>
  affirmations: string[]
  gamification: any
  applied_templates: any[]
  notification_settings: any
  calendar_preferences: any
  setup_completed: boolean
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
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `

      // Create user_data table
      await sql`
        CREATE TABLE IF NOT EXISTS user_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          start_date DATE,
          my_why TEXT,
          big_goal TEXT,
          categories JSONB DEFAULT '[]'::jsonb,
          tasks JSONB DEFAULT '{}'::jsonb,
          milestones JSONB DEFAULT '[]'::jsonb,
          journal_entries JSONB DEFAULT '{}'::jsonb,
          affirmations JSONB DEFAULT '[]'::jsonb,
          gamification JSONB DEFAULT '{}'::jsonb,
          applied_templates JSONB DEFAULT '[]'::jsonb,
          notification_settings JSONB DEFAULT '{}'::jsonb,
          calendar_preferences JSONB DEFAULT '{}'::jsonb,
          setup_completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        )
      `

      // Create sessions table
      await sql`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          session_token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

  static async getUserById(userId: string): Promise<User | null> {
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
  static async saveUserData(userId: string, userData: Partial<UserData>): Promise<boolean> {
    try {
      // Check if user data exists
      const existing = await sql`
        SELECT id FROM user_data WHERE user_id = ${userId}
      `

      if (existing.length > 0) {
        // Update existing data
        await sql`
          UPDATE user_data SET
            start_date = ${userData.start_date || null},
            my_why = ${userData.my_why || null},
            big_goal = ${userData.big_goal || null},
            categories = ${JSON.stringify(userData.categories || [])},
            tasks = ${JSON.stringify(userData.tasks || {})},
            milestones = ${JSON.stringify(userData.milestones || [])},
            journal_entries = ${JSON.stringify(userData.journal_entries || {})},
            affirmations = ${JSON.stringify(userData.affirmations || [])},
            gamification = ${JSON.stringify(userData.gamification || {})},
            applied_templates = ${JSON.stringify(userData.applied_templates || [])},
            notification_settings = ${JSON.stringify(userData.notification_settings || {})},
            calendar_preferences = ${JSON.stringify(userData.calendar_preferences || {})},
            setup_completed = ${userData.setup_completed || false}
          WHERE user_id = ${userId}
        `
      } else {
        // Insert new data
        await sql`
          INSERT INTO user_data (
            user_id, start_date, my_why, big_goal, categories, tasks, milestones,
            journal_entries, affirmations, gamification, applied_templates,
            notification_settings, calendar_preferences, setup_completed
          ) VALUES (
            ${userId},
            ${userData.start_date || null},
            ${userData.my_why || null},
            ${userData.big_goal || null},
            ${JSON.stringify(userData.categories || [])},
            ${JSON.stringify(userData.tasks || {})},
            ${JSON.stringify(userData.milestones || [])},
            ${JSON.stringify(userData.journal_entries || {})},
            ${JSON.stringify(userData.affirmations || [])},
            ${JSON.stringify(userData.gamification || {})},
            ${JSON.stringify(userData.applied_templates || [])},
            ${JSON.stringify(userData.notification_settings || {})},
            ${JSON.stringify(userData.calendar_preferences || {})},
            ${userData.setup_completed || false}
          )
        `
      }

      return true
    } catch (error) {
      console.error("Error saving user data:", error)
      return false
    }
  }

  static async getUserData(userId: string): Promise<UserData | null> {
    try {
      const result = await sql`
        SELECT * FROM user_data WHERE user_id = ${userId}
      `

      if (result.length === 0) return null

      const data = result[0]
      return {
        ...data,
        categories: data.categories || [],
        tasks: data.tasks || {},
        milestones: data.milestones || [],
        journal_entries: data.journal_entries || {},
        affirmations: data.affirmations || [],
        gamification: data.gamification || {},
        applied_templates: data.applied_templates || [],
        notification_settings: data.notification_settings || {},
        calendar_preferences: data.calendar_preferences || {},
      } as UserData
    } catch (error) {
      console.error("Error getting user data:", error)
      return null
    }
  }

  // Session management
  static async createSession(userId: string, sessionToken: string, expiresAt: Date): Promise<boolean> {
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
