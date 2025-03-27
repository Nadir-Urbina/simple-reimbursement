export type UserRole = 'super_admin' | 'org_admin' | 'approver' | 'user';

export interface Organization {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  subscriptionStatus: 'active' | 'past_due' | 'canceled';
  licenses: {
    admin: {
      total: number;
      used: number;
      pricePerSeat: number;
    };
    user: {
      total: number;
      used: number;
      pricePerSeat: number;
    };
  };
  settings: {
    autoApprovalLimit?: number;
    requireManagerApproval?: boolean;
    allowedExpenseCategories: string[];
    defaultCurrency: string;
  };
}

export interface OrganizationUser {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  role: UserRole;
  inviteStatus: 'pending' | 'accepted';
  createdAt: Date;
  updatedAt: Date;
  settings?: {
    notificationPreferences: {
      email: boolean;
      inApp: boolean;
    };
    defaultCurrency?: string;
  };
  metadata?: {
    department?: string;
    employeeId?: string;
    managerEmail?: string;
  };
}

export interface OrganizationInvite {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  metadata?: {
    department?: string;
    employeeId?: string;
    managerEmail?: string;
  };
} 