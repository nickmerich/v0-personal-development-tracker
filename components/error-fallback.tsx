"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorFallbackProps {
  error: Error
  reset: () => void
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 to-stone-50 p-4">
      <Card className="w-full max-w-md border-red-200 bg-white shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">Building Interrupted</CardTitle>
          <CardDescription className="text-red-600">
            We hit a snag in your building journey. Let's get back on track.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={reset} className="w-full bg-forest-600 text-white hover:bg-forest-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Resume Building
            </Button>

            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="w-full border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              <Home className="mr-2 h-4 w-4" />
              Start Fresh
            </Button>
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer text-stone-600 hover:text-stone-800 font-medium">
              Technical details
            </summary>
            <div className="mt-2 p-3 bg-stone-100 rounded text-xs overflow-auto max-h-32">
              <pre className="whitespace-pre-wrap">{error.message}</pre>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}
