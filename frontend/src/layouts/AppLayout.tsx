import {
  BookOpen,
  FlaskConical,
  LayoutDashboard,
  MessageSquare,
  MessagesSquare,
  TrendingUp,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { cn } from "@/utils/cn";

const navigationItems = [
  { label: "Home", to: "/", icon: BookOpen },
  { label: "Chat", to: "/chat", icon: MessageSquare },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Learning Plan", to: "/learning-plan", icon: BookOpen },
  { label: "Progress", to: "/progress", icon: TrendingUp },
  { label: "Feedback", to: "/feedback", icon: MessagesSquare },
  { label: "API Test", to: "/api-test", icon: FlaskConical },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="app-container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">AI Learning Agent</p>
            <h1 className="text-xl font-semibold text-slate-950">Learning Workspace</h1>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    )
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="app-container py-10">
        <Outlet />
      </main>
    </div>
  );
}
