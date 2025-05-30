"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, FileText, Camera, Mountain } from "lucide-react"
import { MobileLayout } from "@/components/mobile-layout"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"
import { ContractGenerator } from "@/components/contract-generator"
import { ProgressPhotoGallery } from "@/components/progress-photo-gallery"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (!storedUserData) {
      router.push("/")
      return
    }

    const parsedUserData = JSON.parse(storedUserData)
    setUserData(parsedUserData)
    setLoading(false)
  }, [router])

  const handleProfileUpdate = (updatedData: any) => {
    const newUserData = { ...userData, ...updatedData }
    setUserData(newUserData)
    localStorage.setItem("userData", JSON.stringify(newUserData))
  }

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      <MobileLayout>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-forest-600 hover:bg-forest-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-forest-800">Your Profile</h1>
            <p className="text-stone-600">Manage your personal information and documents</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-forest-100 h-12 rounded-xl p-1">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <User className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <FileText className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <Camera className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Photos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <ProfilePictureUpload
                  initialImageUrl={userData.profilePicture}
                  onImageUploaded={(url) => handleProfileUpdate({ profilePicture: url })}
                />
              </div>

              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-forest-800 flex items-center gap-2">
                      <Mountain className="h-5 w-5 text-forest-600" />
                      Your Climbing Stats
                    </CardTitle>
                    <CardDescription>Your journey at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-forest-50 rounded-lg border border-forest-200">
                        <div className="text-sm text-forest-600">Days on the mountain</div>
                        <div className="text-2xl font-bold text-forest-800">
                          {userData.startDate
                            ? Math.max(
                                1,
                                Math.floor(
                                  (new Date().getTime() - new Date(userData.startDate).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                ),
                              )
                            : 1}
                        </div>
                      </div>

                      <div className="p-4 bg-forest-50 rounded-lg border border-forest-200">
                        <div className="text-sm text-forest-600">Current streak</div>
                        <div className="text-2xl font-bold text-forest-800">
                          {userData.gamification?.streak || 0} days
                        </div>
                      </div>

                      <div className="p-4 bg-forest-50 rounded-lg border border-forest-200">
                        <div className="text-sm text-forest-600">Tasks completed</div>
                        <div className="text-2xl font-bold text-forest-800">
                          {Object.values(userData.tasks || {}).reduce(
                            (total: number, tasks: any[]) => total + tasks.filter((task: any) => task.completed).length,
                            0,
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-forest-50 rounded-lg border border-forest-200">
                        <div className="text-sm text-forest-600">Goals achieved</div>
                        <div className="text-2xl font-bold text-forest-800">
                          {(userData.milestones || []).filter((m: any) => m.completed).length}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-forest-50 rounded-lg border border-forest-200">
                      <div className="text-sm font-medium text-forest-800 mb-2">Your summit goal</div>
                      <div className="text-forest-700">{userData.bigGoal || "No summit goal set yet"}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <ContractGenerator userData={userData} />

            <Card>
              <CardHeader>
                <CardTitle className="text-forest-800">Your Documents</CardTitle>
                <CardDescription>Access and download your personal documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-forest-200 text-forest-700 hover:bg-forest-50"
                    onClick={() => {
                      /* Future functionality */
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    90-Day Progress Report
                    <span className="ml-auto text-xs bg-forest-100 text-forest-600 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-forest-200 text-forest-700 hover:bg-forest-50"
                    onClick={() => {
                      /* Future functionality */
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Achievement Certificate
                    <span className="ml-auto text-xs bg-forest-100 text-forest-600 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <ProgressPhotoGallery />
          </TabsContent>
        </Tabs>
      </MobileLayout>
    </div>
  )
}
