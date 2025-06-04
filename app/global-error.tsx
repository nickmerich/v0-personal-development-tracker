"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-red-800 mb-4">🏗️ Building System Error</h1>
            <p className="text-red-600 mb-6">
              A critical error occurred in the building system. Let's restart the construction process.
            </p>
            <div className="space-y-3">
              <Button onClick={reset} className="w-full bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-lg">
                Restart Building System
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 px-6 py-3 text-lg"
              >
                Return to Foundation
              </Button>
            </div>
            <details className="mt-6 text-sm text-left">
              <summary className="cursor-pointer text-red-700 font-medium">Error Details</summary>
              <pre className="mt-2 p-3 bg-red-100 rounded text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                {error.message}
              </pre>
            </details>
          </div>
        </div>
      </body>
    </html>
  )
}
