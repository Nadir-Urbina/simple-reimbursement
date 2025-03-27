import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpensesSummary } from "@/components/dashboard/expenses-summary"
import { RecentExpenses } from "@/components/dashboard/recent-expenses"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/expenses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Expense
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Reimbursements</CardTitle>
            <CardDescription>Total amount awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240.50</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
            <CardDescription>Total approved expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,580.25</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <CardDescription>Expenses requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$320.00</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ExpensesSummary />
        <RecentExpenses />
      </div>
    </div>
  )
}

