"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TestTube } from "lucide-react"
import Link from "next/link"

export function AuthTestLink() {
  const [showTestLink, setShowTestLink] = useState(false)

  // Show test link in development or when explicitly requested
  if (process.env.NODE_ENV === "production" && !showTestLink) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setShowTestLink(true)} className="text-xs">
        <TestTube className="h-3 w-3 mr-1" />
        Dev Tools
      </Button>
    )
  }

  return (
    <Link href="/auth-test">
      <Button variant="outline" size="sm">
        <TestTube className="h-4 w-4 mr-2" />
        Test Auth
      </Button>
    </Link>
  )
}
