import React from "react";
import { useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { cn } from "../utils/cn";

type TopbarProps = {
  onOpenSidebar: () => void;
  /** Optional: override title. If not provided, we infer from route. */
  title?: string;
  rightSlot?: React.ReactNode; // profile, notifications etc.
};

const routeTitleMap: Record<string, string> = {
  // "/": "Dashboard Overview",
  // "/content": "Content Library",
  // "/users": "Users & Subscriptions",
  // "/livesessions": "Live Sessions",
  // "/settings": "Settings",
};

const Topbar: React.FC<TopbarProps> = ({
  onOpenSidebar,
  title,
  rightSlot,
}) => {
  const { pathname } = useLocation();
  const autoTitle = routeTitleMap[pathname] ?? "";

  return (
    <header className="flex flex-col gap-3 border-b border-white/5 bg-[#050809]/80 px-3 py-3 backdrop-blur md:flex-row md:items-center md:gap-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex items-center justify-center rounded-md border border-white/10 p-2 text-slate-100 md:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        {/* Title */}
        <h1
          className={cn(
            "truncate text-lg font-extrabold text-white",
            "sm:text-xl md:text-2xl"
          )}
        >
          {title ?? autoTitle}
        </h1>
      </div>

      {/* right side (profile, filters, etc) */}
      <div className="flex flex-1 flex-wrap items-center justify-end gap-2 md:ml-auto md:justify-end md:gap-3">
        {rightSlot}
      </div>
    </header>
  );
};

export default Topbar;
