"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Upload } from "lucide-react"
import { ExpenseForm } from "@/components/expenses/expense-form"

export default function NewExpensePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expenseType, setExpenseType] = useState<"single" | "report">("single")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmitSingleExpense = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      // In a real app, you would submit this to your API
      console.log("Form data:", Object.fromEntries(formData.entries()))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Expense submitted",
        description: "Your expense has been submitted successfully.",
      })

      router.push("/dashboard/expenses")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your expense.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submit Expense</h1>
        <p className="text-muted-foreground">Create a new expense or expense report</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Type</CardTitle>
          <CardDescription>
            Choose whether to submit a single expense or create an expense report with multiple items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              variant={expenseType === "single" ? "default" : "outline"}
              className="h-auto flex-col items-start gap-1 p-4"
              onClick={() => setExpenseType("single")}
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-lg font-medium">Single Expense</p>
                <div className={`rounded-full p-1 ${expenseType === "single" ? "bg-white" : "bg-transparent"}`}>
                  <Plus className={`h-4 w-4 ${expenseType === "single" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              </div>
              <p className="text-sm text-left text-muted-foreground">Submit a single expense item with receipt</p>
            </Button>
            <Button
              variant={expenseType === "report" ? "default" : "outline"}
              className="h-auto flex-col items-start gap-1 p-4"
              onClick={() => setExpenseType("report")}
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-lg font-medium">Expense Report</p>
                <div className={`rounded-full p-1 ${expenseType === "report" ? "bg-white" : "bg-transparent"}`}>
                  <Upload
                    className={`h-4 w-4 ${expenseType === "report" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
              </div>
              <p className="text-sm text-left text-muted-foreground">Create a report with multiple expense items</p>
            </Button>
          </div>
        </CardContent>
      </Card>

      {expenseType === "single" && <ExpenseForm onSubmit={handleSubmitSingleExpense} isSubmitting={isSubmitting} />}

      {expenseType === "report" && (
        <Card>
          <CardHeader>
            <CardTitle>Create Expense Report</CardTitle>
            <CardDescription>Group multiple expenses into a single report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-title">Report Title</Label>
              <Input id="report-title" placeholder="e.g., Business Trip to New York" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea id="report-description" placeholder="Provide details about this expense report" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date" className="sr-only">
                    Start Date
                  </Label>
                  <Input id="start-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="end-date" className="sr-only">
                    End Date
                  </Label>
                  <Input id="end-date" type="date" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Add Expenses</h3>
                <p className="mt-2 text-sm text-muted-foreground">Start adding individual expenses to this report</p>
                <Button className="mt-4">Add First Expense</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button disabled>Create Report</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

