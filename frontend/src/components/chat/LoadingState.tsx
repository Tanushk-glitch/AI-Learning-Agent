import { LoaderCircle } from "lucide-react";

export function LoadingState() {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 text-slate-700">
        <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            Generating your learning plan...
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            The AI Learning Agent is reading your goal and building a roadmap.
          </p>
        </div>
      </div>
    </section>
  );
}
