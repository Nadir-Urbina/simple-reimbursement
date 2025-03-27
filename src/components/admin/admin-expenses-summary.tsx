"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsivePie } from "@nivo/pie"

export function AdminExpensesSummary() {
  // This would come from your database in a real app
  const monthlyData = [
    { month: "Jan", amount: 8200 },
    { month: "Feb", amount: 7500 },
    { month: "Mar", amount: 9100 },
    { month: "Apr", amount: 10200 },
    { month: "May", amount: 11500 },
    { month: "Jun", amount: 12580 },
  ]

  const categoryData = [
    { id: "Travel", value: 35 },
    { id: "Meals", value: 25 },
    { id: "Office", value: 15 },
    { id: "Tech", value: 18 },
    { id: "Other", value: 7 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
        <CardDescription>Overview of expense trends and distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
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
            <ResponsivePie
              data={categoryData}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "blues" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="text-foreground"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: "circle",
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

