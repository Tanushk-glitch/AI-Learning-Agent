import { BellRing } from "lucide-react";

type NudgeCardProps = {
  message: string | null;
  recommendedAction: string | null;
  urgency: string | null;
};

export function NudgeCard({ message, recommendedAction, urgency }: NudgeCardProps) {
  if (!message && !recommendedAction && !urgency) {
    return null;
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-50 text-violet-700">
          <BellRing className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-950">Daily Nudge</h2>
          {urgency ? (
            <p className="text-xs font-semibold uppercase text-slate-500">
              {urgency} priority
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-3">
        {message ? (
          <p className="text-sm leading-6 text-slate-700">{message}</p>
        ) : null}
        {recommendedAction ? (
          <div className="rounded-md bg-slate-900 p-4 text-sm font-semibold leading-6 text-white">
            Next action: {recommendedAction}
          </div>
        ) : null}
      </div>
    </section>
  );
}
