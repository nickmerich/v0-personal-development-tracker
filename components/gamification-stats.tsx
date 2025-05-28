"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Zap, Target, Flame } from "lucide-react"

interface GamificationStatsProps {
  gamification: {
    level: number
    xp: number
    totalXp: number
    streak: number
    achievements: string[]
    badges: string[]
  }
}

export function GamificationStats({ gamification }: GamificationStatsProps) {
  const xpForNextLevel = gamification.level * 100
  const currentLevelXp = gamification.xp
  const progressToNextLevel = (currentLevelXp / xpForNextLevel) * 100

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-forest-800">Level</CardTitle>
          <Trophy className="h-4 w-4 text-forest-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-forest-800">{gamification.level}</div>
          <div className="space-y-1">
            <p className="text-xs text-stone-600">
              {currentLevelXp}/{xpForNextLevel} XP
            </p>
            <Progress value={progressToNextLevel} className="h-1 bg-stone-100" indicatorClassName="bg-forest-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-forest-800">Total XP</CardTitle>
          <Zap className="h-4 w-4 text-earth-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-forest-800">{gamification.totalXp.toLocaleString()}</div>
          <p className="text-xs text-stone-600">Experience points earned</p>
        </CardContent>
      </Card>

      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-forest-800">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-earth-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-forest-800">{gamification.streak}</div>
          <p className="text-xs text-stone-600">Days in a row</p>
        </CardContent>
      </Card>

      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-forest-800">Achievements</CardTitle>
          <Target className="h-4 w-4 text-forest-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-forest-800">{gamification.achievements.length}</div>
          <p className="text-xs text-stone-600">Unlocked badges</p>
        </CardContent>
      </Card>
    </div>
  )
}
