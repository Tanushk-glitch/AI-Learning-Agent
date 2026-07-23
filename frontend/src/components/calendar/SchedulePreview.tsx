import { X } from "lucide-react";

import { ScheduleEventCard } from "@/components/calendar/ScheduleEventCard";
import type { StudyScheduleEvent } from "@/types/calendar";

type SchedulePreviewProps = {
  events: StudyScheduleEvent[];
  isCreating: boolean;
  onCancel: () => void;
  onCreate: () => void;
};

export function SchedulePreview({
  events,
  isCreating,
  onCancel,
  onCreate,
}: SchedulePreviewProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Review Schedule</h2>
            <p className="mt-1 text-sm text-slate-600">
              {events.length} study sessions will be added to your primary calendar.
            </p>
          </div>
          <button
            aria-label="Close schedule preview"
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100"
            onClick={onCancel}
            type="button"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[60vh] space-y-3 overflow-y-auto bg-slate-50 p-5">
          {events.map((event) => (
            <ScheduleEventCard event={event} key={event.id} />
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
          <button
            className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            disabled={isCreating}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isCreating}
            onClick={onCreate}
            type="button"
          >
            {isCreating ? "Creating events..." : "Create Calendar Events"}
          </button>
        </div>
      </section>
    </div>
  );
}
