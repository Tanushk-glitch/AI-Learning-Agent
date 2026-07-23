import { Clock } from "lucide-react";

import { MilestoneCard } from "@/components/learning-plan/MilestoneCard";
import { PhaseProgress } from "@/components/learning-plan/PhaseProgress";
import { ResourceList } from "@/components/learning-plan/ResourceList";
import { TopicChecklist } from "@/components/learning-plan/TopicChecklist";
import type { YouTubeVideo } from "@/services/youtubeService";
import type { LearningPhase } from "@/types/learning";
import { getTopicKey } from "@/utils/learningPlan";

type PhaseCardProps = {
  completedTopics: Record<string, boolean>;
  loadingTopics: Record<string, boolean>;
  onToggleTopic: (phaseNumber: number, topic: string, completed: boolean) => void;
  phase: LearningPhase;
  videos: Record<string, YouTubeVideo | null>;
};

export function PhaseCard({
  completedTopics,
  loadingTopics,
  onToggleTopic,
  phase,
  videos,
}: PhaseCardProps) {
  const completedTopicCount = phase.recommended_topics.filter(
    (topic) => completedTopics[getTopicKey(phase.phase_number, topic)]
  ).length;

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

      <div className="mt-5">
        <PhaseProgress
          completedCount={completedTopicCount}
          totalCount={phase.recommended_topics.length}
        />
      </div>

      <TopicChecklist
        completedTopics={completedTopics}
        loadingTopics={loadingTopics}
        onToggleTopic={onToggleTopic}
        phaseDuration={phase.estimated_duration}
        phaseNumber={phase.phase_number}
        topics={phase.recommended_topics}
        videos={videos}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <MilestoneCard milestones={phase.milestones} />
        <ResourceList resources={phase.suggested_resource_categories} />
      </div>
    </article>
  );
}
