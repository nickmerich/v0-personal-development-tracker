"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Mountain, Compass, Flag } from "lucide-react"

interface JournalModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
}

const EXPEDITION_PROMPTS = [
  "What terrain did I navigate successfully today?",
  "What obstacles did I overcome on my climb?",
  "How did I grow stronger as a climber today?",
  "What progress did I make toward my summit?",
  "What lesson did the mountain teach me today?",
  "How did I support my fellow climbers or myself?",
  "What am I excited to climb tomorrow?",
  "If I could re-climb today, what route would I take?",
]

const WEATHER_OPTIONS = [
  { value: "summit", label: "Summit Weather", emoji: "🏔️", color: "text-forest-600" },
  { value: "clear", label: "Clear Skies", emoji: "☀️", color: "text-earth-600" },
  { value: "partly_cloudy", label: "Partly Cloudy", emoji: "⛅", color: "text-stone-600" },
  { value: "overcast", label: "Overcast", emoji: "☁️", color: "text-stone-500" },
  { value: "stormy", label: "Stormy", emoji: "⛈️", color: "text-stone-700" },
  { value: "foggy", label: "Foggy", emoji: "🌫️", color: "text-stone-600" },
]

export function JournalModal({ isOpen, onClose, date }: JournalModalProps) {
  const [entry, setEntry] = useState("")
  const [weather, setWeather] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [gratitude, setGratitude] = useState("")
  const [victories, setVictories] = useState("")
  const [challenges, setChallenges] = useState("")

  useEffect(() => {
    if (isOpen) {
      // Load existing expedition log for the date
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const existingEntry = userData.journalEntries?.[date]

      if (existingEntry) {
        setEntry(existingEntry.entry || "")
        setWeather(existingEntry.weather || "")
        setGratitude(existingEntry.gratitude || "")
        setVictories(existingEntry.victories || "")
        setChallenges(existingEntry.challenges || "")
      } else {
        // Reset form for new entry
        setEntry("")
        setWeather("")
        setGratitude("")
        setVictories("")
        setChallenges("")
        setSelectedPrompt("")
      }
    }
  }, [isOpen, date])

  const handleSave = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")

    if (!userData.journalEntries) {
      userData.journalEntries = {}
    }

    userData.journalEntries[date] = {
      entry,
      weather,
      gratitude,
      victories,
      challenges,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("userData", JSON.stringify(userData))
    onClose()
  }

  const insertPrompt = () => {
    if (selectedPrompt) {
      setEntry((prev) => prev + (prev ? "\n\n" : "") + selectedPrompt + "\n")
      setSelectedPrompt("")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const selectedWeatherOption = WEATHER_OPTIONS.find((option) => option.value === weather)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-forest-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-forest-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-forest-600" />
            Expedition Log - {formatDate(date)}
          </DialogTitle>
          <DialogDescription className="text-stone-600">
            Record your daily climb, weather conditions, and progress toward your summit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Weather Tracker */}
          <div className="space-y-2">
            <Label className="text-forest-800 flex items-center gap-2">
              <Mountain className="h-4 w-4 text-forest-600" />
              Today's Mountain Weather
            </Label>
            <Select value={weather} onValueChange={setWeather}>
              <SelectTrigger className="border-forest-300 focus:border-forest-500">
                <SelectValue placeholder="How were the conditions today?">
                  {selectedWeatherOption && (
                    <span className="flex items-center gap-2">
                      <span className={selectedWeatherOption.color}>{selectedWeatherOption.emoji}</span>
                      {selectedWeatherOption.label}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-forest-200">
                {WEATHER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <span className={option.color}>{option.emoji}</span>
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Reflection Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-forest-200">
              <CardContent className="p-4">
                <Label className="text-forest-800 flex items-center gap-2 mb-2">
                  <Mountain className="h-4 w-4 text-forest-600" />
                  Mountain Gratitude
                </Label>
                <Textarea
                  placeholder="What gifts did the mountain give you today?"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  className="min-h-[80px] border-forest-300 focus:border-forest-500"
                />
              </CardContent>
            </Card>

            <Card className="border-forest-200">
              <CardContent className="p-4">
                <Label className="text-forest-800 flex items-center gap-2 mb-2">
                  <Flag className="h-4 w-4 text-forest-600" />
                  Summit Victories
                </Label>
                <Textarea
                  placeholder="What peaks did you conquer today?"
                  value={victories}
                  onChange={(e) => setVictories(e.target.value)}
                  className="min-h-[80px] border-forest-300 focus:border-forest-500"
                />
              </CardContent>
            </Card>

            <Card className="border-forest-200">
              <CardContent className="p-4">
                <Label className="text-forest-800 flex items-center gap-2 mb-2">
                  <Compass className="h-4 w-4 text-forest-600" />
                  Trail Challenges
                </Label>
                <Textarea
                  placeholder="What obstacles will you navigate better tomorrow?"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  className="min-h-[80px] border-forest-300 focus:border-forest-500"
                />
              </CardContent>
            </Card>
          </div>

          {/* Expedition Prompts */}
          <div className="space-y-2">
            <Label className="text-forest-800">Need inspiration? Try an expedition prompt:</Label>
            <div className="flex gap-2">
              <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                <SelectTrigger className="border-forest-300 focus:border-forest-500">
                  <SelectValue placeholder="Choose an expedition prompt" />
                </SelectTrigger>
                <SelectContent className="bg-white border-forest-200">
                  {EXPEDITION_PROMPTS.map((prompt, index) => (
                    <SelectItem key={index} value={prompt}>
                      {prompt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={insertPrompt}
                disabled={!selectedPrompt}
                variant="outline"
                className="border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                Insert
              </Button>
            </div>
          </div>

          {/* Main Expedition Log */}
          <div className="space-y-2">
            <Label htmlFor="expedition-log" className="text-forest-800">
              Your expedition thoughts and reflections
            </Label>
            <Textarea
              id="expedition-log"
              placeholder="Write about your climb today... the terrain you covered, the views you saw, the strength you built, or any insights from your mountain journey..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="min-h-[200px] border-forest-300 focus:border-forest-500"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-forest-300 text-forest-600 hover:bg-forest-50">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-forest-600 text-white hover:bg-forest-700">
            Save Log Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
