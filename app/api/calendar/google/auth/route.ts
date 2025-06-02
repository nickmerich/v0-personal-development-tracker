import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("clientId")
  const redirectUri = searchParams.get("redirectUri")
  const scope = searchParams.get("scope")

  // In a real implementation, this would redirect to Google OAuth
  const googleAuthUrl =
    `https://accounts.google.com/oauth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri || "")}&` +
    `scope=${encodeURIComponent(scope || "")}&` +
    `response_type=code&` +
    `access_type=offline`

  return NextResponse.redirect(googleAuthUrl)
}
