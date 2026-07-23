import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppLayout() {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (location.pathname === "/" || location.pathname === "/onboarding") {
    return <Outlet />;
  }

  return (
    <div className="workspace-shell min-h-screen bg-[#0B1220] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(124,58,237,0.14),transparent_28%)]" />
      <div className="relative flex min-h-screen">
        <div className="sticky top-0 hidden h-screen lg:block">
          <Sidebar />
        </div>
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onOpen={() => setIsMobileSidebarOpen(true)}
        />
        <main className="min-w-0 flex-1 px-4 py-16 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-4 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
