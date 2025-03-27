"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Upload, UserPlus, MoreHorizontal, Search, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

type UserRole = "org_admin" | "approver" | "user";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: {
    approver: {
      isApprover: boolean;
      levels: number[];
    };
    submitter: boolean;
    viewer: boolean;
  };
  status: "active" | "invited" | "disabled";
  createdAt: Date;
}

// Add a new interface for the user manager
interface UserManager {
  id: string;
  name: string;
  email: string;
}

// Add license interface
interface LicenseInfo {
  admin: {
    total: number;
    used: number;
  };
  user: {
    total: number;
    used: number;
  };
}

// Simulated team members data
const TEAM_MEMBERS = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Manager",
    department: "Finance",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "active"
  },
  {
    id: "2",
    name: "Jamie Smith",
    email: "jamie@example.com",
    role: "Team Member",
    department: "Marketing",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
    status: "active"
  },
  {
    id: "3",
    name: "Taylor Wilson",
    email: "taylor@example.com",
    role: "Admin",
    department: "Operations",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
    status: "active"
  },
  {
    id: "4",
    name: "Morgan Rivera",
    email: "morgan@example.com",
    role: "Team Member",
    department: "IT",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
    status: "pending"
  },
  {
    id: "5",
    name: "Casey Chen",
    email: "casey@example.com",
    role: "Team Member",
    department: "Sales",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey",
    status: "active"
  }
]

// Get initials from name
function getInitials(name: string) {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
}

// Component for team members view
function TeamPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !loading) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [user, router, loading]);
  
  // Filter team members
  const filteredMembers = TEAM_MEMBERS.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter;
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });
  
  const departments = ["Finance", "Marketing", "Operations", "IT", "Sales"];
  const roles = ["Admin", "Manager", "Team Member"];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">
            View and manage your organization's team members
          </p>
        </div>
        <Button onClick={() => router.push("/admin/users/invite")}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Team</CardTitle>
          <CardDescription>
            {filteredMembers.length} team member{filteredMembers.length !== 1 ? 's' : ''} in your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-40">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-2 p-4 border-b font-medium">
              <div className="col-span-5">Name</div>
              <div className="col-span-2 hidden md:block">Role</div>
              <div className="col-span-3 hidden md:block">Department</div>
              <div className="col-span-2">Status</div>
            </div>
            <div className="divide-y">
              {filteredMembers.length > 0 ? (
                filteredMembers.map(member => (
                  <div key={member.id} className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-muted/50">
                    <div className="col-span-5 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    <div className="col-span-2 hidden md:block">
                      {member.role}
                    </div>
                    <div className="col-span-3 hidden md:block">
                      {member.department}
                    </div>
                    <div className="col-span-2">
                      <Badge variant={member.status === "active" ? "outline" : "secondary"}>
                        {member.status === "active" ? "Active" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No team members found</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Contact All
          </Button>
          <div className="text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {TEAM_MEMBERS.length} members
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function TeamPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading team members...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    }>
      <TeamPageContent />
    </Suspense>
  );
} 