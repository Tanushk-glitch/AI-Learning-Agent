import { EmptyProgress } from "@/components/progress/EmptyProgress";
import { NextActionCard } from "@/components/progress/NextActionCard";
import { ProgressCards } from "@/components/progress/ProgressCards";
import { ProgressHeader } from "@/components/progress/ProgressHeader";
import { ProgressOverview } from "@/components/progress/ProgressOverview";
import {
  ProgressTimeline,
  type ProgressTimelineEntry,
} from "@/components/progress/ProgressTimeline";
import { useSession } from "@/context/SessionContext";
import type { LearningPlan, ProgressReport } from "@/types/learning";

export function ProgressPage() {
  const { state } = useSession();
  const progress = state.progress;

  if (!progress) {
    return <EmptyProgress />;
  }

  const goal =
    state.intent?.learning_goal ?? state.learningPlan?.learning_goal ?? null;
  const subject = state.intent?.subject ?? state.learningPlan?.subject ?? null;
  const timelineEntries = buildTimelineEntries(progress, state.learningPlan);
  const remainingMilestonesCount = getRemainingMilestonesCount(
    progress,
    state.learningPlan
  );

  return (
    <div className="space-y-6">
      <ProgressHeader
        currentStage={state.currentStage}
        goal={goal}
        subject={subject}
        workflowCompleted={state.workflowCompleted}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-6">
          <ProgressOverview
            completionPercentage={progress.overall_completion_percentage}
            currentPhase={progress.current_phase}
            learnerStatus={progress.learner_status}
            summary={progress.summary}
          />
          <ProgressCards
            completedMilestonesCount={progress.completed_milestones.length}
            completionPercentage={progress.overall_completion_percentage}
            currentPhase={progress.current_phase}
            estimatedTimeRemaining={null}
            remainingMilestonesCount={remainingMilestonesCount}
          />
          <ProgressTimeline entries={timelineEntries} />
        </main>

        <aside className="space-y-6">
          <NextActionCard nextAction={progress.next_recommended_task} />
          <TopicCard
            completedTopics={progress.completed_topics}
            remainingTopics={progress.remaining_topics}
          />
        </aside>
      </div>
    </div>
  );
}

function buildTimelineEntries(
  progress: ProgressReport,
  plan: LearningPlan | null
): ProgressTimelineEntry[] {
  const completedEntries = progress.completed_topics.map((topic) => ({
    label: `Completed ${topic}`,
    status: "completed" as const,
  }));

  const currentTopic = progress.remaining_topics[0];
  const currentEntry = currentTopic
    ? [
        {
          label: `Currently studying ${currentTopic}`,
          status: "current" as const,
        },
      ]
    : [];

  const upcomingEntries = progress.remaining_topics.slice(1, 5).map((topic) => ({
    label: `Upcoming: ${topic}`,
    status: "upcoming" as const,
  }));

  if (completedEntries.length || currentEntry.length || upcomingEntries.length) {
    return [...completedEntries, ...currentEntry, ...upcomingEntries];
  }

  if (!plan) {
    return [];
  }

  return plan.phases
    .filter((phase) => phase.phase_number >= progress.current_phase)
    .slice(0, 4)
    .map((phase, index) => ({
      label:
        index === 0
          ? `Currently studying ${phase.title}`
          : `Upcoming: ${phase.title}`,
      status: index === 0 ? "current" : "upcoming",
    }));
}

function getRemainingMilestonesCount(
  progress: ProgressReport,
  plan: LearningPlan | null
) {
  if (!plan) {
    return null;
  }

  const allMilestones = plan.phases.flatMap((phase) => phase.milestones);
  const completedMilestones = new Set(
    progress.completed_milestones.map((milestone) => milestone.toLowerCase())
  );
  const remainingMilestones = allMilestones.filter(
    (milestone) => !completedMilestones.has(milestone.toLowerCase())
  );

  return remainingMilestones.length;
}

type TopicCardProps = {
  completedTopics: string[];
  remainingTopics: string[];
};

function TopicCard({ completedTopics, remainingTopics }: TopicCardProps) {
  if (completedTopics.length === 0 && remainingTopics.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Topics</h2>
      {completedTopics.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Completed
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {completedTopics.map((topic) => (
              <span
                className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700"
                key={topic}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {remainingTopics.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Remaining
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {remainingTopics.slice(0, 8).map((topic) => (
              <span
                className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700"
                key={topic}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
