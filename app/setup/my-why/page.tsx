"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  why: z.string().min(2, {
    message: "Why must be at least 2 characters.",
  }),
})

export default function MyWhyPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      why: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem("why", values.why)
    router.push("/setup/my-values")
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        My Why
      </h1>
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="why"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why does building this matter to you?</FormLabel>
                  <FormControl>
                    <Input placeholder="I want to build this because..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">
              Understanding your motivations is like laying the foundation for a strong structure. It provides the
              purpose and direction for your endeavors. Consider:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>I want to build this because it solves a problem I face.</li>
              <li>I want to build this because it allows me to express my creativity.</li>
              <li>I want to build this because it will help me grow and learn new skills.</li>
              <li>I want to build this because it aligns with my long-term goals.</li>
            </ul>
            <Button type="submit">Next</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
