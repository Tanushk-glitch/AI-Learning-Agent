import { CheckCircle2 } from "lucide-react";

import { EmptyPlan } from "@/components/learning-plan/EmptyPlan";
import { PhaseTimeline } from "@/components/learning-plan/PhaseTimeline";
import { PlanHeader } from "@/components/learning-plan/PlanHeader";
import { useSession } from "@/context/SessionContext";

export function LearningPlanPage() {
  const { state } = useSession();
  const plan = state.learningPlan;

  if (!plan) {
    return <EmptyPlan />;
  }

  return (
    <div className="space-y-6">
      <PlanHeader plan={plan} />

      {plan.final_milestone ? (
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Final Milestone
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {plan.final_milestone}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <PhaseTimeline phases={plan.phases} />
    </div>
  );
}
