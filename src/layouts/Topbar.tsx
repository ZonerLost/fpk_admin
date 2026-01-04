import React from "react";
import { FiMenu } from "react-icons/fi";
import { useLocation } from "react-router-dom";

type TopbarProps = {
  onOpenSidebar: () => void;
};

const routeTitleMap: Record<string, string> = {
  // "/": "Dashboard Overview",
  // "/content": "Content Management",
  // "/users": "Users",
  // "/livesessions": "Live Sessions",
  // "/settings": "Settings",
};

const Topbar: React.FC<TopbarProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const title = routeTitleMap[pathname] ?? "";

  return (
    <header className="flex h-16 items-center  shadow md:px-8">
      {/* Mobile menu button */}
      <button
        className="mr-3 flex items-center justify-center rounded-md border border-white/10 p-2 md:hidden"
        onClick={onOpenSidebar}
      >
        <FiMenu className="h-5 w-5 text-slate-100" />
      </button>

      {/* Title */}
      <h1 className="text-lg font-bold text-white md:text-2xl">
        {title}
      </h1>

      {/* Right side placeholder (profile, etc.) */}
      <div className="ml-auto flex items-center gap-3">
        {/* Add search, profile avatar, etc. here if you want */}
      </div>
    </header>
  );
};

export default Topbar;
