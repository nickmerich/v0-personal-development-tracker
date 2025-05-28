"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import { HABIT_TEMPLATES } from "@/components/habit-templates"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Habit name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  frequency: z.string().min(1, {
    message: "Please select a frequency.",
  }),
  startDate: z.date(),
})

const TemplateApplicationFormSchema = z.object({
  startDate: z.date(),
})

export default function TemplatesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")

    if (!storedUserData) {
      router.push("/")
      return
    }

    const parsedUserData = JSON.parse(storedUserData)

    if (!parsedUserData.setupCompleted) {
      router.push("/setup/personal-info")
      return
    }

    setUserData(parsedUserData)
    setLoading(false)

    // Check for quick-add parameter
    const urlParams = new URLSearchParams(window.location.search)
    const quickAddId = urlParams.get("quickAdd")
    if (quickAddId) {
      // Find and auto-select the template
      const template = HABIT_TEMPLATES.find((t) => t.id === quickAddId)
      if (template) {
        setSelectedTemplate(template)
        setShowApplicationModal(true)
      }
    }
  }, [router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      frequency: "",
      startDate: new Date(),
    },
  })

  const templateApplicationForm = useForm<z.infer<typeof TemplateApplicationFormSchema>>({
    resolver: zodResolver(TemplateApplicationFormSchema),
    defaultValues: {
      startDate: new Date(),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    const newHabit = {
      ...values,
      userId: userData.id,
    }

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newHabit),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your habit has been created.",
        })
        form.reset()
      } else {
        toast({
          title: "Error!",
          description: "Something went wrong. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error creating habit:", error)
      toast({
        title: "Error!",
        description: "Something went wrong. Please try again.",
      })
    }
  }

  async function onApplyTemplate(values: z.infer<typeof TemplateApplicationFormSchema>) {
    if (!selectedTemplate) return

    const newHabit = {
      name: selectedTemplate.name,
      description: selectedTemplate.description,
      frequency: selectedTemplate.frequency,
      startDate: values.startDate,
      userId: userData.id,
    }

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newHabit),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your habit has been created.",
        })
        templateApplicationForm.reset()
        setShowApplicationModal(false)
      } else {
        toast({
          title: "Error!",
          description: "Something went wrong. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error creating habit:", error)
      toast({
        title: "Error!",
        description: "Something went wrong. Please try again.",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Habit Templates</h1>
      <p className="text-muted-foreground mb-8">Choose a template to get started quickly.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HABIT_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
            <p className="text-muted-foreground mb-4">{template.description}</p>
            <Badge className="mb-4">{template.frequency}</Badge>
            <Button
              onClick={() => {
                setSelectedTemplate(template)
                setShowApplicationModal(true)
              }}
            >
              Apply Template
            </Button>
          </div>
        ))}
      </div>

      <Separator className="my-8" />

      <h2 className="text-2xl font-bold mb-4">Create Your Own Habit</h2>
      <p className="text-muted-foreground mb-8">Customize your own habit from scratch.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Habit Name</FormLabel>
                <FormControl>
                  <Input placeholder="Go to the gym" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your habit" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Habit</Button>
        </form>
      </Form>

      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply Template</DialogTitle>
            <DialogDescription>Choose a start date for your new habit.</DialogDescription>
          </DialogHeader>
          <Form {...templateApplicationForm}>
            <form onSubmit={templateApplicationForm.handleSubmit(onApplyTemplate)} className="space-y-8">
              <FormField
                control={templateApplicationForm.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Apply</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
