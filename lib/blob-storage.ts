"use server"

import { put, del, list } from "@vercel/blob"
import { nanoid } from "nanoid"

export type UploadResult = {
  url: string
  success: boolean
  error?: string
}

/**
 * Upload a file to Vercel Blob storage
 */
export async function uploadToBlob(formData: FormData, folder = "uploads"): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { url: "", success: false, error: "No file provided" }
    }

    // Generate a unique filename with original extension
    const ext = file.name.split(".").pop()
    const filename = `${folder}/${nanoid()}.${ext}`

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
    })

    return { url, success: true }
  } catch (error) {
    console.error("Error uploading to blob:", error)
    return {
      url: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Delete a file from Vercel Blob storage
 */
export async function deleteFromBlob(url: string): Promise<boolean> {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error("Error deleting from blob:", error)
    return false
  }
}

/**
 * List files in a folder in Vercel Blob storage
 */
export async function listBlobFiles(prefix: string) {
  try {
    const { blobs } = await list({ prefix })
    return { blobs, success: true }
  } catch (error) {
    console.error("Error listing blob files:", error)
    return { blobs: [], success: false }
  }
}
