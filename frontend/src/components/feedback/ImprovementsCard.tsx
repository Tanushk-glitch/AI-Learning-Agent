import { Target } from "lucide-react";

type ImprovementsCardProps = {
  improvements: string[];
};

export function ImprovementsCard({ improvements }: ImprovementsCardProps) {
  if (improvements.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 text-amber-700">
          <Target className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-base font-semibold text-slate-950">
          Areas for Improvement
        </h2>
      </div>
      <ul className="space-y-3">
        {improvements.map((improvement) => (
          <li className="flex gap-3 text-sm leading-6 text-slate-700" key={improvement}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            <span>{improvement}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
