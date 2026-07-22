import { ArrowLeft, ArrowRight, CalendarDays, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { LearningPlan } from "@/types/learning";

type PlanHeaderProps = {
  plan: LearningPlan;
};

export function PlanHeader({ plan }: PlanHeaderProps) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md bg-slate-900 text-white">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-slate-500">Learning Plan</p>
          <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
            {plan.learning_goal}
          </h1>
          {plan.overview ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {plan.overview}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            to="/dashboard"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/progress"
          >
            Continue to Progress
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PlanMeta label="Subject" value={plan.subject} />
        <PlanMeta label="Skill Level" value={plan.learner_level} />
        <PlanMeta label="Target Timeline" value={plan.target_deadline} />
        <PlanMeta
          icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
          label="Estimated Duration"
          value={plan.total_available_time}
        />
      </div>
    </section>
  );
}

type PlanMetaProps = {
  icon?: ReactNode;
  label: string;
  value: string | null;
};

function PlanMeta({ icon, label, value }: PlanMetaProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
