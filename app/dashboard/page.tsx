"use client"

import { SafeComponentWrapper } from "@/components/safe-component-wrapper"
import { useSafeAsync } from "@/components/safe-component-wrapper"

export default function DashboardPage() {
  const { data, error, loading, retry } = useSafeAsync(async () => {
    // Simulate data loading
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { message: "Dashboard data loaded successfully!" }
  }, [])

  if (loading) {
    return <p>Loading dashboard data...</p>
  }

  if (error) {
    return (
      <div>
        <p>Error loading dashboard data: {error.message}</p>
        <button onClick={retry}>Retry</button>
      </div>
    )
  }

  return (
    <SafeComponentWrapper>
      <div>
        <h1>Dashboard</h1>
        {data && <p>{data.message}</p>}
      </div>
    </SafeComponentWrapper>
  )
}
