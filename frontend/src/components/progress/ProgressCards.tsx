import { CheckCircle2, CircleDashed, Flag, TimerReset } from "lucide-react";
import type { ReactNode } from "react";

type ProgressCardsProps = {
  completedMilestonesCount: number;
  completionPercentage: number;
  currentPhase: number;
  remainingMilestonesCount: number | null;
  estimatedTimeRemaining: string | null;
};

export function ProgressCards({
  completedMilestonesCount,
  completionPercentage,
  currentPhase,
  remainingMilestonesCount,
  estimatedTimeRemaining,
}: ProgressCardsProps) {
  const cards = [
    {
      label: "Completion",
      value: `${completionPercentage}%`,
      icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
    },
    {
      label: "Current Phase",
      value: `Phase ${currentPhase}`,
      icon: <Flag className="h-5 w-5" aria-hidden="true" />,
    },
    {
      label: "Completed Milestones",
      value:
        completedMilestonesCount > 0 ? String(completedMilestonesCount) : null,
      icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
    },
    {
      label: "Remaining Milestones",
      value:
        remainingMilestonesCount !== null
          ? String(remainingMilestonesCount)
          : null,
      icon: <CircleDashed className="h-5 w-5" aria-hidden="true" />,
    },
    {
      label: "Estimated Time Remaining",
      value: estimatedTimeRemaining,
      icon: <TimerReset className="h-5 w-5" aria-hidden="true" />,
    },
  ].filter((card) => card.value);

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <ProgressMetricCard
          icon={card.icon}
          key={card.label}
          label={card.label}
          value={card.value}
        />
      ))}
    </section>
  );
}

type ProgressMetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string | null;
};

function ProgressMetricCard({ icon, label, value }: ProgressMetricCardProps) {
  if (!value) {
    return null;
  }

  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700">
        {icon}
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-950">{value}</p>
    </article>
  );
}
