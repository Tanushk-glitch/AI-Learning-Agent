import { RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

import { useSession } from "@/context/SessionContext";

export function SidebarFooter() {
  const { state } = useSession();
  const goal =
    state.intent?.learning_goal ?? state.learningPlan?.learning_goal ?? null;
  const progress = state.progress?.overall_completion_percentage ?? 0;
  const targetDate =
    state.intent?.target_deadline ?? state.learningPlan?.target_deadline ?? null;

  return (
    <footer className="mt-auto border-t border-white/[0.08] p-4">
      <div className="rounded-[20px] border border-white/[0.08] bg-[#1A2235] p-4 shadow-xl shadow-black/10">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Current Goal
        </p>
        <p className="mt-2 line-clamp-3 text-sm font-semibold leading-5 text-white">
          {goal ?? "No active roadmap"}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Target Completion
          </p>
          <p className="mt-1 text-sm font-medium text-slate-200">
            {targetDate ?? "Not set"}
          </p>
        </div>

        <Link
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-3 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-950/25 transition hover:scale-[1.01]"
          to="/onboarding"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Generate New Roadmap
        </Link>
      </div>
    </footer>
  );
}
