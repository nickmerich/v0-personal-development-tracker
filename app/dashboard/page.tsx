"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { TemplateQuickBrowser } from "@/components/template-quick-browser"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>{user ? `Welcome back, ${user.firstName}!` : "Welcome!"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is your dashboard. You can manage your templates and projects here.</p>
          </CardContent>
        </Card>

        {/* Browse Templates Section */}
        <TemplateQuickBrowser
          onSelectTemplate={(templateId) => {
            // Quick add template logic
            router.push(`/templates?quickAdd=${templateId}`)
          }}
          onBrowseAll={() => router.push("/templates")}
        />

        {/* Create New Project Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Start a new project from scratch.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/projects/new")}>Create Project</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
