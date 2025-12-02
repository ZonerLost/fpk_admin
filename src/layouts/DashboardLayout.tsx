import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from ".././components/Sidebar";
import Topbar from "../shared/navigation/Topbar";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050809] text-slate-100">
      {/* Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Mobile sidebar (slide-over) */}
      <div className="md:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#050C10]">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
