import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <section className="rounded-md border border-red-200 bg-red-50 p-5">
      <div className="flex gap-3">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-sm font-semibold text-red-950">
            Something went wrong
          </h2>
          <p className="mt-1 text-sm leading-6 text-red-800">{message}</p>
        </div>
      </div>
    </section>
  );
}
