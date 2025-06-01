"use client"

import useSWR, { type SWRConfiguration } from "swr"
import { storage } from "@/lib/storage"
import { useAuth } from "@/lib/auth-service"

const CACHE_TIME = 60 * 1000 // 1 minute

// Global fetcher function with authentication handling
async function fetcher(url: string) {
  const response = await fetch(url, {
    credentials: "include",
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized")
    }
    throw new Error("An error occurred while fetching the data.")
  }

  return response.json()
}

export function useOptimizedData<T>(key: string | null, localDataKey?: string, config?: SWRConfiguration) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // Use SWR for data fetching with optimized config
  const {
    data: remoteData,
    error,
    isLoading: remoteLoading,
    isValidating,
    mutate,
  } = useSWR<T>(
    // Only fetch if authenticated and key is provided
    isAuthenticated && key ? key : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: CACHE_TIME,
      ...config,
    },
  )

  // Get local data from storage
  const localData = localDataKey ? (storage.get(localDataKey) as T) : null

  // Determine which data to use
  const data = remoteData || localData

  // Determine loading state
  const isLoading = authLoading || (isAuthenticated && remoteLoading && !localData)

  // Save remote data to local storage when it arrives
  if (remoteData && localDataKey) {
    storage.set(localDataKey, remoteData)
  }

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    isRemote: !!remoteData,
    isLocal: !remoteData && !!localData,
  }
}
