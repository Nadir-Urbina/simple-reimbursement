"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { X, Plus, Send, Loader2, UserPlus } from "lucide-react"

type Invite = {
  email: string
  role: string
  valid: boolean
}

const roles = [
  { value: "user", label: "User" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" }
]

function InviteUsersContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [invites, setInvites] = useState<Invite[]>([
    { email: "", role: "user", valid: false }
  ])
  const [message, setMessage] = useState<string>("")
  const [sending, setSending] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !loading) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [user, router, loading])

  const addInvite = () => {
    setInvites([...invites, { email: "", role: "user", valid: false }])
  }

  const removeInvite = (index: number) => {
    const newInvites = [...invites]
    newInvites.splice(index, 1)
    setInvites(newInvites)
  }

  const updateInvite = (index: number, field: keyof Invite, value: string) => {
    const newInvites = [...invites]
    newInvites[index] = { 
      ...newInvites[index], 
      [field]: value,
      valid: field === 'email' ? validateEmail(value) : newInvites[index].valid 
    }
    setInvites(newInvites)
  }

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const allInvitesValid = (): boolean => {
    return invites.length > 0 && invites.every(invite => invite.valid)
  }

  const handleSendInvites = async () => {
    if (!allInvitesValid()) {
      toast({
        title: "Invalid invites",
        description: "Please ensure all email addresses are valid.",
        variant: "destructive",
      })
      return
    }

    setSending(true)

    try {
      const response = await fetch('/api/organizations/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invites: invites.map(({ email, role }) => ({ email, role })),
          message: message.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Invitations sent",
          description: `Successfully sent ${invites.length} invitation${invites.length > 1 ? 's' : ''}.`,
        })
        
        // Reset form
        setInvites([{ email: "", role: "user", valid: false }])
        setMessage("")
        
        // Redirect to users list
        router.push('/admin/users')
      } else {
        throw new Error(data.message || 'Failed to send invitations')
      }
    } catch (error) {
      console.error('Error sending invites:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <UserPlus className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Invite Team Members</CardTitle>
              <CardDescription>Add new users to your organization</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {invites.map((invite, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <Label htmlFor={`email-${index}`} className="sr-only">Email</Label>
                  <Input
                    id={`email-${index}`}
                    placeholder="Email address"
                    type="email"
                    value={invite.email}
                    onChange={(e) => updateInvite(index, 'email', e.target.value)}
                    className={invite.email && !invite.valid ? "border-red-300" : ""}
                  />
                  {invite.email && !invite.valid && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
                  )}
                </div>
                <div className="w-32">
                  <Label htmlFor={`role-${index}`} className="sr-only">Role</Label>
                  <Select
                    value={invite.role}
                    onValueChange={(value) => updateInvite(index, 'role', value)}
                  >
                    <SelectTrigger id={`role-${index}`}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInvite(index)}
                  disabled={invites.length === 1}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={addInvite}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another
          </Button>
          
          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Include a personal message with your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/admin/users')}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendInvites}
            disabled={!allInvitesValid() || sending}
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Invitations
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function InviteUsersPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    }>
      <InviteUsersContent />
    </Suspense>
  )
} 