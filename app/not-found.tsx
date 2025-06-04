"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 to-stone-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">🏗️</div>
          <CardTitle className="text-2xl font-bold text-forest-800">Page Under Construction</CardTitle>
          <CardDescription className="text-forest-600">
            This page is still being built. Let's get you back to building your habits!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Link href="/">
              <Button className="w-full bg-forest-600 text-white hover:bg-forest-700">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </Link>

            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
