"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function InvitePage() {
  // Use the useParams hook instead of destructuring from props
  const params = useParams();
  const inviteCode = params.code as string;

  const [invite, setInvite] = useState<any | null>(null);
  const [inviteDocId, setInviteDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [expired, setExpired] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordless, setPasswordless] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchInvite = async () => {
      if (!inviteCode) {
        setError("Invalid invitation link.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching invite with code:", inviteCode);
        
        // Query for invite with this code (searching by field)
        const invitesRef = collection(db, "invites");
        const q = query(invitesRef, where("code", "==", inviteCode));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError("This invitation link is invalid or has already been used.");
          setLoading(false);
          return;
        }
        
        // Get the invite document from the query result
        const inviteDoc = querySnapshot.docs[0];
        const inviteData = inviteDoc.data();
        setInviteDocId(inviteDoc.id);
        
        // Check if expired
        const expiryDate = inviteData.expiresAt?.toDate();
        if (expiryDate && new Date() > expiryDate) {
          setExpired(true);
          setError("This invitation has expired.");
          setLoading(false);
          return;
        }
        
        // Check if already accepted
        if (inviteData.status === "accepted") {
          setError("This invitation has already been accepted.");
          setLoading(false);
          return;
        }
        
        setInvite(inviteData);
        if (inviteData.name) {
          setName(inviteData.name);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invite:", error);
        setError("Failed to load invitation. Please try again.");
        setLoading(false);
      }
    };
    
    if (inviteCode) {
      fetchInvite();
    }
  }, [inviteCode]);
  
  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invite || !inviteDocId) return;
    
    if (!passwordless && !password) {
      setError("Please set a password.");
      return;
    }
    
    if (!passwordless && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (!passwordless && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    
    setAccepting(true);
    setError("");
    
    try {
      // Create user in Firebase Auth
      const { user } = await createUserWithEmailAndPassword(auth, invite.email, password || Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12));
      
      // Update user profile
      await updateProfile(user, {
        displayName: name,
      });
      
      // Create user document in Firestore (using setDoc instead of updateDoc)
      await setDoc(doc(db, "users", user.uid), {
        name,
        email: invite.email,
        phone: invite.phone || null,
        role: invite.role,
        permissions: invite.permissions,
        organizationId: invite.organizationId,
        managerId: invite.managerId || null,
        managerEmail: invite.managerEmail || null,
        inviteStatus: "accepted",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        passwordlessAuth: passwordless,
      });
      
      // Update the invite
      await updateDoc(doc(db, "invites", inviteDocId), {
        status: "accepted",
        acceptedAt: serverTimestamp(),
      });
      
      toast({
        title: "Success!",
        description: "Your account has been created. Redirecting to dashboard...",
      });
      
      // User is already logged in after createUserWithEmailAndPassword
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error accepting invite:", error);
      setError(error instanceof Error ? error.message : "Failed to create your account.");
      setAccepting(false);
    }
  };

  const togglePasswordless = () => {
    setPasswordless(!passwordless);
    if (!passwordless) {
      setPassword("");
      setConfirmPassword("");
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading invitation...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Invitation Error</CardTitle>
            <CardDescription>There was a problem with your invitation.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            {expired && (
              <p className="mt-4">Please contact your administrator for a new invitation.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            Complete your account setup to join {invite?.organizationName || "your organization"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAcceptInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={invite?.email || ""}
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 my-4">
              <input
                type="checkbox"
                id="passwordless"
                checked={passwordless}
                onChange={togglePasswordless}
                className="h-4 w-4 text-primary"
              />
              <Label htmlFor="passwordless" className="cursor-pointer">
                Use passwordless login (sign in with email link)
              </Label>
            </div>
            
            {!passwordless && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!passwordless}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!passwordless}
                  />
                </div>
              </>
            )}
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={accepting}>
              {accepting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your account...
                </>
              ) : (
                "Accept Invitation"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 