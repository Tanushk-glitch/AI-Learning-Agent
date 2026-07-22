import { Clock, ListChecks } from "lucide-react";

import { MilestoneCard } from "@/components/learning-plan/MilestoneCard";
import { ResourceList } from "@/components/learning-plan/ResourceList";
import type { LearningPhase } from "@/types/learning";

type PhaseCardProps = {
  phase: LearningPhase;
};

export function PhaseCard({ phase }: PhaseCardProps) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Phase {phase.phase_number}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">
            {phase.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {phase.objective}
          </p>
        </div>
        {phase.estimated_duration ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {phase.estimated_duration}
          </span>
        ) : null}
      </div>

      {phase.recommended_topics.length > 0 ? (
        <div className="mt-5 rounded-md bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-slate-950">Topics</h4>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {phase.recommended_topics.map((topic) => (
              <div
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                key={topic}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <MilestoneCard milestones={phase.milestones} />
        <ResourceList resources={phase.suggested_resource_categories} />
      </div>
    </article>
  );
}
