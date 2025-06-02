"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudOff } from "lucide-react"

export function BackupStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="flex items-center gap-1 text-xs text-stone-500">
      {isOnline ? (
        <>
          <Cloud className="h-3 w-3 text-green-500" />
          <span>Auto-saving</span>
        </>
      ) : (
        <>
          <CloudOff className="h-3 w-3 text-orange-500" />
          <span>Offline</span>
        </>
      )}
    </div>
  )
}
