import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

interface Expense {
  id: string
  description: string
  amount: number
  date: string
  status: "pending" | "approved" | "rejected"
}

export function RecentExpenses() {
  // This would come from your database in a real app
  const expenses: Expense[] = [
    {
      id: "exp-001",
      description: "Client lunch meeting",
      amount: 78.5,
      date: "2023-06-15",
      status: "approved",
    },
    {
      id: "exp-002",
      description: "Office supplies",
      amount: 45.99,
      date: "2023-06-12",
      status: "pending",
    },
    {
      id: "exp-003",
      description: "Taxi fare",
      amount: 32.25,
      date: "2023-06-10",
      status: "approved",
    },
    {
      id: "exp-004",
      description: "Conference registration",
      amount: 299.0,
      date: "2023-06-05",
      status: "rejected",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Your most recent expense submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <Link key={expense.id} href={`/dashboard/expenses/${expense.id}`} className="block">
              <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{formatCurrency(expense.amount)}</p>
                  <StatusBadge status={expense.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: Expense["status"] }) {
  if (status === "approved") {
    return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
  }

  if (status === "rejected") {
    return <Badge variant="destructive">Rejected</Badge>
  }

  return <Badge variant="outline">Pending</Badge>
}

