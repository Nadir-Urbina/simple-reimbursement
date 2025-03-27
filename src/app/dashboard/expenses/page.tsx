import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ExpensesList } from "@/components/expenses/expenses-list"

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Button asChild>
          <Link href="/dashboard/expenses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Expense
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Expenses</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ExpensesList status="all" />
            </TabsContent>
            <TabsContent value="pending">
              <ExpensesList status="pending" />
            </TabsContent>
            <TabsContent value="approved">
              <ExpensesList status="approved" />
            </TabsContent>
            <TabsContent value="rejected">
              <ExpensesList status="rejected" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

