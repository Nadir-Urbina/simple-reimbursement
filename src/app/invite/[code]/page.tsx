"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, getAuth, sendPasswordResetEmail, sendSignInLinkToEmail } from "firebase/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Inner component that uses the router
function InviteContent({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<string>("passwordless");
  const [acceptComplete, setAcceptComplete] = useState(false);

  useEffect(() => {
    async function fetchInvite() {
      try {
        const inviteRef = doc(db, "invites", params.code);
        const inviteSnap = await getDoc(inviteRef);
        
        if (inviteSnap.exists()) {
          const inviteData = inviteSnap.data();
          setInvite(inviteData);
          setEmail(inviteData.email || "");
        } else {
          toast({
            title: "Invalid Invitation",
            description: "This invitation link is invalid or has expired.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching invite:", error);
        toast({
          title: "Error",
          description: "There was an error retrieving your invitation.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchInvite();
  }, [params.code]);

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoining(true);

    try {
      if (!invite) {
        throw new Error("Invalid invitation");
      }

      // Get auth instance
      const auth = getAuth();
      let userCredential;

      if (activeTab === "password") {
        // Create a new user with email and password
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Send sign-in link for passwordless authentication
        const actionCodeSettings = {
          url: window.location.href,
          handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        localStorage.setItem("emailForSignIn", email);
        
        toast({
          title: "Magic Link Sent",
          description: "Check your email for the sign-in link to complete your account setup.",
        });
        
        setJoining(false);
        return;
      }

      // Get the user from the credential
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        displayName: name,
        organizationId: invite.organizationId,
        role: invite.role || "user",
        createdAt: new Date(),
      });

      // Update the invitation status
      await setDoc(doc(db, "invites", params.code), {
        ...invite,
        status: "accepted",
        acceptedAt: new Date(),
        acceptedBy: user.uid,
      }, { merge: true });

      setAcceptComplete(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Error accepting invite:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error accepting your invitation.",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invite) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid Invitation</CardTitle>
          <CardDescription>
            This invitation link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </CardFooter>
      </Card>
    );
  }

  if (acceptComplete) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <CardTitle>Welcome to {invite.organizationName || "SimpleReimbursement"}!</CardTitle>
          <CardDescription>
            Your account has been successfully created.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            You're being redirected to your dashboard...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Join {invite.organizationName || "SimpleReimbursement"}</CardTitle>
        <CardDescription>
          You've been invited to join {invite.organizationName || "an organization"} as a {invite.role || "team member"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="passwordless" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="passwordless">Passwordless</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="passwordless">
            <form onSubmit={handleAcceptInvite} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!invite.email}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={joining}>
                {joining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  "Send Magic Link"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="password">
            <form onSubmit={handleAcceptInvite} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="passwordEmail">Email</Label>
                <Input
                  id="passwordEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!invite.email}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordName">Full Name</Label>
                <Input
                  id="passwordName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={joining}>
                {joining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function InvitePage({ params }: { params: { code: string } }) {
  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Loading invitation...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      }>
        <InviteContent params={params} />
      </Suspense>
    </div>
  );
} 