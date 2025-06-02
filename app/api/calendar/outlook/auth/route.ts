import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("clientId")
  const redirectUri = searchParams.get("redirectUri")
  const scope = searchParams.get("scope")

  // Microsoft OAuth endpoint
  const microsoftAuthUrl =
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri || "")}&` +
    `scope=${encodeURIComponent(scope || "")}&` +
    `response_type=code&` +
    `response_mode=query`

  return NextResponse.redirect(microsoftAuthUrl)
}
