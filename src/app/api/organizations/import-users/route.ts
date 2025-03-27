import { NextResponse } from "next/server";
import { parse } from "papaparse";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { customAlphabet } from "nanoid";
import { Readable } from "stream";

// Generate invite codes
const nanoid = customAlphabet("ABCDEFGHIJKLMNPQRSTUVWXYZ123456789", 8);

export async function POST(req: Request) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const organizationId = userData.organizationId;

    // Get organization details for license checks
    const orgDoc = await getDoc(doc(db, "organizations", organizationId));
    if (!orgDoc.exists()) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const orgData = orgDoc.data();

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (fileType !== "csv" && fileType !== "xlsx" && fileType !== "xls") {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a CSV or Excel file." },
        { status: 400 }
      );
    }

    // For now we only handle CSV files
    // For Excel files in production, you would use a library like xlsx
    if (fileType !== "csv") {
      return NextResponse.json(
        { error: "Only CSV files are supported at this time." },
        { status: 400 }
      );
    }

    // Read the file
    const text = await file.text();

    // Parse CSV
    const result = parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    });

    if (result.errors.length > 0) {
      return NextResponse.json(
        { error: `CSV parsing error: ${result.errors[0].message}` },
        { status: 400 }
      );
    }

    const users = result.data as Array<any>;

    // Validate the data
    const validationErrors: string[] = [];
    users.forEach((user, index) => {
      if (!user.name || !user.email) {
        validationErrors.push(`Row ${index + 1}: Missing name or email`);
      }
      if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        validationErrors.push(`Row ${index + 1}: Invalid email format`);
      }
      if (user.role && !["user", "approver", "org_admin"].includes(user.role.toLowerCase())) {
        validationErrors.push(
          `Row ${index + 1}: Invalid role. Must be 'user', 'approver', or 'org_admin'`
        );
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation errors", details: validationErrors },
        { status: 400 }
      );
    }

    // Check license limits
    const adminCount = users.filter(
      (u) => u.role && u.role.toLowerCase() === "org_admin"
    ).length;
    const userCount = users.length - adminCount;

    const availableLicenses = {
      admin: orgData.licenses.admin.total - orgData.licenses.admin.used,
      user: orgData.licenses.user.total - orgData.licenses.user.used,
    };

    if (adminCount > availableLicenses.admin) {
      return NextResponse.json(
        {
          error: `Not enough admin licenses available (needed: ${adminCount}, available: ${availableLicenses.admin})`,
        },
        { status: 400 }
      );
    }

    if (userCount > availableLicenses.user) {
      return NextResponse.json(
        {
          error: `Not enough user licenses available (needed: ${userCount}, available: ${availableLicenses.user})`,
        },
        { status: 400 }
      );
    }

    // Check for existing emails
    const emailsToCheck = users.map((u) => u.email.toLowerCase());
    
    // Check for existing invites
    const invitesRef = collection(db, "invites");
    const existingInvitesQuery = query(
      invitesRef,
      where("email", "in", emailsToCheck),
      where("status", "==", "pending")
    );
    
    const existingInvitesSnapshot = await getDocs(existingInvitesQuery);
    const existingEmails = existingInvitesSnapshot.docs.map(doc => doc.data().email);
    
    if (existingEmails.length > 0) {
      return NextResponse.json({
        error: `Some emails already have pending invitations: ${existingEmails.join(", ")}`,
      }, { status: 400 });
    }

    // Create invites
    const invites = [];
    
    for (const userData of users) {
      const email = userData.email.toLowerCase();
      const name = userData.name.trim();
      const role = (userData.role || "user").toLowerCase() as "user" | "approver" | "org_admin";
      
      // Generate unique invitation code
      const code = nanoid();
      
      // Set expiration date (7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Set permissions based on role
      const permissions = role === "org_admin" 
        ? {
            admin: true,
            approver: { isApprover: true, levels: [1, 2, 3, 4, 5] },
            submitter: true,
            viewer: true,
          }
        : role === "approver"
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
          };
      
      // Create invite document
      const inviteData = {
        email,
        name,
        role,
        permissions,
        organizationId,
        approvalGroupId: "default",
        status: "pending",
        code,
        createdAt: serverTimestamp(),
        expiresAt,
        createdBy: user.uid,
      };
      
      const inviteRef = await addDoc(collection(db, "invites"), inviteData);
      invites.push({ id: inviteRef.id, ...inviteData });
      
      // TODO: Send invitation email
      console.log(`Invitation created for ${email} with code ${code}`);
    }
    
    // Update organization's license usage
    await doc(db, "organizations", organizationId).update({
      "licenses.admin.used": orgData.licenses.admin.used + adminCount,
      "licenses.user.used": orgData.licenses.user.used + userCount,
      updatedAt: serverTimestamp(),
    });

    // Return success
    return NextResponse.json({
      success: true,
      importedCount: users.length,
      invites: invites.map(invite => ({
        email: invite.email,
        role: invite.role,
        code: invite.code,
      })),
    });
  } catch (error) {
    console.error("Error importing users:", error);
    return NextResponse.json(
      { error: "Failed to import users", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs"; 