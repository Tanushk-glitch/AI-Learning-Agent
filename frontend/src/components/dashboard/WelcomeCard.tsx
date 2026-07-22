import { ArrowRight, BookOpenCheck } from "lucide-react";
import { Link } from "react-router-dom";

type WelcomeCardProps = {
  learnerName: string | null;
  learningGoal: string | null;
  subject: string | null;
};

export function WelcomeCard({
  learnerName,
  learningGoal,
  subject,
}: WelcomeCardProps) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md bg-slate-900 text-white">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Welcome{learnerName ? `, ${learnerName}` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
            Your learning dashboard
          </h1>
          {learningGoal ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {learningGoal}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/learning-plan"
          >
            Learning Plan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            to="/progress"
          >
            Progress
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
      {subject ? (
        <div className="mt-5 inline-flex rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
          Subject: {subject}
        </div>
      ) : null}
    </section>
  );
}
