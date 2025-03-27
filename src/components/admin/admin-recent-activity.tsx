import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ActivityItem {
  id: string
  type: "approved" | "rejected" | "policy_change" | "manager_approval"
  user: {
    name: string
    avatar?: string
    initials: string
  }
  description: string
  timestamp: string
}

export function AdminRecentActivity() {
  // This would come from your database in a real app
  const activityItems: ActivityItem[] = [
    {
      id: "act-001",
      type: "approved",
      user: {
        name: "Admin User",
        initials: "AU",
      },
      description: "Approved expense report for Business Trip to Chicago",
      timestamp: "2023-06-15T14:30:00Z",
    },
    {
      id: "act-002",
      type: "rejected",
      user: {
        name: "Admin User",
        initials: "AU",
      },
      description: "Rejected expense for Office Party - exceeded policy limit",
      timestamp: "2023-06-15T13:15:00Z",
    },
    {
      id: "act-003",
      type: "policy_change",
      user: {
        name: "Admin User",
        initials: "AU",
      },
      description: "Updated auto-approval threshold from $50 to $75",
      timestamp: "2023-06-14T16:45:00Z",
    },
    {
      id: "act-004",
      type: "manager_approval",
      user: {
        name: "Jane Smith",
        initials: "JS",
      },
      description: "Requested manager approval for Marketing Conference expenses",
      timestamp: "2023-06-14T11:20:00Z",
    },
    {
      id: "act-005",
      type: "approved",
      user: {
        name: "Admin User",
        initials: "AU",
      },
      description: "Approved 12 expenses for reimbursement",
      timestamp: "2023-06-13T15:30:00Z",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and updates in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activityItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                <AvatarFallback>{item.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{item.user.name}</p>
                  <ActivityBadge type={item.type} />
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(item.timestamp, true)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityBadge({ type }: { type: ActivityItem["type"] }) {
  switch (type) {
    case "approved":
      return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>
    case "policy_change":
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500">
          Policy Change
        </Badge>
      )
    case "manager_approval":
      return <Badge variant="secondary">Manager Approval</Badge>
    default:
      return null
  }
}

