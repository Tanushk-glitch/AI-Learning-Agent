import { ListChecks } from "lucide-react";

type RecommendationsCardProps = {
  recommendations: string[];
};

export function RecommendationsCard({
  recommendations,
}: RecommendationsCardProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
          <ListChecks className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-base font-semibold text-slate-950">
          Recommendations
        </h2>
      </div>
      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <p
            className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700"
            key={recommendation}
          >
            {recommendation}
          </p>
        ))}
      </div>
    </section>
  );
}
