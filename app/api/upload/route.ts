import { type NextRequest, NextResponse } from "next/server"
import { uploadToBlob } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const folder = (formData.get("folder") as string) || "uploads"

    const result = await uploadToBlob(formData, folder)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Upload failed" }, { status: 400 })
    }

    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
