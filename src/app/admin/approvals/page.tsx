import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminApprovalsList } from "@/components/admin/admin-approvals-list"

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expense Approvals</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="manager">Awaiting Manager</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <AdminApprovalsList status="pending" />
            </TabsContent>
            <TabsContent value="approved">
              <AdminApprovalsList status="approved" />
            </TabsContent>
            <TabsContent value="rejected">
              <AdminApprovalsList status="rejected" />
            </TabsContent>
            <TabsContent value="manager">
              <AdminApprovalsList status="manager" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

