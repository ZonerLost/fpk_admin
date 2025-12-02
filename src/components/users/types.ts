export type UserRole = "Pro" | "Basic" | "Unregistered";
export type SubscriptionStatus = "Active" | "Inactive";

export interface UserItem {
  id: string;          // internal id
  userId: string;      // "USR-8421"
  name: string;
  email?: string;
  phone?: string;
  country: string;
  role: UserRole;
  xpPoints: number;
  lastActive: string;  // "2 hours ago"
  subscription: SubscriptionStatus;
  avatarUrl?: string;
}
