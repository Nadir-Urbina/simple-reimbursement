import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    // Query for the invitation with this code
    const invitesRef = collection(db, 'invites');
    const q = query(invitesRef, where('code', '==', code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const inviteDoc = querySnapshot.docs[0];
    const invite = inviteDoc.data();

    // Check if invitation has expired
    const now = new Date();
    const expiresAt = invite.expiresAt.toDate();
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    if (invite.status !== 'pending') {
      return NextResponse.json(
        { error: 'Invitation has already been used' },
        { status: 410 }
      );
    }

    // Get organization name for display
    const orgDoc = await getDoc(doc(db, 'organizations', invite.organizationId));
    if (!orgDoc.exists()) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    const organization = orgDoc.data();

    return NextResponse.json({
      id: inviteDoc.id,
      email: invite.email,
      role: invite.role,
      organizationId: invite.organizationId,
      organizationName: organization.name,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error validating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to validate invitation' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; 