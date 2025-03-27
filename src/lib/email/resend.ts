import { Resend } from 'resend';

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

// Set your from address for emails
const DEFAULT_FROM_EMAIL = process.env.EMAIL_FROM || 'invites@simplereimbursement.com';

export interface SendInviteEmailParams {
  to: string;
  inviteCode: string;
  recipientName: string;
  senderName: string;
  organizationName: string;
  role: string;
}

/**
 * Sends an invitation email to a new user
 */
export async function sendInviteEmail({
  to,
  inviteCode,
  recipientName,
  senderName,
  organizationName,
  role,
}: SendInviteEmailParams) {
  try {
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${inviteCode}`;
    
    // Format role for display
    const formattedRole = role === 'org_admin' ? 'Admin' : role === 'approver' ? 'Approver' : 'User';
    
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [to],
      subject: `Invitation to join ${organizationName} on SimpleReimbursement`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've been invited to SimpleReimbursement</h2>
          <p>Hello ${recipientName || 'there'},</p>
          <p>${senderName} has invited you to join <strong>${organizationName}</strong> on SimpleReimbursement as a <strong>${formattedRole}</strong>.</p>
          <div style="margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="margin-bottom: 30px;">${inviteUrl}</p>
          <p style="color: #6b7280; font-size: 14px;">This invitation will expire in 7 days.</p>
        </div>
      `,
    });
    
    if (error) {
      console.error('Error sending invite email:', error);
      throw new Error(`Failed to send invite email: ${error.message}`);
    }
    
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending invite email:', error);
    return { success: false, error };
  }
} 