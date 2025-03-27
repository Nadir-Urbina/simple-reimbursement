"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BadgeDollarSign, ClipboardList, FileText, Receipt, ReceiptText, Users } from "lucide-react"

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
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
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Employee Dashboard</h1>
          <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">My Expenses</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Expenses This Month</CardTitle>
                  <CardDescription>Your submitted expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Receipt className="w-5 h-5 mr-2 text-muted-foreground" />
                      <span className="text-2xl font-bold">$1,250.00</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="text-green-500 font-medium">+12%</span> from last month
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending Approval</CardTitle>
                  <CardDescription>Expenses awaiting review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ClipboardList className="w-5 h-5 mr-2 text-muted-foreground" />
                      <span className="text-2xl font-bold">3</span>
                    </div>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      In Review
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Reimbursement Status</CardTitle>
                  <CardDescription>Funds pending deposit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BadgeDollarSign className="w-5 h-5 mr-2 text-muted-foreground" />
                      <span className="text-2xl font-bold">$850.00</span>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      Processing
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center space-x-2">
                        <ReceiptText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Client Meeting Lunch</p>
                          <p className="text-xs text-muted-foreground">Today, 2:30 PM</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">$48.75</div>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center space-x-2">
                        <ReceiptText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Office Supplies</p>
                          <p className="text-xs text-muted-foreground">Yesterday, 10:15 AM</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">$125.30</div>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="flex items-center space-x-2">
                        <ReceiptText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Travel - Airport Taxi</p>
                          <p className="text-xs text-muted-foreground">Aug 28, 8:45 AM</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">$65.00</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ReceiptText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Conference Registration</p>
                          <p className="text-xs text-muted-foreground">Aug 25, 3:20 PM</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">$399.00</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full text-xs">View All Activity</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Budget</CardTitle>
                  <CardDescription>August 2023</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Travel</span>
                      <span className="text-sm">$650 / $800</span>
                    </div>
                    <Progress value={81} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Meals & Entertainment</span>
                      <span className="text-sm">$320 / $500</span>
                    </div>
                    <Progress value={64} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Office Supplies</span>
                      <span className="text-sm">$125 / $200</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Technology</span>
                      <span className="text-sm">$980 / $1200</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Total Budget Used</span>
                      <span>$2,075 / $2,700</span>
                    </div>
                    <Progress value={77} className="h-3" />
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="expenses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Expenses</CardTitle>
                  <CardDescription>View and manage your expense reports</CardDescription>
                </div>
                <Button size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  New Expense
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium border-b">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Category</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-5 p-4">
                      <div className="text-sm">Aug 29, 2023</div>
                      <div className="text-sm">Client Meeting Lunch</div>
                      <div className="text-sm">Meals</div>
                      <div className="text-sm">$48.75</div>
                      <div><span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span></div>
                    </div>
                    <div className="grid grid-cols-5 p-4">
                      <div className="text-sm">Aug 28, 2023</div>
                      <div className="text-sm">Office Supplies</div>
                      <div className="text-sm">Supplies</div>
                      <div className="text-sm">$125.30</div>
                      <div><span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span></div>
                    </div>
                    <div className="grid grid-cols-5 p-4">
                      <div className="text-sm">Aug 28, 2023</div>
                      <div className="text-sm">Airport Taxi</div>
                      <div className="text-sm">Travel</div>
                      <div className="text-sm">$65.00</div>
                      <div><span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Approved</span></div>
                    </div>
                    <div className="grid grid-cols-5 p-4">
                      <div className="text-sm">Aug 25, 2023</div>
                      <div className="text-sm">Conference Registration</div>
                      <div className="text-sm">Training</div>
                      <div className="text-sm">$399.00</div>
                      <div><span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Approved</span></div>
                    </div>
                    <div className="grid grid-cols-5 p-4">
                      <div className="text-sm">Aug 20, 2023</div>
                      <div className="text-sm">Hotel - Chicago Trip</div>
                      <div className="text-sm">Travel</div>
                      <div className="text-sm">$620.00</div>
                      <div><span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Reimbursed</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>Expense approvals and reimbursement requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Team Lunch Expense Approval</span>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Awaiting Approval</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Your manager needs to approve your team lunch expense of $135.50 before it can be processed for reimbursement.</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Submitted: Aug 27, 2023</span>
                      <Button variant="link" className="p-0 h-auto">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Receipt className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Reimbursement Status Update</span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Processing</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Your approved expenses totaling $850.00 are being processed by accounting. Expected deposit date: September 2, 2023.</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated: Aug 29, 2023</span>
                      <Button variant="link" className="p-0 h-auto">Track Status</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

