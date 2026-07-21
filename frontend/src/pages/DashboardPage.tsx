import { ArrowRight, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

import { FeedbackCard } from "@/components/dashboard/FeedbackCard";
import { NudgeCard } from "@/components/dashboard/NudgeCard";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { WorkflowStatus } from "@/components/dashboard/WorkflowStatus";
import { useSession } from "@/context/SessionContext";

export function DashboardPage() {
  const { state } = useSession();
  const hasActiveSession =
    state.intent !== null ||
    state.learningPlan !== null ||
    state.progress !== null ||
    state.feedback !== null ||
    state.nudges !== null ||
    state.currentStage !== null;

  if (!hasActiveSession) {
    return <EmptyDashboardState />;
  }

  const learningGoal =
    state.intent?.learning_goal ?? state.learningPlan?.learning_goal ?? null;
  const subject = state.intent?.subject ?? state.learningPlan?.subject ?? null;
  const currentSkillLevel =
    state.intent?.current_skill_level ?? state.learningPlan?.learner_level ?? null;
  const targetDeadline =
    state.intent?.target_deadline ?? state.learningPlan?.target_deadline ?? null;

  return (
    <div className="space-y-6">
      <WelcomeCard
        learnerName={state.user?.name ?? null}
        learningGoal={learningGoal}
        subject={subject}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <SummaryCards
            currentSkillLevel={currentSkillLevel}
            learningGoal={learningGoal}
            progressSummary={state.progress?.summary ?? null}
            subject={subject}
            targetDeadline={targetDeadline}
          />
          <div className="grid gap-6 xl:grid-cols-2">
            <FeedbackCard feedback={state.feedback} />
            <NudgeCard nudge={state.nudges} />
          </div>
        </div>

        <aside className="space-y-6">
          <WorkflowStatus
            currentStage={state.currentStage}
            workflowCompleted={state.workflowCompleted}
          />
          <NavigationCard />
        </aside>
      </div>
    </div>
  );
}

function EmptyDashboardState() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-700">
        <Inbox className="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold tracking-normal text-slate-950">
        No active learning session yet
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Generate a learning plan from the chat page, then come back here to see
        your goal, progress, feedback, and nudges in one place.
      </p>
      <Link
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        to="/chat"
      >
        Start in Chat
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
}

function NavigationCard() {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Continue</h2>
      <div className="mt-4 grid gap-3">
        <Link
          className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          to="/learning-plan"
        >
          Learning Plan
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          to="/progress"
        >
          Progress
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
