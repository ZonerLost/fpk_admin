// export type UserRole = "Registered" | "Unregistered";

// /**
//  * "None" is important for Unregistered users.
//  * This resolves the client question:
//  * "In Pro column, how can we have data if they are unregistered?"
//  */
// export type ProStatus = "Active" | "Inactive" | "None";

// export interface UserItem {
//   id: string;          // internal id
//   userId: string;      // "USR-8421"
//   name: string;
//   email?: string;
//   phone?: string;

//   /**
//    * Ideally from App Store / Play Store country where app was downloaded.
//    * Backend should own this field.
//    */
//   country: string;

//   role: UserRole;

//   xpPoints: number;
//   lastActive: string;  // "2 hours ago"

//   /** Renamed from "subscription" conceptually; still a field for UI state */
//   proStatus: ProStatus;

//   avatarUrl?: string;
// }


export type UserRole = "Registered" | "Unregistered";

/**
 * Pro status:
 * - Active: current paying user
 * - Lapsed: previously pro, now expired
 * - None: never pro / free
 */
export type ProStatus = "Active" | "Inactive" | "Lapsed" | "None";

export interface UserItem {
  id: string;     // internal id
  userId: string; // "USR-8421"

  name: string;
  email?: string;
  phone?: string;

  country: string;
  language: string;

  role: UserRole;

  xpPoints: number;
  lastActive: string; // UI-friendly string (ideally backend gives timestamps)

  proStatus: ProStatus;

  avatarUrl?: string;
}
