export type RegistrationStatus = "Unregistered" | "Registered";

export type AccountStatus = "Registered" | "PRO_1M" | "PRO_6M" | "PRO_12M";

export type PlanStatus = "Free" | "Pro" | "Trial";

export type SubscriptionState =
  | "None"
  | "Active"
  | "PastDue"
  | "Canceled"
  | "Trialing"
  | "Incomplete";

export type SupportAction =
  | "resend_verification"
  | "reset_password"
  | "sync_billing"
  | "grant_pro_timebound"
  | "revoke_sessions";

export type MembershipHistoryItem = {
  id: string;
  status: AccountStatus;
  subscriptionState: Exclude<SubscriptionState, "None">;
  startedAt: string; // ISO
  endedAt?: string;  // ISO
};

export type PaymentHistoryItem = {
  id: string;
  amount: number;
  currency: string;
  paidAt: string; // ISO
  status: "Paid" | "Failed" | "Refunded" | "Pending";
  providerRef?: string;
};

export type UserEvidence = {
  lastLoginAt?: string;   // ISO
  lastActiveAt?: string;  // ISO
  lastPaymentAt?: string; // ISO
  lastErrorAt?: string;   // ISO
  auditLogCount?: number;
};

export type UserItem = {
  id: string;
  userId: string;

  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;

  country: string;
  language: string;

  // ✅ Support-console fields
  registrationStatus: RegistrationStatus;
  emailVerified: boolean;

  accountStatus: AccountStatus; // used in filter + table
  planStatus: PlanStatus;
  subscriptionState: SubscriptionState;

  joinedAt: string; // ISO
  xpPoints: number;

  // for UI quick display
  lastActiveLabel: string;

  evidence: UserEvidence;

  membershipHistory?: MembershipHistoryItem[];
  paymentHistory?: PaymentHistoryItem[];
};
