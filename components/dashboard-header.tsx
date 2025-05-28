"use client"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  isPro: boolean
}

export const DashboardHeader = ({ isPro }: DashboardHeaderProps) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <nav className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className={cn("text-white hover:bg-white/20", pathname === "/dashboard" && "bg-white/20")}
        >
          Dashboard
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/templates")}
          className={cn("text-white hover:bg-white/20", pathname === "/templates" && "bg-white/20")}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Templates
        </Button>
      </nav>
    </div>
  )
}
