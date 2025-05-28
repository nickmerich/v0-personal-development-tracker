"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, Star, Flame, Flag, Compass, Zap } from "lucide-react"

interface AchievementBadgesProps {
  achievements: string[]
}

const AVAILABLE_ACHIEVEMENTS = [
  {
    id: "first_day",
    name: "First Steps",
    description: "Begin your mountain expedition",
    icon: Star,
    color: "bg-earth-100 text-earth-800 border-earth-200",
  },
  {
    id: "week_streak",
    name: "Base Camp Warrior",
    description: "7 consecutive climbing days",
    icon: Flame,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    id: "milestone_master",
    name: "Peak Conqueror",
    description: "Reach 5 base camps",
    icon: Flag,
    color: "bg-forest-100 text-forest-800 border-forest-200",
  },
  {
    id: "journal_keeper",
    name: "Expedition Logger",
    description: "Log 10 expedition days",
    icon: Compass,
    color: "bg-stone-100 text-stone-800 border-stone-200",
  },
  {
    id: "level_up",
    name: "Altitude Master",
    description: "Reach elevation level 5",
    icon: Zap,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "consistency_king",
    name: "Summit Seeker",
    description: "30-day climbing streak",
    icon: Mountain,
    color: "bg-forest-100 text-forest-800 border-forest-200",
  },
]

export function AchievementBadges({ achievements }: AchievementBadgesProps) {
  const earnedAchievements = AVAILABLE_ACHIEVEMENTS.filter((achievement) => achievements.includes(achievement.id))

  const upcomingAchievements = AVAILABLE_ACHIEVEMENTS.filter(
    (achievement) => !achievements.includes(achievement.id),
  ).slice(0, 3)

  if (earnedAchievements.length === 0 && upcomingAchievements.length === 0) {
    return null
  }

  return (
    <Card className="mb-6 border-forest-200 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-forest-800 flex items-center gap-2">
          <Mountain className="h-5 w-5 text-forest-600" />
          Expedition Badges
        </CardTitle>
        <CardDescription className="text-stone-600">Your climbing achievements and next summit goals</CardDescription>
      </CardHeader>
      <CardContent>
        {earnedAchievements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-forest-800 mb-2">🏔️ Earned Badges</h4>
            <div className="flex flex-wrap gap-2">
              {earnedAchievements.map((achievement) => {
                const IconComponent = achievement.icon
                return (
                  <Badge
                    key={achievement.id}
                    variant="secondary"
                    className={`${achievement.color} flex items-center gap-1 px-3 py-1`}
                  >
                    <IconComponent className="h-3 w-3" />
                    {achievement.name}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {upcomingAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-forest-800 mb-2">🎯 Next Summit Goals</h4>
            <div className="space-y-2">
              {upcomingAchievements.map((achievement) => {
                const IconComponent = achievement.icon
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-2 rounded-md bg-stone-50 border border-stone-200"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200">
                      <IconComponent className="h-4 w-4 text-stone-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-forest-800">{achievement.name}</p>
                      <p className="text-xs text-stone-600">{achievement.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
