"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MountainContract } from "@/components/mountain-contract"
import { SetupProgress } from "@/components/setup-progress"

export default function SetupComplete() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (!storedUserData) {
      router.push("/setup/personal-info")
      return
    }

    setUserData(JSON.parse(storedUserData))
  }, [router])

  const handleComplete = () => {
    if (!userData) return

    // Mark setup as completed
    const updatedUserData = {
      ...userData,
      setupCompleted: true,
    }

    localStorage.setItem("userData", JSON.stringify(updatedUserData))
    router.push("/dashboard")
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-50 via-stone-50 to-forest-100">
        <div className="text-forest-800">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-forest-50 via-stone-50 to-forest-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <SetupProgress currentStep={5} totalSteps={5} />
        </div>

        <MountainContract onComplete={handleComplete} defaultGoal={userData.bigGoal} defaultWhy={userData.myWhy} />
      </div>
    </div>
  )
}
