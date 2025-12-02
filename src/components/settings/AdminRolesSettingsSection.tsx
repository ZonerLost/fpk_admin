import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";

type PermissionKey =
  | "content"
  | "liveSessions"
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
  content: "Manage content library",
  liveSessions: "Manage live sessions & academy",
  analytics: "View analytics & reports",
  notifications: "Send messages & push notifications",
  legal: "Manage localization & legal copy",
  billing: "Manage plans & billing settings",
  admins: "Manage admin roles & security",
};

const AdminRolesSettingsSection: React.FC = () => {
  const [roles, setRoles] = React.useState<Role[]>([
    {
      id: "super",
      name: "Super Admin",
      description: "Full access to all features and settings.",
      permissions: {
        content: true,
        liveSessions: true,
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
      description: "Can create and manage content and live sessions.",
      permissions: {
        content: true,
        liveSessions: true,
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
      description: "Can view users and respond to support issues.",
      permissions: {
        content: false,
        liveSessions: false,
        analytics: true,
        notifications: true,
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
              permissions: {
                ...role.permissions,
                [key]: !role.permissions[key],
              },
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
        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="md:max-w-xs">
                  <h3 className="text-sm font-semibold text-slate-100 md:text-base">
                    {role.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 md:text-sm">
                    {role.description}
                  </p>
                </div>

                <div className="grid flex-1 gap-3 text-xs md:grid-cols-2 md:text-sm">
                  {(Object.keys(PERMISSION_LABELS) as PermissionKey[]).map(
                    (key) => (
                      <label
                        key={key}
                        className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={role.permissions[key]}
                          onChange={() => togglePermission(role.id, key)}
                          className="mt-0.5 h-4 w-4 rounded border border-white/20 bg-black/40"
                        />
                        <span className="text-slate-200">
                          {PERMISSION_LABELS[key]}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Security Defaults"
        subtitle="Baseline security rules for all admin accounts."
        className="bg-[#04130d]"
      >
        <div className="space-y-3 text-xs text-slate-200 md:text-sm">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border border-white/20 bg-black/40"
            />
            <span>Require 2FA for all admin accounts</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border border-white/20 bg-black/40"
            />
            <span>
              Auto-log out admins after 30 minutes of inactivity
            </span>
          </label>
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminRolesSettingsSection;
