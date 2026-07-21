import { CheckCircle2 } from "lucide-react";

type StrengthsCardProps = {
  strengths: string[];
};

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  if (strengths.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-base font-semibold text-slate-950">Strengths</h2>
      </div>
      <ul className="space-y-3">
        {strengths.map((strength) => (
          <li className="flex gap-3 text-sm leading-6 text-slate-700" key={strength}>
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
            <span>{strength}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
