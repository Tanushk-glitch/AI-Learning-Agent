import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { cn } from "@/utils/cn";

type SidebarItemProps = {
  activePath?: string;
  end?: boolean;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  to: string;
};

export function SidebarItem({
  activePath,
  end = false,
  icon: Icon,
  label,
  onClick,
  to,
}: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === (activePath ?? to);

  return (
    <NavLink
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-950/30"
          : "text-slate-300 hover:bg-white/8 hover:text-white hover:translate-x-0.5"
      )}
      end={end}
      onClick={onClick}
      to={to}
    >
      <Icon
        className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
        aria-hidden="true"
      />
      <span>{label}</span>
    </NavLink>
  );
}
