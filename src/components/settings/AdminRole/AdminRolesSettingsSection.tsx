import React from "react";
import SectionCard from "../../../shared/layout/SectionCard";
import Button from "../../../shared/inputs/Button";

type PermissionKey =
  | "usersRead"
  | "usersSearch"
  | "usersExport"
  | "content"
  | "academy"
  | "analytics"
  | "notifications"
  | "legal"
  | "billing"
  | "admins";

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Record<PermissionKey, boolean>;
};

const PERMISSION_LABELS: Record<PermissionKey, string> = {
  usersRead: "View user profiles (scoped)",
  usersSearch: "Search users (required query)",
  usersExport: "Export/bulk download users (super only)",
  content: "Manage content library",
  academy: "Manage academy content & surveys",
  analytics: "View analytics & reports",
  notifications: "Manage notification configuration",
  legal: "Manage localization & legal docs",
  billing: "Manage plans & pricing",
  admins: "Manage admin roles & security",
};

const AdminRolesSettingsSection: React.FC = () => {
  const [roles, setRoles] = React.useState<Role[]>([
    {
      id: "super",
      name: "Super Admin",
      description: "Full access to all features and settings.",
      permissions: {
        usersRead: true,
        usersSearch: true,
        usersExport: true,
        content: true,
        academy: true,
        analytics: true,
        notifications: true,
        legal: true,
        billing: true,
        admins: true,
      },
    },
    {
      id: "content-manager",
      name: "Content Manager",
      description: "Can create and manage content and academy content/surveys.",
      permissions: {
        usersRead: false,
        usersSearch: false,
        usersExport: false,
        content: true,
        academy: true,
        analytics: true,
        notifications: false,
        legal: false,
        billing: false,
        admins: false,
      },
    },
    {
      id: "support",
      name: "Support Agent",
      description: "Can help users via search and view limited profile details (no bulk access).",
      permissions: {
        usersRead: true,
        usersSearch: true,
        usersExport: false, // critical
        content: false,
        academy: false,
        analytics: true,
        notifications: false,
        legal: false,
        billing: false,
        admins: false,
      },
    },
  ]);

  const togglePermission = (roleId: string, key: PermissionKey) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: { ...role.permissions, [key]: !role.permissions[key] },
            }
          : role
      )
    );
  };

  const handleSave = () => {
    console.log("Admin roles & permissions", roles);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Admin Roles & Permissions"
        subtitle="Control what each admin role is allowed to do."
        className="bg-[#04130d]"
      >
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
          <p className="text-xs text-amber-100 md:text-sm">
            Settings should be accessible to <span className="font-semibold">Super Admin</span> only.
            Backend enforcement is required; this UI reflects intended access.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="md:max-w-xs">
                  <h3 className="text-sm font-semibold text-slate-100 md:text-base">{role.name}</h3>
                  <p className="mt-1 text-xs text-slate-400 md:text-sm">{role.description}</p>
                </div>

                <div className="grid flex-1 gap-3 text-xs sm:grid-cols-2 md:text-sm">
                  {(Object.keys(PERMISSION_LABELS) as PermissionKey[]).map((key) => (
                    <label key={key} className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={role.permissions[key]}
                        onChange={() => togglePermission(role.id, key)}
                        className="mt-0.5 h-4 w-4 rounded border border-white/20 bg-black/40"
                      />
                      <span className="text-slate-200">{PERMISSION_LABELS[key]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {role.id !== "super" && role.permissions.usersExport && (
                <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs text-rose-100">
                  Export should be restricted to Super Admin only.
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Prevent bulk scraping / database exfiltration"
        subtitle="Operational + backend controls to stop agents from downloading the customer database."
        className="bg-[#04130d]"
      >
        <ul className="space-y-2 text-xs text-slate-200 md:text-sm">
          <li>• Remove or lock down any “export” endpoints; allow only for Super Admin with MFA + audit log.</li>
          <li>• Require search terms (min length) for user lookup; block “list all users” for support roles.</li>
          <li>• Rate limit + anomaly detection (burst + daily caps), plus per-admin IP/device tracking.</li>
          <li>• Field-level redaction for support (hide sensitive PII unless explicitly needed).</li>
          <li>• Audit logging: record who accessed which user and when; alert on unusual patterns.</li>
          <li>• Watermarking on screens/reports, and disable bulk copy where possible (still enforce server-side).</li>
        </ul>

        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-400">
          UI can discourage scraping, but real protection must be enforced server-side (RBAC + query constraints + rate limits).
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminRolesSettingsSection;
