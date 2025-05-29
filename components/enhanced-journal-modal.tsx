"use client"

import { useState, useEffect, useRef } from "react"
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
import { BookOpen, Heart, Target, Compass, Save, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedJournalModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
}

const REFLECTION_PROMPTS = [
  "What did I accomplish successfully today?",
  "What challenges did I overcome?",
  "How did I grow stronger today?",
  "What progress did I make toward my goals?",
  "What lesson did I learn today?",
  "How did I help others or myself?",
  "What am I excited to work on tomorrow?",
  "If I could redo today, what would I do differently?",
]

const MOOD_OPTIONS = [
  { value: "excellent", label: "Excellent", emoji: "😊", color: "text-green-600" },
  { value: "good", label: "Good", emoji: "🙂", color: "text-blue-600" },
  { value: "okay", label: "Okay", emoji: "😐", color: "text-yellow-600" },
  { value: "difficult", label: "Difficult", emoji: "😔", color: "text-orange-600" },
  { value: "challenging", label: "Very Challenging", emoji: "😰", color: "text-red-600" },
]

export function EnhancedJournalModal({ isOpen, onClose, date }: EnhancedJournalModalProps) {
  const [entry, setEntry] = useState("")
  const [mood, setMood] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [gratitude, setGratitude] = useState("")
  const [victories, setVictories] = useState("")
  const [challenges, setChallenges] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const entryRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Load existing journal entry for the date
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const existingEntry = userData.journalEntries?.[date]

      if (existingEntry) {
        setEntry(existingEntry.entry || "")
        setMood(existingEntry.mood || existingEntry.weather || "") // Support old weather field
        setGratitude(existingEntry.gratitude || "")
        setVictories(existingEntry.victories || "")
        setChallenges(existingEntry.challenges || "")
      } else {
        // Reset form for new entry
        setEntry("")
        setMood("")
        setGratitude("")
        setVictories("")
        setChallenges("")
        setSelectedPrompt("")
      }
      setHasUnsavedChanges(false)
    }
  }, [isOpen, date])

  useEffect(() => {
    const words = entry
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [entry])

  useEffect(() => {
    const checkUnsavedChanges = () => {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const existingEntry = userData.journalEntries?.[date]

      const hasChanges =
        entry !== (existingEntry?.entry || "") ||
        mood !== (existingEntry?.mood || existingEntry?.weather || "") ||
        gratitude !== (existingEntry?.gratitude || "") ||
        victories !== (existingEntry?.victories || "") ||
        challenges !== (existingEntry?.challenges || "")

      setHasUnsavedChanges(hasChanges)
    }

    checkUnsavedChanges()
  }, [entry, mood, gratitude, victories, challenges, date])

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate save delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userData = JSON.parse(localStorage.getItem("userData") || "{}")

    if (!userData.journalEntries) {
      userData.journalEntries = {}
    }

    userData.journalEntries[date] = {
      entry,
      mood,
      weather: mood, // Keep for backward compatibility
      gratitude,
      victories,
      challenges,
      timestamp: new Date().toISOString(),
      wordCount,
    }

    localStorage.setItem("userData", JSON.stringify(userData))

    // Play success sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (e) {
      // Audio not available, continue silently
    }

    setIsSaving(false)
    setHasUnsavedChanges(false)
    onClose()
  }

  const insertPrompt = () => {
    if (selectedPrompt && entryRef.current) {
      const textarea = entryRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newText = entry.slice(0, start) + (entry ? "\n\n" : "") + selectedPrompt + "\n" + entry.slice(end)

      setEntry(newText)
      setSelectedPrompt("")

      // Focus back to textarea and position cursor
      setTimeout(() => {
        textarea.focus()
        const newPosition = start + selectedPrompt.length + (entry ? 3 : 1)
        textarea.setSelectionRange(newPosition, newPosition)
      }, 0)
    }
  }

  const formatDate = (dateString: string) => {
    // If no date provided or date is invalid, use today's date
    const date = dateString ? new Date(dateString) : new Date()

    // Ensure we have a valid date
    if (isNaN(date.getTime())) {
      return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const selectedMoodOption = MOOD_OPTIONS.find((option) => option.value === mood)

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to close without saving?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "bg-white border-forest-200 max-w-4xl max-h-[90vh] overflow-y-auto",
          "animate-in fade-in-0 zoom-in-95 duration-300",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-forest-800 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-forest-600" />
            Daily Journal - {formatDate(date || new Date().toISOString().split("T")[0])}
            {hasUnsavedChanges && (
              <span className="text-xs bg-earth-100 text-earth-800 px-2 py-1 rounded-full animate-pulse">
                Unsaved changes
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-stone-600">
            Record your daily thoughts, feelings, and progress toward your goals.
            {wordCount > 0 && <span className="ml-2 text-forest-600 font-medium">{wordCount} words</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mood Tracker */}
          <div className="space-y-2">
            <Label className="text-forest-800 flex items-center gap-2">
              <Heart className="h-4 w-4 text-forest-600" />
              How was your day?
            </Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger
                className={cn(
                  "border-forest-300 focus:border-forest-500 transition-all duration-200",
                  "hover:border-forest-400 min-h-[44px]",
                )}
              >
                <SelectValue placeholder="How did you feel today?">
                  {selectedMoodOption && (
                    <span className="flex items-center gap-2">
                      <span className={selectedMoodOption.color}>{selectedMoodOption.emoji}</span>
                      {selectedMoodOption.label}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-forest-200">
                {MOOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-forest-50 focus:bg-forest-50">
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
            <Card
              className={cn("border-forest-200 transition-all duration-200", "hover:shadow-md hover:border-forest-300")}
            >
              <CardContent className="p-4">
                <Label className="text-forest-800 flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-forest-600" />
                  What I'm grateful for
                </Label>
                <Textarea
                  placeholder="What good things happened today?"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  className={cn(
                    "min-h-[80px] border-forest-300 focus:border-forest-500 transition-all duration-200",
                    "resize-none hover:border-forest-400",
                  )}
                />
              </CardContent>
            </Card>

            <Card
              className={cn("border-forest-200 transition-all duration-200", "hover:shadow-md hover:border-forest-300")}
            >
              <CardContent className="p-4">
                <Label className="text-forest-800 flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-forest-600" />
                  Today's wins
                </Label>
                <Textarea
                  placeholder="What did you accomplish today?"
                  value={victories}
                  onChange={(e) => setVictories(e.target.value)}
                  className={cn(
                    "min-h-[80px] border-forest-300 focus:border-forest-500 transition-all duration-200",
                    "resize-none hover:border-forest-400",
                  )}
                />
              </CardContent>
            </Card>

            <Card
              className={cn("border-forest-200 transition-all duration-200", "hover:shadow-md hover:border-forest-300")}
            >
              <CardContent className="p-4">
                <Label className="text-forest-800 flex items-center gap-2 mb-2">
                  <Compass className="h-4 w-4 text-forest-600" />
                  Areas to improve
                </Label>
                <Textarea
                  placeholder="What could you do better tomorrow?"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  className={cn(
                    "min-h-[80px] border-forest-300 focus:border-forest-500 transition-all duration-200",
                    "resize-none hover:border-forest-400",
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Reflection Prompts */}
          <div className="space-y-2">
            <Label className="text-forest-800">Need inspiration? Try a reflection prompt:</Label>
            <div className="flex gap-2">
              <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                <SelectTrigger
                  className={cn(
                    "border-forest-300 focus:border-forest-500 transition-all duration-200",
                    "hover:border-forest-400 min-h-[44px]",
                  )}
                >
                  <SelectValue placeholder="Choose a reflection prompt" />
                </SelectTrigger>
                <SelectContent className="bg-white border-forest-200">
                  {REFLECTION_PROMPTS.map((prompt, index) => (
                    <SelectItem key={index} value={prompt} className="hover:bg-forest-50 focus:bg-forest-50">
                      {prompt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={insertPrompt}
                disabled={!selectedPrompt}
                variant="outline"
                className={cn(
                  "border-forest-300 text-forest-600 hover:bg-forest-50",
                  "transition-all duration-200 hover:scale-105 min-w-[80px]",
                )}
              >
                Insert
              </Button>
            </div>
          </div>

          {/* Main Journal Entry */}
          <div className="space-y-2">
            <Label htmlFor="journal-entry" className="text-forest-800">
              Your thoughts and reflections
            </Label>
            <Textarea
              ref={entryRef}
              id="journal-entry"
              placeholder="Write about your day... what you learned, how you felt, what you're thinking about, or anything else on your mind..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className={cn(
                "min-h-[200px] border-forest-300 focus:border-forest-500 transition-all duration-200",
                "resize-none hover:border-forest-400",
              )}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className={cn(
              "border-forest-300 text-forest-600 hover:bg-forest-50",
              "transition-all duration-200 min-w-[80px]",
            )}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "bg-forest-600 text-white hover:bg-forest-700",
              "transition-all duration-200 hover:scale-105 min-w-[100px]",
              isSaving && "animate-pulse",
            )}
          >
            {isSaving ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Entry
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
