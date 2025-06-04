"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const BigGoalPage = () => {
  const [bigGoal, setBigGoal] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!bigGoal.trim()) {
      alert("Please enter your big goal.")
      return
    }

    try {
      // Save to local storage (replace with API call later)
      localStorage.setItem("bigGoal", bigGoal)

      // Redirect to the next step
      router.push("/setup/why")
    } catch (error) {
      console.error("Error saving big goal:", error)
      alert("Failed to save big goal. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h1 className="block text-gray-700 text-2xl font-bold mb-4 text-center">
          What do you want to build in your life?
        </h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Let's start with a big goal. What's one thing you're excited to build and achieve? This will be the foundation
          for your journey.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bigGoal">
              My Big Goal:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="bigGoal"
              type="text"
              placeholder="Build incredible health and fitness"
              value={bigGoal}
              onChange={(e) => setBigGoal(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Next
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs italic">
            Examples: Build incredible health and fitness, Build my dream career, Build stronger relationships, Build a
            growth mindset
          </p>
        </div>
      </div>
    </div>
  )
}

export default BigGoalPage
