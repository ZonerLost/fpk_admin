import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  // FiFileText,
  FiUsers,
  FiBarChart2,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from ".././context/AuthContext";
import ConfirmDialog from "../shared/overlay/ConfirmDialog";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: FiGrid },
  // { label: "Content Management", to: "/content", icon: FiFileText },
  { label: "Users", to: "/users", icon: FiUsers },
  { label: "Academy Sessions", to: "/academysessions", icon: FiBarChart2 },
  { label: "Surveys & Feedback", to: "/surveys-feedback", icon: FiMessageSquare },
  { label: "Settings", to: "/settings", icon: FiSettings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);

  const handleLogoutClick = () => {
    onClose(); // close sidebar first (especially on mobile)
    setTimeout(() => setIsLogoutOpen(true), 0);
  };

  const handleConfirmLogout = () => {
    logout(); // clear auth + storage
    setIsLogoutOpen(false);
    onClose(); // close sidebar on mobile
    navigate("/login", { replace: true });
  };

  const handleCancelLogout = () => {
    setIsLogoutOpen(false);
  };

  // Close sidebar only on mobile when clicking a nav item
  const handleNavClick = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      onClose();
    }
  };

  return (
    <>
      {/* Logout confirmation dialog */}
      <ConfirmDialog
        isOpen={isLogoutOpen}
        title="Log out?"
        description="Are you sure you want to log out of the GDS Sport admin console?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col bg-[#000000] font-bold text-slate-200 shadow-xl transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black/40">
            <img
              src="/images/logo.png"
              alt="GDS Sport logo"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div>
            <div className="text-base font-bold">Admin Panel</div>
          </div>
        </div>

        {/* Nav items (scrollable inside sidebar if long) */}
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-300 hover:bg-white/5",
                  ].join(" ")
                }
                onClick={handleNavClick}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="mt-auto border-t border-white/5 px-3 py-3">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-3 rounded-xl border border-black-500/40 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
          >
            <FiLogOut className="h-5 w-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
