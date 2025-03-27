"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, FileText, Loader2, MessageSquare, UserCheck, XCircle } from "lucide-react"

export default function ExpenseDetailPage({ params }: { params: { id: string } }) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isRequestingManager, setIsRequestingManager] = useState(false)
  const [comments, setComments] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // In a real app, you would fetch this data from your API
  const expense = {
    id: params.id,
    employee: {
      name: "Michael Brown",
      email: "michael@example.com",
      initials: "MB",
    },
    description: "Conference registration",
    category: "Events",
    amount: 499.0,
    date: "2023-06-10",
    status: "pending",
    urgent: true,
    notes: "Annual industry conference in Chicago. Registration includes access to all sessions and workshops.",
    receiptUrl: "/placeholder.svg?height=600&width=400",
  }

  const handleApprove = async () => {
    setIsApproving(true)

    try {
      // In a real app, you would submit this to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Expense approved",
        description: "The expense has been approved successfully.",
      })

      router.push("/admin/approvals")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error approving the expense.",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)

    try {
      // In a real app, you would submit this to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Expense rejected",
        description: "The expense has been rejected.",
      })

      router.push("/admin/approvals")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error rejecting the expense.",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(false)
    }
  }

  const handleRequestManagerApproval = async () => {
    setIsRequestingManager(true)

    try {
      // In a real app, you would submit this to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Manager approval requested",
        description: "A request has been sent to the employee's manager.",
      })

      router.push("/admin/approvals")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error requesting manager approval.",
        variant: "destructive",
      })
    } finally {
      setIsRequestingManager(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expense Details</h1>
        <Badge variant="outline" className="text-base px-3 py-1">
          {expense.status === "pending" ? "Pending Review" : expense.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Information</CardTitle>
              <CardDescription>Review the details of this expense</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={expense.employee.avatar} alt={expense.employee.name} />
                  <AvatarFallback>{expense.employee.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{expense.employee.name}</p>
                  <p className="text-sm text-muted-foreground">{expense.employee.email}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p>{expense.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{expense.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="text-lg font-bold">{formatCurrency(expense.amount)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{formatDate(expense.date)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{expense.notes}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <img
                  src={expense.receiptUrl || "/placeholder.svg"}
                  alt="Receipt"
                  className="w-full max-h-96 object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
              <CardDescription>Approve or reject this expense</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Comments</label>
                <Textarea
                  placeholder="Add comments about this expense..."
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={handleApprove}
                disabled={isApproving || isRejecting || isRequestingManager}
              >
                {isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Expense
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRequestManagerApproval}
                disabled={isApproving || isRejecting || isRequestingManager}
              >
                {isRequestingManager ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Request Manager Approval
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleReject}
                disabled={isApproving || isRejecting || isRequestingManager}
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Expense
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expense submitted</p>
                    <p className="text-xs text-muted-foreground">{formatDate(expense.date, true)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pending review</p>
                    <p className="text-xs text-muted-foreground">{formatDate(expense.date, true)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">System notification</p>
                    <p className="text-xs">This expense exceeds the auto-approval threshold of $200</p>
                    <p className="text-xs text-muted-foreground">{formatDate(expense.date, true)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

