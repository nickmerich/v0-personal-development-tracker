"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  User,
  Bell,
  Palette,
  Calendar,
  Download,
  Upload,
  Trash2,
  ArrowLeft,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Shield,
  Database,
} from "lucide-react"
import { MobileLayout, MobileCard } from "@/components/mobile-layout"
import { CalendarSyncModal } from "@/components/calendar-sync-modal"

export default function SettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCalendarSync, setShowCalendarSync] = useState(false)
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: {
      enabled: true,
      sound: true,
      email: false,
      push: true,
    },
    privacy: {
      analytics: true,
      dataSharing: false,
    },
    preferences: {
      startOfWeek: "monday",
      timeFormat: "12h",
      language: "en",
    },
  })

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (!storedUserData) {
      router.push("/")
      return
    }

    const parsedUserData = JSON.parse(storedUserData)
    setUserData(parsedUserData)

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    setLoading(false)
  }, [router])

  const updateSettings = (newSettings: any) => {
    setSettings(newSettings)
    localStorage.setItem("appSettings", JSON.stringify(newSettings))
  }

  const handleExportData = () => {
    if (!userData) return

    const dataToExport = {
      userData,
      settings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `gryt-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      localStorage.clear()
      router.push("/")
    }
  }

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      <MobileLayout>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-forest-600 hover:bg-forest-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-forest-800">Settings</h1>
            <p className="text-stone-600">Customize your Gryt experience</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-forest-100 h-12 rounded-xl p-1">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <User className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <Bell className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <Settings className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Prefs</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <Database className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <MobileCard>
              <CardHeader>
                <CardTitle className="text-forest-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-forest-600" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={userData.name || ""}
                    onChange={(e) => {
                      const newUserData = { ...userData, name: e.target.value }
                      setUserData(newUserData)
                      localStorage.setItem("userData", JSON.stringify(newUserData))
                    }}
                    className="border-forest-300 focus:border-forest-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email || ""}
                    onChange={(e) => {
                      const newUserData = { ...userData, email: e.target.value }
                      setUserData(newUserData)
                      localStorage.setItem("userData", JSON.stringify(newUserData))
                    }}
                    className="border-forest-300 focus:border-forest-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Journey Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={userData.startDate || ""}
                    onChange={(e) => {
                      const newUserData = { ...userData, startDate: e.target.value }
                      setUserData(newUserData)
                      localStorage.setItem("userData", JSON.stringify(newUserData))
                    }}
                    className="border-forest-300 focus:border-forest-500"
                  />
                </div>
              </CardContent>
            </MobileCard>

            <MobileCard>
              <CardHeader>
                <CardTitle className="text-forest-800">My Why & Big Goal</CardTitle>
                <CardDescription>Your core motivation and primary objective</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="myWhy">My Why</Label>
                  <textarea
                    id="myWhy"
                    value={userData.myWhy || ""}
                    onChange={(e) => {
                      const newUserData = { ...userData, myWhy: e.target.value }
                      setUserData(newUserData)
                      localStorage.setItem("userData", JSON.stringify(newUserData))
                    }}
                    className="w-full p-3 border border-forest-300 rounded-lg focus:border-forest-500 focus:outline-none resize-none"
                    rows={3}
                    placeholder="What drives you to improve yourself?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bigGoal">Big Goal</Label>
                  <Input
                    id="bigGoal"
                    value={userData.bigGoal || ""}
                    onChange={(e) => {
                      const newUserData = { ...userData, bigGoal: e.target.value }
                      setUserData(newUserData)
                      localStorage.setItem("userData", JSON.stringify(newUserData))
                    }}
                    className="border-forest-300 focus:border-forest-500"
                    placeholder="What's your main goal for the next 90 days?"
                  />
                </div>
              </CardContent>
            </MobileCard>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <MobileCard>
              <CardHeader>
                <CardTitle className="text-forest-800 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-forest-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-forest-800">Enable Notifications</Label>
                    <p className="text-sm text-stone-600">Receive reminders and updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications.enabled}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        ...settings,
                        notifications: { ...settings.notifications, enabled: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.notifications.sound ? (
                        <Volume2 className="h-4 w-4 text-forest-600" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-stone-400" />
                      )}
                      <Label className="text-forest-800">Sound Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.notifications.sound}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          ...settings,
                          notifications: { ...settings.notifications, sound: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-forest-600" />
                      <Label className="text-forest-800">Push Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          ...settings,
                          notifications: { ...settings.notifications, push: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-stone-400" />
                      <div>
                        <Label className="text-stone-500">Email Notifications</Label>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Coming Soon
                        </Badge>
                      </div>
                    </div>
                    <Switch disabled checked={false} />
                  </div>
                </div>
              </CardContent>
            </MobileCard>

            <MobileCard>
              <CardHeader>
                <CardTitle className="text-forest-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-forest-600" />
                  Calendar Integration
                </CardTitle>
                <CardDescription>Connect your external calendars</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowCalendarSync(true)}
                  className="w-full bg-forest-600 text-white hover:bg-forest-700"
                >
                  Manage Calendar Sync
                </Button>
              </CardContent>
            </MobileCard>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <MobileCard>
              <CardHeader>
                <CardTitle className="text-forest-800 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-forest-600" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => updateSettings({ ...settings, theme: value })}
                  >
                    <SelectTrigger className="border-forest-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </MobileCard>

            <MobileCard>
              <CardHeader>
                <CardTitle className="text-forest-800">General Preferences</CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Start of Week</Label>
                  <Select
                    value={settings.preferences.startOfWeek}
                    onValueChange={(value) =>
                      updateSettings({
                        ...settings,
                        preferences: { ...settings.preferences, startOfWeek: value },
                      })
                    }
                  >
                    <SelectTrigger className="border-forest-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select
                    value={settings.preferences.timeFormat}
                    onValueChange={(value) =>
                      updateSettings({
                        ...settings,
                        preferences: { ...settings.preferences, timeFormat: value },
                      })
                    }
                  >
                    <SelectTrigger className="border-forest-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </MobileCard>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <MobileCard>
              <CardHeader>
                <CardTitle className="text-forest-800 flex items-center gap-2">
                  <Database className="h-5 w-5 text-forest-600" />
                  Data Management
                </CardTitle>
                <CardDescription>Export, import, or delete your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="w-full border-forest-300 text-forest-600 hover:bg-forest-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>

                <Button variant="outline" className="w-full border-stone-300 text-stone-600 hover:bg-stone-50" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Coming Soon
                  </Badge>
                </Button>
              </CardContent>
            </MobileCard>

            <MobileCard>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Manage your privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-forest-800">Analytics</Label>
                    <p className="text-sm text-stone-600">Help improve the app with usage data</p>
                  </div>
                  <Switch
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        ...settings,
                        privacy: { ...settings.privacy, analytics: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
                <p className="text-xs text-stone-500 text-center">
                  This will permanently delete all your data and cannot be undone.
                </p>
              </CardContent>
            </MobileCard>
          </TabsContent>
        </Tabs>

        {/* Calendar Sync Modal */}
        <CalendarSyncModal isOpen={showCalendarSync} onClose={() => setShowCalendarSync(false)} />
      </MobileLayout>
    </div>
  )
}
