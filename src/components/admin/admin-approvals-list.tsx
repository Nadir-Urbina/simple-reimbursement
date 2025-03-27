"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, Search, UserCheck } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Expense {
  id: string
  employee: {
    name: string
    email: string
    avatar?: string
    initials: string
  }
  description: string
  category: string
  amount: number
  date: string
  status: "pending" | "approved" | "rejected" | "manager"
  urgent: boolean
}

interface AdminApprovalsListProps {
  status: "pending" | "approved" | "rejected" | "manager"
}

export function AdminApprovalsList({ status }: AdminApprovalsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // This would come from your database in a real app
  const allExpenses: Expense[] = [
    {
      id: "exp-101",
      employee: {
        name: "Alex Johnson",
        email: "alex@example.com",
        initials: "AJ",
      },
      description: "Client meeting - lunch",
      category: "Meals",
      amount: 78.5,
      date: "2023-06-15",
      status: "pending",
      urgent: false,
    },
    {
      id: "exp-102",
      employee: {
        name: "Sarah Williams",
        email: "sarah@example.com",
        initials: "SW",
      },
      description: "Office supplies",
      category: "Office",
      amount: 145.99,
      date: "2023-06-14",
      status: "pending",
      urgent: false,
    },
    {
      id: "exp-103",
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
    },
    {
      id: "exp-104",
      employee: {
        name: "Emily Davis",
        email: "emily@example.com",
        initials: "ED",
      },
      description: "Team dinner",
      category: "Meals",
      amount: 215.8,
      date: "2023-06-08",
      status: "pending",
      urgent: false,
    },
    {
      id: "exp-105",
      employee: {
        name: "David Wilson",
        email: "david@example.com",
        initials: "DW",
      },
      description: "Flight to New York",
      category: "Travel",
      amount: 450.0,
      date: "2023-06-05",
      status: "approved",
      urgent: false,
    },
    {
      id: "exp-106",
      employee: {
        name: "Jennifer Lee",
        email: "jennifer@example.com",
        initials: "JL",
      },
      description: "Software subscription",
      category: "Tech",
      amount: 99.99,
      date: "2023-06-03",
      status: "approved",
      urgent: false,
    },
    {
      id: "exp-107",
      employee: {
        name: "Robert Taylor",
        email: "robert@example.com",
        initials: "RT",
      },
      description: "Marketing materials",
      category: "Marketing",
      amount: 350.0,
      date: "2023-06-01",
      status: "rejected",
      urgent: false,
    },
    {
      id: "exp-108",
      employee: {
        name: "Lisa Anderson",
        email: "lisa@example.com",
        initials: "LA",
      },
      description: "Client gift",
      category: "Other",
      amount: 75.0,
      date: "2023-05-28",
      status: "rejected",
      urgent: false,
    },
    {
      id: "exp-109",
      employee: {
        name: "James Martin",
        email: "james@example.com",
        initials: "JM",
      },
      description: "Hotel stay - Chicago",
      category: "Travel",
      amount: 850.0,
      date: "2023-05-25",
      status: "manager",
      urgent: true,
    },
    {
      id: "exp-110",
      employee: {
        name: "Patricia Moore",
        email: "patricia@example.com",
        initials: "PM",
      },
      description: "Training course",
      category: "Education",
      amount: 1200.0,
      date: "2023-05-20",
      status: "manager",
      urgent: false,
    },
  ]

  const filteredExpenses = allExpenses
    .filter((expense) => expense.status === status)
    .filter(
      (expense) =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by employee, description, or category..."
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
                <TableHead>Employee</TableHead>
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
                  <TableCell colSpan={7} className="h-24 text-center">
                    No expenses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={expense.employee.avatar} alt={expense.employee.name} />
                          <AvatarFallback>{expense.employee.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{expense.employee.name}</p>
                          <p className="text-xs text-muted-foreground">{expense.employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{expense.description}</span>
                        {expense.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={expense.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {expense.status === "manager" && (
                          <Button variant="outline" size="sm">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Check Status
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/approvals/${expense.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </div>
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

  if (status === "manager") {
    return <Badge variant="secondary">Awaiting Manager</Badge>
  }

  return <Badge variant="outline">Pending</Badge>
}

