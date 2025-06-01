"use client"

import { SetupRecovery } from "@/components/setup-recovery"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SetupHelp() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-stone-50 to-red-100 p-4">
      <div className="w-full max-w-md mb-6">
        <Link href="/">
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <SetupRecovery />

      <div className="w-full max-w-md mt-6 text-center">
        <p className="text-sm text-gray-600">
          Need more help? Contact support at{" "}
          <a href="mailto:support@thegryt.com" className="text-red-600 hover:underline">
            support@thegryt.com
          </a>
        </p>
      </div>
    </div>
  )
}
