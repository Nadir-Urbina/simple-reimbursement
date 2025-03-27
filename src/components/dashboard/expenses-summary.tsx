"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveBar } from "@nivo/bar"

export function ExpensesSummary() {
  // This would come from your database in a real app
  const monthlyData = [
    { month: "Jan", amount: 1200 },
    { month: "Feb", amount: 1800 },
    { month: "Mar", amount: 1400 },
    { month: "Apr", amount: 2200 },
    { month: "May", amount: 1900 },
    { month: "Jun", amount: 2400 },
  ]

  const categoryData = [
    { category: "Travel", amount: 3200 },
    { category: "Meals", amount: 2100 },
    { category: "Office", amount: 1500 },
    { category: "Tech", amount: 2800 },
    { category: "Other", amount: 900 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
        <CardDescription>View your expense trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="h-80">
            <ResponsiveBar
              data={monthlyData}
              keys={["amount"]}
              indexBy="month"
              margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              colors={{ scheme: "blues" }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Month",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Amount ($)",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              labelFormat={(value) => `$${value}`}
              role="application"
              ariaLabel="Expense summary by month"
            />
          </TabsContent>
          <TabsContent value="category" className="h-80">
            <ResponsiveBar
              data={categoryData}
              keys={["amount"]}
              indexBy="category"
              margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              colors={{ scheme: "purples" }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Category",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Amount ($)",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              labelFormat={(value) => `$${value}`}
              role="application"
              ariaLabel="Expense summary by category"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

