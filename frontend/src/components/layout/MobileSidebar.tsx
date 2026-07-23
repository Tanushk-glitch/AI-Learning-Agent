import { Menu, X } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function MobileSidebar({ isOpen, onClose, onOpen }: MobileSidebarProps) {
  return (
    <>
      <button
        aria-label="Open workspace navigation"
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#111827] text-white shadow-lg shadow-black/30 transition hover:bg-[#1A2235] lg:hidden"
        onClick={onOpen}
        type="button"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close workspace navigation"
            className="absolute inset-0 bg-slate-950/70"
            onClick={onClose}
            type="button"
          />
          <div className="relative h-full w-[min(86vw,260px)]">
            <Sidebar onNavigate={onClose} />
            <button
              aria-label="Close workspace navigation"
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
