"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowRight, Mountain } from "lucide-react"

export default function SetupCompletePage() {
  const router = useRouter()

  useEffect(() => {
    document.title = "Setup Complete | Taskify"
  }, [])

  const handleContinueToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-[500px] shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-forest-800 mb-2">🎉 Welcome to The Gryt!</CardTitle>
          <p className="text-lg text-stone-600">Your building journey is ready to begin</p>
        </CardHeader>
        <CardContent className="text-center">
          <h3 className="text-xl font-bold text-forest-800 mb-4 flex items-center gap-2">
            <Mountain className="h-5 w-5" />
            Your Building Foundation is Ready
          </h3>
          <Button
            onClick={handleContinueToDashboard}
            size="lg"
            className="bg-forest-600 text-white hover:bg-forest-700 shadow-lg px-8 py-4 text-lg"
          >
            Start Building
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-xs text-stone-500 mt-2">Your 90-day building journey starts now!</p>
        </CardContent>
      </Card>
    </div>
  )
}
