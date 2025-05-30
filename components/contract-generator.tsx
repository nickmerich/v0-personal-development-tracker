"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, Loader2, Check } from "lucide-react"
import { jsPDF } from "jspdf"

interface ContractGeneratorProps {
  userData: any
  className?: string
}

export function ContractGenerator({ userData, className }: ContractGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const generateContract = async () => {
    setIsGenerating(true)
    setIsGenerated(false)

    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add logo/header
      doc.setFillColor(34, 97, 74) // forest-600
      doc.rect(0, 0, 210, 30, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text("THE GRYT", 105, 15, { align: "center" })
      doc.setFontSize(14)
      doc.setFont("helvetica", "normal")
      doc.text("90-DAY MOUNTAIN CONTRACT", 105, 23, { align: "center" })

      // Add user info
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(`CLIMBER: ${userData.name || ""}`, 20, 40)
      doc.text(`START DATE: ${userData.startDate || new Date().toLocaleDateString()}`, 20, 48)
      doc.text(`SUMMIT GOAL: ${userData.bigGoal || ""}`, 20, 56)

      // Add contract content
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("MY 90-DAY COMMITMENT", 105, 70, { align: "center" })

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      const contractText = [
        "I commit to showing up every day for the next 90 days.",
        "I understand that consistency, not perfection, is what matters.",
        "I will track my progress honestly and adjust when necessary.",
        "I accept that the mountain doesn't care about my excuses.",
        "I know that one slip doesn't break the climb—quitting does.",
        "I will celebrate my victories, learn from my failures, and keep climbing.",
        "",
        "This is my pact—with myself. It's not motivation that gets me to the summit.",
        "It's the decision to climb when it sucks.",
      ]

      let y = 80
      contractText.forEach((line) => {
        doc.text(line, 20, y)
        y += 8
      })

      // Add signature area
      doc.setDrawColor(0)
      doc.line(20, y + 10, 100, y + 10)
      doc.setFontSize(10)
      doc.text("Signature", 60, y + 15, { align: "center" })

      doc.line(120, y + 10, 190, y + 10)
      doc.text("Date", 155, y + 15, { align: "center" })

      // Add categories
      y += 30
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("MY DAILY FOOTHOLDS", 105, y, { align: "center" })

      y += 10
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")

      const categories = ["Spiritual", "Physical", "Mental", "Nutritional", "Professional", "Family"]

      // Create two columns
      let leftY = y
      let rightY = y

      categories.slice(0, 3).forEach((category) => {
        doc.setFont("helvetica", "bold")
        doc.text(`□ ${category}`, 40, leftY)
        leftY += 8

        // Add user's category tasks if available
        if (userData.categories?.includes(category.toLowerCase()) && userData.tasks?.[category.toLowerCase()]) {
          userData.tasks[category.toLowerCase()].slice(0, 2).forEach((task) => {
            doc.setFont("helvetica", "normal")
            doc.text(`   • ${task.text || ""}`, 40, leftY)
            leftY += 6
          })
          leftY += 2
        } else {
          leftY += 8
        }
      })

      categories.slice(3).forEach((category) => {
        doc.setFont("helvetica", "bold")
        doc.text(`□ ${category}`, 120, rightY)
        rightY += 8

        // Add user's category tasks if available
        if (userData.categories?.includes(category.toLowerCase()) && userData.tasks?.[category.toLowerCase()]) {
          userData.tasks[category.toLowerCase()].slice(0, 2).forEach((task) => {
            doc.setFont("helvetica", "normal")
            doc.text(`   • ${task.text || ""}`, 120, rightY)
            rightY += 6
          })
          rightY += 2
        } else {
          rightY += 8
        }
      })

      // Add footer
      const footerY = 280
      doc.setFillColor(34, 97, 74) // forest-600
      doc.rect(0, footerY, 210, 17, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("THE GRYT - 90 DAYS. ALL IN. NO EXCUSES.", 105, footerY + 7, { align: "center" })
      doc.text("www.thegryt.com", 105, footerY + 13, { align: "center" })

      // Save the PDF
      doc.save(`The_Gryt_Contract_${userData.name || "User"}.pdf`)

      setIsGenerated(true)
    } catch (error) {
      console.error("Error generating contract:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-forest-800">Your Mountain Contract</CardTitle>
        <CardDescription>Download your personalized 90-day commitment contract</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={generateContract}
          disabled={isGenerating}
          className="w-full bg-forest-600 hover:bg-forest-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Download Contract PDF
            </>
          )}
        </Button>

        {isGenerated && (
          <div className="mt-2 text-sm text-forest-600 flex items-center gap-1">
            <Check className="h-4 w-4" />
            Contract generated successfully
          </div>
        )}
      </CardContent>
    </Card>
  )
}
