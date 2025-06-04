"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
})

export default function PersonalInfoPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to new 3D onboarding experience
    router.replace("/onboarding")
  }, [router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the data
    console.log(values)
    router.push("/setup/lifestyle")
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p>Redirecting to onboarding...</p>
      </div>
    </div>
  )
}
