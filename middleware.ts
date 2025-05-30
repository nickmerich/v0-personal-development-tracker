import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  // Get setup completion status from headers (set by client-side)
  const setupComplete = request.cookies.get("setupComplete")?.value === "true"
  const hasUserData = request.cookies.get("hasUserData")?.value === "true"

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!hasUserData || !setupComplete) {
      return NextResponse.redirect(new URL("/setup/personal-info", request.url))
    }
  }

  // Protect task routes
  if (pathname.startsWith("/tasks")) {
    if (!hasUserData || !setupComplete) {
      return NextResponse.redirect(new URL("/setup/personal-info", request.url))
    }
  }

  // Protect templates routes
  if (pathname.startsWith("/templates")) {
    if (!hasUserData || !setupComplete) {
      return NextResponse.redirect(new URL("/setup/personal-info", request.url))
    }
  }

  // Protect settings routes
  if (pathname.startsWith("/settings")) {
    if (!hasUserData || !setupComplete) {
      return NextResponse.redirect(new URL("/setup/personal-info", request.url))
    }
  }

  // Redirect from setup pages if already completed
  if (pathname.startsWith("/setup") && setupComplete && hasUserData) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect root to appropriate page
  if (pathname === "/") {
    if (hasUserData && setupComplete) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else if (hasUserData && !setupComplete) {
      return NextResponse.redirect(new URL("/setup/personal-info", request.url))
    }
    // Stay on landing page if no user data
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
