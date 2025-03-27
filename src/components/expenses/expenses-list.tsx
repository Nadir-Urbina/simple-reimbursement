"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, Search } from "lucide-react"
import Link from "next/link"

interface Expense {
  id: string
  description: string
  category: string
  amount: number
  date: string
  status: "pending" | "approved" | "rejected"
}

interface ExpensesListProps {
  status: "all" | "pending" | "approved" | "rejected"
}

export function ExpensesList({ status }: ExpensesListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // This would come from your database in a real app
  const allExpenses: Expense[] = [
    {
      id: "exp-001",
      description: "Client lunch meeting",
      category: "Meals",
      amount: 78.5,
      date: "2023-06-15",
      status: "approved",
    },
    {
      id: "exp-002",
      description: "Office supplies",
      category: "Office",
      amount: 45.99,
      date: "2023-06-12",
      status: "pending",
    },
    {
      id: "exp-003",
      description: "Taxi fare",
      category: "Travel",
      amount: 32.25,
      date: "2023-06-10",
      status: "approved",
    },
    {
      id: "exp-004",
      description: "Conference registration",
      category: "Events",
      amount: 299.0,
      date: "2023-06-05",
      status: "rejected",
    },
    {
      id: "exp-005",
      description: "Hotel stay",
      category: "Travel",
      amount: 425.75,
      date: "2023-06-03",
      status: "approved",
    },
    {
      id: "exp-006",
      description: "Software subscription",
      category: "Tech",
      amount: 49.99,
      date: "2023-06-01",
      status: "pending",
    },
    {
      id: "exp-007",
      description: "Team dinner",
      category: "Meals",
      amount: 215.8,
      date: "2023-05-28",
      status: "approved",
    },
    {
      id: "exp-008",
      description: "Marketing materials",
      category: "Marketing",
      amount: 189.5,
      date: "2023-05-25",
      status: "rejected",
    },
  ]

  const filteredExpenses = allExpenses
    .filter((expense) => status === "all" || expense.status === status)
    .filter(
      (expense) =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expenses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No expenses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={expense.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/expenses/${expense.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
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

