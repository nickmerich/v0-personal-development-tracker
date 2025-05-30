"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MountainContractProps {
  onComplete: () => void
  defaultGoal?: string
  defaultWhy?: string
}

export function MountainContract({ onComplete, defaultGoal = "", defaultWhy = "" }: MountainContractProps) {
  const [signed, setSigned] = useState(false)
  const today = new Date().toLocaleDateString()

  return (
    <Card className="border-forest-200 bg-white/90 backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
          <Mountain className="h-6 w-6 text-forest-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-forest-800">Your 90-Day Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 border-2 border-forest-200 rounded-lg bg-forest-50 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-forest-800 uppercase tracking-wider">The Gryt</h3>
            <p className="text-sm text-forest-600">90-Day Mountain Contract</p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-forest-700">My Summit Goal:</h4>
              <p className="p-2 bg-white rounded border border-forest-200 text-forest-800">{defaultGoal}</p>
            </div>

            <div>
              <h4 className="font-medium text-forest-700">My Why:</h4>
              <p className="p-2 bg-white rounded border border-forest-200 text-forest-800">{defaultWhy}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-forest-700">My Commitment:</h4>
              <p className="text-forest-800">
                I commit to showing up daily for 90 days. I will complete my non-negotiables, track my progress
                honestly, and push through resistance. I understand that this journey requires consistency and
                discipline. I am responsible for my own climb.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-forest-700">I Understand:</h4>
              <ul className="space-y-1 text-sm text-forest-800">
                <li>• The mountain doesn't care about my excuses</li>
                <li>• One slip doesn't break my climb—quitting does</li>
                <li>• Motivation is temporary, discipline is reliable</li>
                <li>• Every step up builds the life I want</li>
                <li>• The summit is earned, not given</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-forest-200 flex justify-between items-center">
              <div>
                <p className="text-sm text-forest-700">Date: {today}</p>
              </div>
              <div>
                <Button
                  onClick={() => setSigned(true)}
                  className={cn(
                    "bg-forest-600 hover:bg-forest-700 text-white",
                    signed && "bg-forest-700 opacity-90 pointer-events-none",
                  )}
                  disabled={signed}
                >
                  {signed ? (
                    <>
                      <Check className="mr-1 h-4 w-4" /> Signed
                    </>
                  ) : (
                    "Sign Contract"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={onComplete}
          disabled={!signed}
          className="w-full bg-earth-600 text-white hover:bg-earth-700 shadow-lg"
        >
          Begin My 90-Day Climb
        </Button>
      </CardContent>
    </Card>
  )
}
