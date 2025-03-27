'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { InfoIcon, Loader2, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function InviteUsersPage() {
  const [invites, setInvites] = useState([
    { email: '', role: 'user', permissions: { submitter: true, approver: { isApprover: false, levels: [] }, viewer: true } }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationDetails, setOrganizationDetails] = useState(null);
  const [selectedApprovalGroup, setSelectedApprovalGroup] = useState('default');
  const [availableLicenses, setAvailableLicenses] = useState({ admin: 0, user: 0 });
  
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchOrganizationDetails = async () => {
      try {
        const response = await fetch('/api/organizations/current');
        if (!response.ok) {
          throw new Error('Failed to fetch organization details');
        }

        const data = await response.json();
        setOrganizationDetails(data);
        
        // Calculate available licenses
        setAvailableLicenses({
          admin: data.licenses.admin.total - data.licenses.admin.used,
          user: data.licenses.user.total - data.licenses.user.used,
        });
        
        setIsLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch organization details',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchOrganizationDetails();
  }, [user, toast]);

  const handleEmailChange = (index, value) => {
    const newInvites = [...invites];
    newInvites[index].email = value;
    setInvites(newInvites);
  };

  const handleRoleChange = (index, value) => {
    const newInvites = [...invites];
    newInvites[index].role = value;
    
    // Set default permissions based on role
    if (value === 'org_admin') {
      newInvites[index].permissions = {
        admin: true,
        approver: { isApprover: true, levels: [1, 2, 3, 4, 5] },
        submitter: true,
        viewer: true,
      };
    } else if (value === 'approver') {
      newInvites[index].permissions = {
        admin: false,
        approver: { isApprover: true, levels: [1] },
        submitter: true,
        viewer: true,
      };
    } else {
      newInvites[index].permissions = {
        admin: false,
        approver: { isApprover: false, levels: [] },
        submitter: true,
        viewer: true,
      };
    }
    
    setInvites(newInvites);
  };

  const handleApproverToggle = (index, isApprover) => {
    const newInvites = [...invites];
    newInvites[index].permissions.approver.isApprover = isApprover;
    
    // If turning off approver, clear the approval levels
    if (!isApprover) {
      newInvites[index].permissions.approver.levels = [];
    } else if (newInvites[index].permissions.approver.levels.length === 0) {
      // If turning on approver and no levels are selected, default to level 1
      newInvites[index].permissions.approver.levels = [1];
    }
    
    setInvites(newInvites);
  };

  const handleApprovalLevelToggle = (index, level) => {
    const newInvites = [...invites];
    const currentLevels = newInvites[index].permissions.approver.levels;
    
    if (currentLevels.includes(level)) {
      // Remove the level if it's already selected
      newInvites[index].permissions.approver.levels = currentLevels.filter(l => l !== level);
    } else {
      // Add the level if it's not selected
      newInvites[index].permissions.approver.levels = [...currentLevels, level].sort();
    }
    
    setInvites(newInvites);
  };

  const handleSubmitterToggle = (index, isSubmitter) => {
    const newInvites = [...invites];
    newInvites[index].permissions.submitter = isSubmitter;
    setInvites(newInvites);
  };

  const handleViewerToggle = (index, isViewer) => {
    const newInvites = [...invites];
    newInvites[index].permissions.viewer = isViewer;
    setInvites(newInvites);
  };

  const addInvite = () => {
    setInvites([
      ...invites,
      { email: '', role: 'user', permissions: { submitter: true, approver: { isApprover: false, levels: [] }, viewer: true } }
    ]);
  };

  const removeInvite = (index) => {
    if (invites.length > 1) {
      setInvites(invites.filter((_, i) => i !== index));
    }
  };

  const validateInvites = () => {
    const errors = [];
    
    // Check for empty emails
    invites.forEach((invite, index) => {
      if (!invite.email) {
        errors.push(`Invite #${index + 1} has an empty email address`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email)) {
        errors.push(`Invite #${index + 1} has an invalid email address`);
      }
    });
    
    // Check for duplicate emails
    const emails = invites.map(invite => invite.email.toLowerCase());
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      errors.push('There are duplicate email addresses');
    }
    
    // Check license availability
    const adminCount = invites.filter(invite => invite.role === 'org_admin').length;
    const userCount = invites.filter(invite => invite.role !== 'org_admin').length;
    
    if (adminCount > availableLicenses.admin) {
      errors.push(`Not enough admin licenses available (needed: ${adminCount}, available: ${availableLicenses.admin})`);
    }
    
    if (userCount > availableLicenses.user) {
      errors.push(`Not enough user licenses available (needed: ${userCount}, available: ${availableLicenses.user})`);
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateInvites();
    if (errors.length > 0) {
      errors.forEach(error => {
        toast({
          title: 'Validation Error',
          description: error,
          variant: 'destructive',
        });
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/organizations/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invites,
          approvalGroupId: selectedApprovalGroup,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invitations');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Invitations Sent',
        description: `Successfully sent ${data.sentCount} invitation${data.sentCount !== 1 ? 's' : ''}`,
      });
      
      // Reset form
      setInvites([
        { email: '', role: 'user', permissions: { submitter: true, approver: { isApprover: false, levels: [] }, viewer: true } }
      ]);
      
      // Redirect to users list
      router.push('/admin/users');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send invitations',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading organization details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Invite Team Members</CardTitle>
          <CardDescription>
            Add team members to your organization. Each invitation counts towards your license quota.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* License Summary */}
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-md bg-muted/50">
              <div>
                <p className="text-sm font-medium">Admin Licenses</p>
                <p className="text-2xl font-bold">{availableLicenses.admin} available</p>
              </div>
              <div>
                <p className="text-sm font-medium">User Licenses</p>
                <p className="text-2xl font-bold">{availableLicenses.user} available</p>
              </div>
            </div>

            {/* Approval Group */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="approvalGroup">Default Approval Group</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>The approval group determines which approval workflow will be applied to expenses submitted by these users.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={selectedApprovalGroup} onValueChange={setSelectedApprovalGroup}>
                <SelectTrigger id="approvalGroup">
                  <SelectValue placeholder="Select approval group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Group</SelectItem>
                  {/* Add more groups here as they're created */}
                </SelectContent>
              </Select>
            </div>

            {/* Invitations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Team Members</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInvite}
                  disabled={invites.length >= (availableLicenses.admin + availableLicenses.user)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another
                </Button>
              </div>

              {invites.map((invite, index) => (
                <Card key={index} className="border border-muted">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Invitation {index + 1}</CardTitle>
                      {invites.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInvite(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`email-${index}`}>Email Address</Label>
                        <Input
                          id={`email-${index}`}
                          placeholder="colleague@company.com"
                          type="email"
                          value={invite.email}
                          onChange={(e) => handleEmailChange(index, e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`role-${index}`}>Role Type</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>Admin roles have full access and count against admin licenses. User roles can have various permissions and count against user licenses.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select
                          value={invite.role}
                          onValueChange={(value) => handleRoleChange(index, value)}
                        >
                          <SelectTrigger id={`role-${index}`}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="org_admin">Organization Admin</SelectItem>
                            <SelectItem value="approver">Finance Approver</SelectItem>
                            <SelectItem value="user">Regular User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Permissions</h4>
                      
                      <Tabs defaultValue="permissions" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="permissions">Permissions</TabsTrigger>
                          <TabsTrigger value="approval-levels">Approval Levels</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="permissions" className="space-y-4 pt-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`submitter-${index}`}
                              checked={invite.permissions.submitter}
                              onCheckedChange={(checked) => handleSubmitterToggle(index, checked)}
                            />
                            <div className="grid gap-1.5">
                              <Label 
                                htmlFor={`submitter-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Submitter
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Can submit expenses for reimbursement
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`approver-${index}`}
                              checked={invite.permissions.approver.isApprover}
                              onCheckedChange={(checked) => handleApproverToggle(index, checked)}
                              disabled={invite.role === 'org_admin'} // Admin is always an approver
                            />
                            <div className="grid gap-1.5">
                              <Label 
                                htmlFor={`approver-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Approver
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Can approve expense submissions from others
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`viewer-${index}`}
                              checked={invite.permissions.viewer}
                              onCheckedChange={(checked) => handleViewerToggle(index, checked)}
                            />
                            <div className="grid gap-1.5">
                              <Label 
                                htmlFor={`viewer-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Viewer
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Can view reports and analytics
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="approval-levels" className="pt-4">
                          <div className="space-y-4">
                            {invite.permissions.approver.isApprover || invite.role === 'org_admin' ? (
                              <>
                                <p className="text-sm text-muted-foreground">
                                  Select which levels this user can approve. Higher levels typically handle larger expense amounts.
                                </p>
                                <div className="grid grid-cols-5 gap-2">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <div key={level} className="text-center">
                                      <Checkbox
                                        id={`level-${index}-${level}`}
                                        checked={invite.permissions.approver.levels.includes(level)}
                                        onCheckedChange={() => handleApprovalLevelToggle(index, level)}
                                        disabled={invite.role === 'org_admin'} // Admin can approve all levels
                                        className="mb-2"
                                      />
                                      <Label 
                                        htmlFor={`level-${index}-${level}`}
                                        className="text-sm font-medium block"
                                      >
                                        Level {level}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-sm text-muted-foreground py-4">
                                Enable the Approver permission to configure approval levels.
                              </p>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push('/admin/users')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Invites...
                </>
              ) : (
                'Send Invitations'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 