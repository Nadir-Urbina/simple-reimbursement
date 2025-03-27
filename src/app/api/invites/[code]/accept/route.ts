import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: 'Name and password are required' },
        { status: 400 }
      );
    }

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

    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      invite.email,
      password
    );

    // Create the user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      id: userCredential.user.uid,
      name,
      email: invite.email,
      role: invite.role,
      organizationId: invite.organizationId,
      inviteStatus: 'accepted',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      settings: {
        notificationPreferences: {
          email: true,
          inApp: true,
        },
      },
    });

    // Update the invitation status
    await updateDoc(doc(db, 'invites', inviteDoc.id), {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      userId: userCredential.user.uid,
    });

    // Automatically sign in the user
    await signInWithEmailAndPassword(auth, invite.email, password);

    return NextResponse.json({
      success: true,
      uid: userCredential.user.uid,
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; 