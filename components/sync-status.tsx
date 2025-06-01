"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudOff, WifiOff, RefreshCw } from "lucide-react"
import { storage } from "@/lib/storage"

export function SyncStatus() {
  const [syncStatus, setSyncStatus] = useState({
    isOnline: true,
    isAuthenticated: false,
    queueLength: 0,
    syncInProgress: false,
  })
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    const updateStatus = () => {
      setSyncStatus(storage.getSyncStatus())
    }

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000)
    updateStatus()

    return () => clearInterval(interval)
  }, [])

  const handleManualSync = async () => {
    const success = await storage.forceSyncToCloud()
    if (success) {
      setLastSync(new Date())
    }
  }

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff className="h-4 w-4 text-red-500" />
    }
    if (!syncStatus.isAuthenticated) {
      return <CloudOff className="h-4 w-4 text-yellow-500" />
    }
    if (syncStatus.syncInProgress) {
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
    }
    return <Cloud className="h-4 w-4 text-green-500" />
  }

  const getStatusText = () => {
    if (!syncStatus.isOnline) return "Offline"
    if (!syncStatus.isAuthenticated) return "Local only"
    if (syncStatus.syncInProgress) return "Syncing..."
    if (syncStatus.queueLength > 0) return `${syncStatus.queueLength} pending`
    return "Synced"
  }

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return "destructive"
    if (!syncStatus.isAuthenticated) return "secondary"
    if (syncStatus.syncInProgress || syncStatus.queueLength > 0) return "default"
    return "default"
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusColor()} className="flex items-center gap-1">
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>

      {syncStatus.isAuthenticated && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleManualSync}
          disabled={syncStatus.syncInProgress}
          className="h-8 px-2"
        >
          <RefreshCw className={`h-3 w-3 ${syncStatus.syncInProgress ? "animate-spin" : ""}`} />
        </Button>
      )}

      {lastSync && <span className="text-xs text-muted-foreground">Last sync: {lastSync.toLocaleTimeString()}</span>}
    </div>
  )
}
