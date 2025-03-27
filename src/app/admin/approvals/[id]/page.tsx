"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

// Mock expense data
const mockExpense = {
  id: "exp-1234",
  title: "Client Lunch Meeting",
  amount: 78.50,
  date: "2023-09-15",
  category: "Meals & Entertainment",
  description: "Lunch meeting with potential client to discuss new contract opportunities",
  receiptUrl: "https://placehold.co/600x400/png",
  status: "pending",
  submittedBy: {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@example.com"
  },
  submittedAt: "2023-09-15T14:30:00Z"
}

function ApprovalDetailContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [expense, setExpense] = useState<typeof mockExpense | null>(null)
  const [comment, setComment] = useState("")
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !loading) {
      router.push('/login')
      return
    }

    // Simulate fetching expense data
    const fetchExpense = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setExpense(mockExpense)
      } catch (error) {
        console.error("Error fetching expense:", error)
        toast({
          title: "Error",
          description: "Failed to load expense details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchExpense()
  }, [user, router, loading, params.id, toast])
  
  const handleApprove = async () => {
    setApproving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Expense Approved",
        description: "The expense has been approved successfully",
      })
      
      // Redirect back to approvals list
      router.push("/admin/approvals")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve expense",
        variant: "destructive"
      })
    } finally {
      setApproving(false)
    }
  }
  
  const handleReject = async () => {
    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      })
      return
    }
    
    setRejecting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Expense Rejected",
        description: "The expense has been rejected",
      })
      
      // Redirect back to approvals list
      router.push("/admin/approvals")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject expense",
        variant: "destructive"
      })
    } finally {
      setRejecting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  if (!expense) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/admin/approvals")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Approvals
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Not Found</CardTitle>
            <CardDescription>
              The expense you're looking for could not be found or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/admin/approvals")}>
              Return to Approvals
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/admin/approvals")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Approvals
      </Button>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{expense.title}</CardTitle>
            <CardDescription>
              Expense #{expense.id} submitted on {new Date(expense.submittedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Amount</Label>
                <p className="text-xl font-bold">${expense.amount.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Category</Label>
                <p>{expense.category}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Date</Label>
              <p>{new Date(expense.date).toLocaleDateString()}</p>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Description</Label>
              <p className="text-sm">{expense.description}</p>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Submitted By</Label>
              <p>{expense.submittedBy.name} ({expense.submittedBy.email})</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <img 
                  src={expense.receiptUrl} 
                  alt="Receipt" 
                  className="w-full h-auto" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Approval Action</CardTitle>
              <CardDescription>
                Review the expense details and make your decision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Comment (required for rejection)</Label>
                <textarea
                  id="comment"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your comments here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={rejecting || approving}
              >
                {rejecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </>
                )}
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={rejecting || approving}
              >
                {approving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ApprovalDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading expense details...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    }>
      <ApprovalDetailContent params={params} />
    </Suspense>
  )
}

