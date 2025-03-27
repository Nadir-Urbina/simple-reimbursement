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

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("user");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [selectedManager, setSelectedManager] = useState<UserManager | null>(null);
  const [managerSearchQuery, setManagerSearchQuery] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [filteredManagers, setFilteredManagers] = useState<UserManager[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileImport, setFileImport] = useState<File | null>(null);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();
  const { user, organizationId } = useAuth();
  const managerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!organizationId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const usersRef = collection(db, "users");
        
        // Try without orderBy first (will work while index is being created)
        try {
          const q = query(
            usersRef, 
            where("organizationId", "==", organizationId)
          );
          
          const querySnapshot = await getDocs(q);
          const fetchedUsers = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              email: data.email,
              role: data.role,
              permissions: data.permissions || {
                approver: { isApprover: false, levels: [] },
                submitter: true,
                viewer: true
              },
              status: data.inviteStatus === "accepted" ? "active" : "invited",
              createdAt: data.createdAt?.toDate() || new Date(),
            };
          }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort in memory
          
          setUsers(fetchedUsers);
          setFilteredUsers(fetchedUsers);
        } catch (indexError) {
          console.error("Error with initial query, attempting with ordered query:", indexError);
          // If the above fails, try with orderBy (will work once index is created)
          const q = query(
            usersRef, 
            where("organizationId", "==", organizationId),
            orderBy("createdAt", "desc")
          );
          
          const querySnapshot = await getDocs(q);
          const fetchedUsers = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              email: data.email,
              role: data.role,
              permissions: data.permissions || {
                approver: { isApprover: false, levels: [] },
                submitter: true,
                viewer: true
              },
              status: data.inviteStatus === "accepted" ? "active" : "invited",
              createdAt: data.createdAt?.toDate() || new Date(),
            };
          });
          
          setUsers(fetchedUsers);
          setFilteredUsers(fetchedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load team members. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [organizationId, toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Filter managers based on search query
  useEffect(() => {
    if (managerSearchQuery.trim() === "") {
      setFilteredManagers(users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email
      })));
    } else {
      const lowercaseQuery = managerSearchQuery.toLowerCase();
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery)
      ).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email
      }));
      setFilteredManagers(filtered);
    }
  }, [managerSearchQuery, users]);

  // Close manager dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (managerInputRef.current && !managerInputRef.current.contains(event.target as Node)) {
        setShowManagerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [managerInputRef]);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!organizationId) return;
      
      try {
        const orgDoc = await getDoc(doc(db, "organizations", organizationId));
        if (orgDoc.exists()) {
          const orgData = orgDoc.data();
          if (orgData.licenses) {
            setLicenseInfo({
              admin: orgData.licenses.admin || { total: 0, used: 0 },
              user: orgData.licenses.user || { total: 0, used: 0 },
            });
          }
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };
    
    fetchOrganizationData();
  }, [organizationId]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail || !newUserName) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email for the new user.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!user?.id) {
        throw new Error("You must be logged in to send invitations");
      }
      
      // Now we pass the user ID directly in the request
      const response = await fetch("/api/organizations/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id, // Pass the user ID directly
          invites: [
            {
              email: newUserEmail,
              name: newUserName,
              phone: newUserPhone,
              managerId: selectedManager?.id || null,
              managerEmail: selectedManager?.email || null,
              role: newUserRole,
              permissions: newUserRole === "org_admin" 
                ? {
                    admin: true,
                    approver: { isApprover: true, levels: [1, 2, 3, 4, 5] },
                    submitter: true,
                    viewer: true,
                  }
                : newUserRole === "approver"
                ? {
                    admin: false,
                    approver: { isApprover: true, levels: [1] },
                    submitter: true,
                    viewer: true,
                  }
                : {
                    admin: false,
                    approver: { isApprover: false, levels: [] },
                    submitter: true,
                    viewer: true,
                  }
            }
          ],
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error("Error response:", error);
        throw new Error(error.error || error.message || "Failed to send invitation");
      }
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${newUserEmail}`,
      });
      
      // Reset form and close dialog
      setNewUserEmail("");
      setNewUserName("");
      setNewUserRole("user");
      setNewUserPhone("");
      setSelectedManager(null);
      setShowAddUserDialog(false);
      
      // Refresh the user list
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectManager = (manager: UserManager) => {
    setSelectedManager(manager);
    setManagerSearchQuery(manager.name);
    setShowManagerDropdown(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileImport(e.target.files[0]);
    }
  };

  const handleFileImport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileImport) {
      toast({
        title: "No file selected",
        description: "Please select a CSV or Excel file to import.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("file", fileImport);
      
      const response = await fetch("/api/organizations/import-users", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to import users");
      }
      
      const result = await response.json();
      
      toast({
        title: "Import successful",
        description: `Successfully imported ${result.importedCount} users.`,
      });
      
      // Reset form and close dialog
      setFileImport(null);
      setShowImportDialog(false);
      
      // Refresh the user list
      router.refresh();
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import users",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const header = "Name,Email,Role";
    const example = "John Doe,john@example.com,user";
    const csvContent = `${header}\n${example}`;
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user-import-template.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
        <p className="text-muted-foreground mb-4">
          Manage your team members and permissions.
        </p>
        
        {licenseInfo && (
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="bg-muted/30 rounded-md p-3 flex items-center gap-2">
              <div>
                <span className="text-sm text-muted-foreground block">Admin Licenses</span>
                <span className="text-lg font-semibold">{licenseInfo.admin.used} / {licenseInfo.admin.total} used</span>
              </div>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ 
                    width: `${Math.min(100, (licenseInfo.admin.used / Math.max(1, licenseInfo.admin.total)) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-md p-3 flex items-center gap-2">
              <div>
                <span className="text-sm text-muted-foreground block">User Licenses</span>
                <span className="text-lg font-semibold">{licenseInfo.user.used} / {licenseInfo.user.total} used</span>
              </div>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ 
                    width: `${Math.min(100, (licenseInfo.user.used / Math.max(1, licenseInfo.user.total)) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Users
          </Button>
          <Button onClick={() => setShowAddUserDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
        
        {users.length < 2 && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
            <p className="text-sm">
              <strong>Pro tip:</strong> We recommend adding managers and supervisors first to make it easier to assign managers to other team members later.
            </p>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              View and manage your team members and their permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-sm text-muted-foreground">Loading team members...</p>
              </div>
            ) : !organizationId ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No organization detected. Please ensure you're logged in with an organization account.</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No team members found.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "org_admin" ? "default" : user.role === "approver" ? "outline" : "secondary"}>
                            {user.role === "org_admin" 
                              ? "Admin" 
                              : user.role === "approver" 
                              ? "Approver" 
                              : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.permissions.approver.isApprover && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                Approver
                              </Badge>
                            )}
                            {user.permissions.submitter && (
                              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                Submitter
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "success" : user.status === "invited" ? "warning" : "destructive"}>
                            {user.status === "active" 
                              ? "Active" 
                              : user.status === "invited" 
                              ? "Invited" 
                              : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit permissions</DropdownMenuItem>
                              <DropdownMenuItem>Resend invite</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Remove user</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member and send them an invitation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <div className="relative" ref={managerInputRef}>
                  <Input
                    id="manager"
                    placeholder="Search for a manager..."
                    value={managerSearchQuery}
                    onChange={(e) => {
                      setManagerSearchQuery(e.target.value);
                      setShowManagerDropdown(true);
                      if (!e.target.value) {
                        setSelectedManager(null);
                      }
                    }}
                    onFocus={() => setShowManagerDropdown(true)}
                  />
                  {showManagerDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredManagers.length > 0 ? (
                        filteredManagers.map((manager) => (
                          <div
                            key={manager.id}
                            className="px-4 py-2 cursor-pointer hover:bg-muted"
                            onClick={() => selectManager(manager)}
                          >
                            <div className="font-medium">{manager.name}</div>
                            <div className="text-sm text-muted-foreground">{manager.email}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          No matching users found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedManager && (
                  <div className="text-sm text-muted-foreground">
                    Manager Email: {selectedManager.email}
                  </div>
                )}
                {users.length < 2 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    You can add managers later if you're just starting to build your team.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                >
                  <option value="user">Regular User</option>
                  <option value="approver">Approver</option>
                  <option value="org_admin">Admin</option>
                </select>
                <p className="text-sm text-muted-foreground mt-1">
                  {newUserRole === "org_admin" 
                    ? "Admins have full access to manage the organization." 
                    : newUserRole === "approver" 
                    ? "Approvers can review and approve expense submissions." 
                    : "Regular users can submit expenses for approval."}
                </p>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddUserDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Import Users Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Team Members</DialogTitle>
            <DialogDescription>
              Import multiple team members from a CSV or Excel file.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFileImport}>
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={downloadTemplate}
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              <div className="border rounded-md p-4 bg-muted/30">
                <Label htmlFor="file" className="block mb-2">Upload File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="bg-background"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Upload a CSV or Excel file with columns for Name, Email, and Role.
                </p>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !fileImport}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import Users"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 