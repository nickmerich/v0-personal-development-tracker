"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, ExternalLink, Settings, Smartphone, Globe } from "lucide-react"

interface CalendarSyncModalProps {
  isOpen: boolean
  onClose: () => void
}

const CALENDAR_PROVIDERS = [
  {
    id: "google",
    name: "Google Calendar",
    icon: Globe,
    description: "Sync with your Google Calendar events",
    connected: true,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "apple",
    name: "Apple Calendar",
    icon: Smartphone,
    description: "Sync with your iCloud calendar",
    connected: true,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    icon: ExternalLink,
    description: "Sync with your Outlook calendar",
    connected: false,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
]

export function CalendarSyncModal({ isOpen, onClose }: CalendarSyncModalProps) {
  const [providers, setProviders] = useState(CALENDAR_PROVIDERS)
  const [syncSettings, setSyncSettings] = useState({
    importEvents: true,
    exportTasks: false,
    syncReminders: true,
    autoSync: true,
  })

  const handleToggleProvider = (providerId: string) => {
    setProviders((prev) =>
      prev.map((provider) => (provider.id === providerId ? { ...provider, connected: !provider.connected } : provider)),
    )
  }

  const handleConnect = (providerId: string) => {
    // In a real app, this would initiate OAuth flow
    alert(`Connecting to ${providers.find((p) => p.id === providerId)?.name}...`)
    handleToggleProvider(providerId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-[#89CFF0]/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-black flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#89CFF0]" />
            Calendar Integration
          </DialogTitle>
          <DialogDescription className="text-black/70">
            Connect your external calendars to see all your events and tasks in one place.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Calendar Providers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">Calendar Providers</h3>
            <div className="grid gap-4">
              {providers.map((provider) => {
                const IconComponent = provider.icon
                return (
                  <Card key={provider.id} className="border-[#89CFF0]/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#89CFF0]/10">
                            <IconComponent className="h-5 w-5 text-[#89CFF0]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-black">{provider.name}</h4>
                            <p className="text-sm text-black/70">{provider.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {provider.connected ? (
                            <>
                              <Badge className={provider.color}>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleProvider(provider.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => handleConnect(provider.id)}
                              className="bg-[#89CFF0] text-white hover:bg-[#89CFF0]/90"
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sync Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#89CFF0]" />
              Sync Settings
            </h3>
            <Card className="border-[#89CFF0]/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Import External Events</h4>
                    <p className="text-sm text-black/70">Show events from connected calendars in your view</p>
                  </div>
                  <Switch
                    checked={syncSettings.importEvents}
                    onCheckedChange={(checked) => setSyncSettings((prev) => ({ ...prev, importEvents: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Export Tasks</h4>
                    <p className="text-sm text-black/70">Add your Gryt tasks to external calendars</p>
                  </div>
                  <Switch
                    checked={syncSettings.exportTasks}
                    onCheckedChange={(checked) => setSyncSettings((prev) => ({ ...prev, exportTasks: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Sync Reminders</h4>
                    <p className="text-sm text-black/70">Get notifications from external calendar events</p>
                  </div>
                  <Switch
                    checked={syncSettings.syncReminders}
                    onCheckedChange={(checked) => setSyncSettings((prev) => ({ ...prev, syncReminders: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Auto Sync</h4>
                    <p className="text-sm text-black/70">Automatically sync changes every 15 minutes</p>
                  </div>
                  <Switch
                    checked={syncSettings.autoSync}
                    onCheckedChange={(checked) => setSyncSettings((prev) => ({ ...prev, autoSync: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sync Status */}
          <Card className="border-[#89CFF0]/20 bg-[#89CFF0]/5">
            <CardHeader>
              <CardTitle className="text-black text-sm">Last Sync Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/70">Google Calendar:</span>
                  <span className="text-green-600">Synced 2 minutes ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Apple Calendar:</span>
                  <span className="text-green-600">Synced 5 minutes ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Next sync:</span>
                  <span className="text-black">In 13 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-[#89CFF0] text-[#89CFF0] hover:bg-[#89CFF0]/10">
            Close
          </Button>
          <Button
            onClick={() => {
              // Save settings
              alert("Calendar sync settings saved!")
              onClose()
            }}
            className="bg-[#89CFF0] text-white hover:bg-[#89CFF0]/90"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
