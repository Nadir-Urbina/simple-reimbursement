"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function PoliciesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would submit this to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Policies updated",
        description: "Your expense policies have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your policies.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expense Policies</h1>
        <p className="text-muted-foreground">Configure company-wide expense policies and approval workflows</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="approval">Approval Workflow</TabsTrigger>
          <TabsTrigger value="categories">Category Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>General Expense Policies</CardTitle>
                <CardDescription>Configure basic expense submission and approval settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Submission Rules</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="min-amount">Minimum Expense Amount ($)</Label>
                      <Input id="min-amount" type="number" min="0" step="0.01" defaultValue="5.00" />
                      <p className="text-xs text-muted-foreground">Expenses below this amount cannot be submitted</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receipt-threshold">Receipt Required Threshold ($)</Label>
                      <Input id="receipt-threshold" type="number" min="0" step="0.01" defaultValue="25.00" />
                      <p className="text-xs text-muted-foreground">Expenses above this amount require a receipt</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="require-notes">Require Notes</Label>
                      <p className="text-sm text-muted-foreground">
                        Require employees to provide notes for all expenses
                      </p>
                    </div>
                    <Switch id="require-notes" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-reports">Allow Expense Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow employees to group multiple expenses into reports
                      </p>
                    </div>
                    <Switch id="allow-reports" defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Auto-Approval Settings</h3>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-auto-approval">Enable Auto-Approval</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve expenses below a certain threshold
                      </p>
                    </div>
                    <Switch id="enable-auto-approval" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auto-approval-threshold">Auto-Approval Threshold ($)</Label>
                    <Input id="auto-approval-threshold" type="number" min="0" step="0.01" defaultValue="75.00" />
                    <p className="text-xs text-muted-foreground">
                      Expenses below this amount will be automatically approved
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>Configure the approval process for expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Manager Approval</h3>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-manager-approval">Require Manager Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Require manager approval for expenses above a certain threshold
                    </p>
                  </div>
                  <Switch id="require-manager-approval" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager-approval-threshold">Manager Approval Threshold ($)</Label>
                  <Input id="manager-approval-threshold" type="number" min="0" step="0.01" defaultValue="200.00" />
                  <p className="text-xs text-muted-foreground">Expenses above this amount require manager approval</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approval-levels">Approval Levels</Label>
                  <Select defaultValue="single">
                    <SelectTrigger id="approval-levels">
                      <SelectValue placeholder="Select approval levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Level (Finance Only)</SelectItem>
                      <SelectItem value="manager">Two Levels (Manager + Finance)</SelectItem>
                      <SelectItem value="department">Three Levels (Manager + Department Head + Finance)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Configure how many approval levels are required</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Settings</h3>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-managers">Notify Managers</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications to managers when approval is required
                    </p>
                  </div>
                  <Switch id="notify-managers" defaultChecked />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-employees">Notify Employees</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications to employees when expense status changes
                    </p>
                  </div>
                  <Switch id="notify-employees" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Limits</CardTitle>
              <CardDescription>Set spending limits for different expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                    <div className="col-span-4">Category</div>
                    <div className="col-span-3">Daily Limit</div>
                    <div className="col-span-3">Monthly Limit</div>
                    <div className="col-span-2">Required Receipt</div>
                  </div>

                  <CategoryLimitRow
                    category="Travel"
                    dailyLimit="500.00"
                    monthlyLimit="2500.00"
                    requireReceipt={true}
                  />
                  <CategoryLimitRow
                    category="Meals & Entertainment"
                    dailyLimit="100.00"
                    monthlyLimit="500.00"
                    requireReceipt={true}
                  />
                  <CategoryLimitRow
                    category="Office Supplies"
                    dailyLimit="200.00"
                    monthlyLimit="1000.00"
                    requireReceipt={true}
                  />
                  <CategoryLimitRow
                    category="Technology"
                    dailyLimit="1000.00"
                    monthlyLimit="3000.00"
                    requireReceipt={true}
                  />
                  <CategoryLimitRow
                    category="Marketing"
                    dailyLimit="300.00"
                    monthlyLimit="1500.00"
                    requireReceipt={true}
                  />
                  <CategoryLimitRow category="Other" dailyLimit="100.00" monthlyLimit="500.00" requireReceipt={false} />
                </div>

                <Button variant="outline">Add Category</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface CategoryLimitRowProps {
  category: string
  dailyLimit: string
  monthlyLimit: string
  requireReceipt: boolean
}

function CategoryLimitRow({ category, dailyLimit, monthlyLimit, requireReceipt }: CategoryLimitRowProps) {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0">
      <div className="col-span-4">{category}</div>
      <div className="col-span-3">
        <div className="relative">
          <span className="absolute left-3 top-2.5">$</span>
          <Input defaultValue={dailyLimit} className="pl-7" />
        </div>
      </div>
      <div className="col-span-3">
        <div className="relative">
          <span className="absolute left-3 top-2.5">$</span>
          <Input defaultValue={monthlyLimit} className="pl-7" />
        </div>
      </div>
      <div className="col-span-2 flex justify-center">
        <Switch defaultChecked={requireReceipt} />
      </div>
    </div>
  )
}

