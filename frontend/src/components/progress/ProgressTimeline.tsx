import { CheckCircle2, Circle, Clock3 } from "lucide-react";

export type ProgressTimelineEntry = {
  label: string;
  status: "completed" | "current" | "upcoming";
};

type ProgressTimelineProps = {
  entries: ProgressTimelineEntry[];
};

export function ProgressTimeline({ entries }: ProgressTimelineProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-slate-500">Timeline</p>
        <h2 className="mt-1 text-xl font-bold tracking-normal text-slate-950">
          Progress Timeline
        </h2>
      </div>
      <div className="mt-5 space-y-3">
        {entries.map((entry) => (
          <div
            className="flex items-start gap-3 rounded-md bg-slate-50 p-3"
            key={`${entry.status}-${entry.label}`}
          >
            <TimelineIcon status={entry.status} />
            <p className="text-sm font-medium leading-6 text-slate-700">
              {entry.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

type TimelineIconProps = {
  status: ProgressTimelineEntry["status"];
};

function TimelineIcon({ status }: TimelineIconProps) {
  if (status === "completed") {
    return (
      <CheckCircle2
        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
        aria-hidden="true"
      />
    );
  }

  if (status === "current") {
    return (
      <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
    );
  }

  return (
    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
  );
}
