"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudOff, Loader2, Shield, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-service"
import { storage } from "@/lib/storage"
import { AuthModal } from "./auth-modal"

export function BackupStatus() {
  const { user, isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [syncStatus, setSyncStatus] = useState(storage.getSyncStatus())
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(storage.getSyncStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleManualSync = async () => {
    if (isAuthenticated) {
      const success = await storage.forceSyncToCloud()
      if (success) {
        setLastSync(new Date())
      }
    }
  }

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <CloudOff className="h-4 w-4 text-stone-500" />
    }
    if (syncStatus.syncInProgress) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }
    if (isAuthenticated) {
      return <Cloud className="h-4 w-4 text-green-500" />
    }
    return <AlertTriangle className="h-4 w-4 text-amber-500" />
  }

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return "Offline"
    }
    if (syncStatus.syncInProgress) {
      return "Syncing..."
    }
    if (isAuthenticated) {
      return "Backed up"
    }
    return "Local only"
  }

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return "secondary"
    if (syncStatus.syncInProgress) return "default"
    if (isAuthenticated) return "default"
    return "secondary"
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            {syncStatus.queueLength > 0 && (
              <Badge variant="outline" className="text-xs">
                {syncStatus.queueLength} pending
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualSync}
              disabled={syncStatus.syncInProgress || !syncStatus.isOnline}
              className="text-xs"
            >
              {syncStatus.syncInProgress ? "Syncing..." : "Sync"}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAuthModal(true)}
            className="text-xs border-forest-300 text-forest-600 hover:bg-forest-50"
          >
            <Shield className="mr-1 h-3 w-3" />
            Backup
          </Button>
        )}
      </div>

      {lastSync && <p className="text-xs text-stone-500">Last synced: {lastSync.toLocaleTimeString()}</p>}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          console.log("Authentication successful!")
        }}
      />
    </>
  )
}
