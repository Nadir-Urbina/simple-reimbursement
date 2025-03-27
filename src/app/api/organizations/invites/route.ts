import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { customAlphabet } from 'nanoid';
import { getCurrentUser } from '@/lib/session';
import { sendInviteEmail } from '@/lib/email/resend';

// Generate 8-character invitation codes
const nanoid = customAlphabet('ABCDEFGHIJKLMNPQRSTUVWXYZ123456789', 8);

export async function POST(req: Request) {
  try {
    // Parse request body
    const requestData = await req.json();
    const { invites, approvalGroupId = 'default', userId } = requestData;
    
    // Try to get user from the request body's userId or from getCurrentUser
    let user;
    let userIdForQuery = userId;
    
    // Fallback to getCurrentUser if no userId provided
    if (!userIdForQuery) {
      try {
        user = await getCurrentUser();
        if (user) {
          userIdForQuery = user.uid;
        }
      } catch (error) {
        console.error("Error with getCurrentUser:", error);
      }
    }
    
    if (!userIdForQuery) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        message: 'You must be logged in to perform this action. Please provide a userId.'
      }, { status: 401 });
    }
    
    console.log('Using userId for query:', userIdForQuery);
    
    if (!invites || !Array.isArray(invites) || invites.length === 0) {
      return NextResponse.json({ error: 'No valid invites provided' }, { status: 400 });
    }
    
    // Get user data to check organization and get sender info
    const userDoc = await getDoc(doc(db, 'users', userIdForQuery));
    if (!userDoc.exists()) {
      return NextResponse.json({ 
        error: 'User not found', 
        message: 'Your user account was not found in the database' 
      }, { status: 404 });
    }
    
    const userData = userDoc.data();
    const organizationId = userData.organizationId;
    const senderName = userData.name || 'A team administrator';
    
    if (!organizationId) {
      return NextResponse.json({ 
        error: 'No organization', 
        message: 'Your account is not associated with any organization'
      }, { status: 400 });
    }
    
    // Get organization data to check license limits
    const orgDoc = await getDoc(doc(db, 'organizations', organizationId));
    if (!orgDoc.exists()) {
      return NextResponse.json({ 
        error: 'Organization not found',
        message: 'The organization associated with your account was not found'
      }, { status: 404 });
    }
    
    const orgData = orgDoc.data();
    const organizationName = orgData.name || 'Your Organization';
    
    // Check if approval group exists
    const approvalGroupDoc = await getDoc(doc(db, 'organizations', organizationId, 'approvalGroups', approvalGroupId));
    if (!approvalGroupDoc.exists()) {
      return NextResponse.json({ 
        error: 'Approval group not found',
        message: `The approval group "${approvalGroupId}" was not found in your organization`
      }, { status: 404 });
    }
    
    // Calculate available licenses
    const availableLicenses = {
      admin: orgData.licenses.admin.total - orgData.licenses.admin.used,
      user: orgData.licenses.user.total - orgData.licenses.user.used,
    };
    
    // Count needed licenses by role
    const neededLicenses = {
      admin: invites.filter(invite => invite.role === 'org_admin').length,
      user: invites.filter(invite => invite.role !== 'org_admin').length,
    };
    
    // Check if enough licenses are available
    if (neededLicenses.admin > availableLicenses.admin) {
      return NextResponse.json({
        error: `Not enough admin licenses available (needed: ${neededLicenses.admin}, available: ${availableLicenses.admin})`,
      }, { status: 400 });
    }
    
    if (neededLicenses.user > availableLicenses.user) {
      return NextResponse.json({
        error: `Not enough user licenses available (needed: ${neededLicenses.user}, available: ${availableLicenses.user})`,
      }, { status: 400 });
    }
    
    // Check for existing users with the same emails
    const emailsToCheck = invites.map(invite => invite.email.toLowerCase());
    
    // Check in Firebase Auth first
    try {
      const existingUsers = await Promise.all(
        emailsToCheck.map(async (email) => {
          try {
            const methods = await auth.fetchSignInMethodsForEmail(email);
            return methods.length > 0 ? email : null;
          } catch (e) {
            return null;
          }
        })
      );
      
      const existingEmails = existingUsers.filter(Boolean);
      if (existingEmails.length > 0) {
        return NextResponse.json({
          error: `Some emails are already registered: ${existingEmails.join(', ')}`,
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Error checking existing users:', error);
    }
    
    // Check for existing pending invites
    const invitesRef = collection(db, 'invites');
    const existingInvitesQuery = query(
      invitesRef,
      where('email', 'in', emailsToCheck),
      where('status', '==', 'pending')
    );
    
    try {
      const existingInvitesSnapshot = await getDocs(existingInvitesQuery);
      if (!existingInvitesSnapshot.empty) {
        const existingEmails = existingInvitesSnapshot.docs.map(doc => doc.data().email);
        return NextResponse.json({
          error: `Some emails already have pending invitations: ${existingEmails.join(', ')}`,
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Error checking existing invites:', error);
    }
    
    // Create invites
    const createdInvites = [];
    const emailPromises = [];
    
    for (const invite of invites) {
      if (!invite.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email)) {
        continue; // Skip invalid emails
      }
      
      // Generate unique invitation code
      const code = nanoid();
      
      // Set expiration date (default: 7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Create invite document
      const inviteData = {
        email: invite.email.toLowerCase(),
        name: invite.name || '',
        phone: invite.phone || '',
        managerId: invite.managerId || null,
        managerEmail: invite.managerEmail || null,
        role: invite.role,
        permissions: invite.permissions || {
          submitter: true,
          approver: { isApprover: false, levels: [] },
          viewer: true,
        },
        organizationId,
        approvalGroupId,
        status: 'pending',
        code,
        createdAt: serverTimestamp(),
        expiresAt,
        createdBy: userIdForQuery,
      };
      
      const inviteRef = await addDoc(collection(db, 'invites'), inviteData);
      createdInvites.push({ id: inviteRef.id, ...inviteData });
      
      // Send invitation email
      const emailPromise = sendInviteEmail({
        to: invite.email,
        inviteCode: code,
        recipientName: invite.name || '',
        senderName,
        organizationName,
        role: invite.role,
      });
      
      emailPromises.push(emailPromise);
      console.log(`Invitation created for ${invite.email} with code ${code}`);
    }
    
    // Wait for all emails to be sent
    const emailResults = await Promise.allSettled(emailPromises);
    const successfulEmails = emailResults.filter(result => result.status === 'fulfilled' && result.value?.success).length;
    const failedEmails = emailResults.filter(result => result.status === 'rejected' || !result.value?.success).length;
    
    // Update organization's license usage
    await updateDoc(doc(db, 'organizations', organizationId), {
      'licenses.admin.used': orgData.licenses.admin.used + neededLicenses.admin,
      'licenses.user.used': orgData.licenses.user.used + neededLicenses.user,
      updatedAt: serverTimestamp(),
    });
    
    return NextResponse.json({
      success: true,
      sentCount: createdInvites.length,
      emailsSent: successfulEmails,
      emailsFailed: failedEmails,
      invites: createdInvites.map(invite => ({
        email: invite.email,
        code: invite.code,
        expiresAt: invite.expiresAt,
      })),
    });
  } catch (error) {
    console.error('Error creating invitations:', error);
    return NextResponse.json(
      { error: 'Failed to create invitations', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; 