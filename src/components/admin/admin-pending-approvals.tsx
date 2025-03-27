import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface PendingExpense {
  id: string
  employee: string
  description: string
  amount: number
  date: string
  urgent: boolean
}

export function AdminPendingApprovals() {
  // This would come from your database in a real app
  const pendingExpenses: PendingExpense[] = [
    {
      id: "exp-101",
      employee: "Alex Johnson",
      description: "Client meeting - lunch",
      amount: 78.5,
      date: "2023-06-15",
      urgent: false,
    },
    {
      id: "exp-102",
      employee: "Sarah Williams",
      description: "Office supplies",
      amount: 145.99,
      date: "2023-06-14",
      urgent: false,
    },
    {
      id: "exp-103",
      employee: "Michael Brown",
      description: "Conference registration",
      amount: 499.0,
      date: "2023-06-10",
      urgent: true,
    },
    {
      id: "exp-104",
      employee: "Emily Davis",
      description: "Team dinner",
      amount: 215.8,
      date: "2023-06-08",
      urgent: false,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Recent expenses awaiting your review</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/admin/approvals">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingExpenses.map((expense) => (
            <Link key={expense.id} href={`/admin/approvals/${expense.id}`} className="block">
              <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{expense.description}</p>
                    {expense.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{expense.employee}</span>
                    <span>•</span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="font-medium">{formatCurrency(expense.amount)}</div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

