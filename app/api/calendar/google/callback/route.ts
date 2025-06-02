import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return new Response(
      `
      <html>
        <body>
          <script>
            window.opener.postMessage({ success: false, error: '${error}' }, '*');
            window.close();
          </script>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    )
  }

  if (code) {
    // In a real implementation, exchange code for access token
    // Store the token securely for the user

    return new Response(
      `
      <html>
        <body>
          <script>
            window.opener.postMessage({ success: true, provider: 'google' }, '*');
            window.close();
          </script>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    )
  }

  return NextResponse.json({ error: "No authorization code received" }, { status: 400 })
}
