"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BadgeDollarSign,
  BarChart4,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  Download,
  FileSpreadsheet,
  Layers,
  Loader2,
  PieChart,
  Users
} from "lucide-react"

function AdminDashboardContent() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !loading) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [user, router, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <CardDescription>All time expense total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$42,300.24</div>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑ 6%</span> from last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <CardDescription>Expenses awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">23</div>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-red-500">↑ 12%</span> from last week
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CardDescription>Total users in organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">18/25</div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                72% of licenses used
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
              <CardDescription>Current billing period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">Active</div>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Renews on Oct 15, 2023
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-medium">Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Alex Johnson", amount: "$123.45", date: "Today", category: "Travel" },
                  { name: "Sarah Williams", amount: "$67.80", date: "Yesterday", category: "Office Supplies" },
                  { name: "Mark Thompson", amount: "$230.00", date: "Sep 12", category: "Client Meeting" },
                  { name: "Linda Chen", amount: "$45.30", date: "Sep 10", category: "Transport" },
                  { name: "Robert Davis", amount: "$189.99", date: "Sep 8", category: "Technology" }
                ].map((expense, index) => (
                  <div key={index} className="flex items-center justify-between pb-2 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{expense.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{expense.date}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-muted rounded-sm">{expense.category}</span>
                      </div>
                    </div>
                    <div className="font-medium">{expense.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                View All Expenses
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-medium">Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm">Travel</div>
                    <div className="text-sm text-muted-foreground">$12,450.80</div>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm">Office Supplies</div>
                    <div className="text-sm text-muted-foreground">$4,200.00</div>
                  </div>
                  <Progress value={14} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm">Meals & Entertainment</div>
                    <div className="text-sm text-muted-foreground">$6,720.50</div>
                  </div>
                  <Progress value={21} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm">Technology</div>
                    <div className="text-sm text-muted-foreground">$5,890.20</div>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm">Other</div>
                    <div className="text-sm text-muted-foreground">$3,100.74</div>
                  </div>
                  <Progress value={9} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <BarChart4 className="h-4 w-4 mr-2" />
                Detailed Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">Monthly Expense Trend</CardTitle>
              <CardDescription>Last 6 months of expense data</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <BarChart4 className="h-16 w-16 mx-auto text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">
                  Chart visualization will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/users')}>
                <Users className="h-4 w-4 mr-3" /> Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/expenses')}>
                <Layers className="h-4 w-4 mr-3" /> Approve Expenses
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/reports')}>
                <PieChart className="h-4 w-4 mr-3" /> Generate Reports
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/settings')}>
                <BadgeDollarSign className="h-4 w-4 mr-3" /> Billing & Subscription
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  )
}

