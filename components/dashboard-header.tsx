"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Calendar, BookOpen, Sparkles } from "lucide-react"
import { EnhancedJournalModal } from "@/components/enhanced-journal-modal"

interface DashboardHeaderProps {
  name: string
  startDate: string
}

export function DashboardHeader({ name, startDate }: DashboardHeaderProps) {
  const router = useRouter()
  const [dayNumber, setDayNumber] = useState(1)
  const [showJournal, setShowJournal] = useState(false)

  useEffect(() => {
    const start = new Date(startDate)
    const today = new Date()

    start.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const diffTime = today.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    setDayNumber(diffDays > 0 ? diffDays : 1)
  }, [startDate])

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out? Your data will still be saved.")) {
      router.push("/")
    }
  }

  return (
    <>
      <header className="bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg">
        <div className="container mx-auto p-4">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Day {dayNumber} of 90</h1>
              <p className="text-forest-100">Welcome back, {name}!</p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 min-h-[40px] min-w-[100px] transition-all duration-200 hover:scale-105"
                onClick={() => setShowJournal(true)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Journal
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                onClick={() => router.push("/templates")}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Templates
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                onClick={() => router.push("/calendar")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                onClick={() => router.push("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <EnhancedJournalModal
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
        date={new Date().toISOString().split("T")[0]}
      />
    </>
  )
}
