import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/getting-started",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/me",
]

// Paths that require setup to be completed
const SETUP_PATHS = [
  "/setup",
  "/setup/personal-info",
  "/setup/my-why",
  "/setup/big-goal",
  "/setup/categories",
  "/setup/calendar-preferences",
]

// Paths that require authentication
const AUTH_PATHS = ["/dashboard", "/profile", "/settings", "/calendar", "/templates", "/tasks"]

// Helper function to check if a path starts with any of the given prefixes
const pathStartsWith = (path: string, prefixes: string[]): boolean => {
  return prefixes.some((prefix) => path.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static assets and API routes (except auth)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    (pathname.startsWith("/api") && !pathname.startsWith("/api/auth"))
  ) {
    return NextResponse.next()
  }

  // Check for authentication via cookies
  const hasSession = request.cookies.has("session")
  const hasUserData = request.cookies.has("hasUserData")
  const setupComplete = request.cookies.has("setupComplete")

  // Public paths are always accessible
  if (PUBLIC_PATHS.includes(pathname) || pathStartsWith(pathname, ["/api/auth"])) {
    return NextResponse.next()
  }

  // Setup paths require user data but not completed setup
  if (pathStartsWith(pathname, SETUP_PATHS)) {
    if (!hasUserData) {
      return NextResponse.redirect(new URL("/getting-started", request.url))
    }
    return NextResponse.next()
  }

  // Auth paths require authentication and completed setup
  if (pathStartsWith(pathname, AUTH_PATHS)) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!setupComplete) {
      // Redirect to the setup flow
      return NextResponse.redirect(new URL("/setup/personal-info", request.url))
    }

    return NextResponse.next()
  }

  // Default: allow access
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image|favicon.ico).*)"],
}
