"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Heart, HelpCircle } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function MyWhy() {
  const router = useRouter()
  const [myWhy, setMyWhy] = useState("")

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    if (userData.myWhy) {
      setMyWhy(userData.myWhy)
    }
  }, [])

  const handleNext = () => {
    if (!myWhy.trim()) return

    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...userData,
        myWhy,
      }),
    )

    router.push("/setup/big-goal")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-forest-50 via-stone-50 to-forest-100 p-4">
      <Card className="w-full max-w-md border-forest-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <SetupProgress currentStep={2} totalSteps={5} />
          <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
            <Heart className="h-6 w-6 text-forest-600" />
          </div>
          <div className="flex items-center justify-center mt-4">
            <CardTitle className="text-2xl font-bold text-forest-800">Your Why</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <HelpCircle className="h-4 w-4 text-forest-600" />
                    <span className="sr-only">Help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-white border-forest-200">
                  <p className="text-forest-800">
                    Your "why" is the deeper reason that motivates you to improve. It's what will keep you going when
                    things get tough.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="text-center text-stone-600">
            What motivates you to grow and improve? What's your deeper purpose?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-forest-50 rounded-lg border border-forest-200">
              <h4 className="font-medium text-forest-800 mb-2">Examples from others:</h4>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• "To be the best role model for my children"</li>
                <li>• "To honor those who believed in me by reaching my potential"</li>
                <li>• "To overcome my fears and build unshakeable confidence"</li>
                <li>• "To create the life my family deserves"</li>
              </ul>
            </div>

            <Textarea
              placeholder="Write about what drives you to improve... What motivates you? Who are you doing this for? What will achieving your goals mean to you and those you love?"
              className="min-h-[120px] border-forest-300 focus:border-forest-500 focus:ring-forest-200"
              value={myWhy}
              onChange={(e) => setMyWhy(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/setup/personal-info")}
            className="border-forest-300 text-forest-600 hover:bg-forest-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!myWhy.trim()}
            className="bg-forest-600 text-white hover:bg-forest-700 shadow-lg"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
