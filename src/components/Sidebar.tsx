// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FiGrid,
//   FiFileText,
//   FiUsers,
//   FiBarChart2,
//   FiSettings,
// } from "react-icons/fi";

// type SidebarProps = {
//   isOpen: boolean;
//   onClose: () => void;
// };

// type NavItem = {
//   label: string;
//   to: string;
//   icon: React.ComponentType<{ className?: string }>;
// };

// const navItems: NavItem[] = [
//   { label: "Dashboard", to: "/", icon: FiGrid },
//   { label: "Content Management", to: "/content", icon: FiFileText },
//   { label: "Users", to: "/users", icon: FiUsers },
//   { label: "Live Sessions", to: "/livesessions", icon: FiBarChart2 },
//   { label: "Settings", to: "/settings", icon: FiSettings },
// ];

// const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
//   return (
//     <>
//       {/* Mobile backdrop */}
//       <div
//         className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
//           isOpen ? "opacity-100" : "pointer-events-none opacity-0"
//         }`}
//         onClick={onClose}
//       />

//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#050b0a] font-bold text-slate-200 shadow-xl transition-transform duration-200 md:static md:translate-x-0 ${
//           isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         }`}
//       >
//         {/* Brand / profile */}
//         <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4">
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 overflow-hidden">
//             <img
//               src="./public/images/Vector.png" // 👈 replace this with your real logo path
//               alt="Zonerlost logo"
//               className="h-8 w-8 object-contain"
//             />
//           </div>

//           <div>
//             <div className="text-large  font-bold">Admin Panel</div>
//             {/* <div className="text-xs text-slate-400">Admin Panel</div> */}
//           </div>
//         </div>

//         {/* Nav items */}
//         <nav className="mt-4 flex-1 space-y-1 px-3">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 end={item.to === "/admin"}
//                 className={({ isActive }) =>
//                   [
//                     "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
//                     isActive
//                       ? "bg-emerald-600 text-white"
//                       : "text-slate-300 hover:bg-white/5",
//                   ].join(" ")
//                 }
//                 onClick={onClose}
//               >
//                 <Icon className="h-5 w-5" />
//                 <span>{item.label}</span>
//               </NavLink>
//             );
//           })}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

// src/shared/navigation/Sidebar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiFileText,
  FiUsers,
  FiBarChart2,
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
  { label: "Content Management", to: "/content", icon: FiFileText },
  { label: "Users", to: "/users", icon: FiUsers },
  { label: "Live Sessions", to: "/livesessions", icon: FiBarChart2 },
  { label: "Settings", to: "/settings", icon: FiSettings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const handleConfirmLogout = () => {
    logout();             // clear auth + storage
    setIsLogoutOpen(false);
    onClose();            // close sidebar on mobile
    navigate("/login", { replace: true });
  };

  const handleCancelLogout = () => {
    setIsLogoutOpen(false);
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#000000] font-bold text-slate-200 shadow-xl transition-transform duration-200 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 overflow-hidden">
            <img
              src="/public/images/Vector.png" 
              alt="GDS Sport logo"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div>
            <div className="text-base font-bold">Admin Panel</div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="mt-4 flex-1 space-y-1 px-3">
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
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="border-t border-white/5 px-3 py-3">
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
