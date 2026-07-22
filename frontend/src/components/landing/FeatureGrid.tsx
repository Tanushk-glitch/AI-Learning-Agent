import {
  BellRing,
  BrainCircuit,
  CalendarDays,
  ChartNoAxesCombined,
  MessageSquareText,
  Youtube,
} from "lucide-react";

import { FeatureCard } from "@/components/landing/FeatureCard";

const features = [
  {
    title: "AI Learning Planner",
    description:
      "Creates a personalized, phased roadmap around your goal, current level, schedule, and deadline.",
    icon: BrainCircuit,
    tone: "blue" as const,
  },
  {
    title: "Progress Tracking",
    description:
      "Tracks milestones, completion, remaining topics, and the next best action across your roadmap.",
    icon: ChartNoAxesCombined,
    tone: "emerald" as const,
  },
  {
    title: "Adaptive Feedback",
    description:
      "Turns your current progress into practical strengths, improvement areas, and focused study guidance.",
    icon: MessageSquareText,
    tone: "violet" as const,
  },
  {
    title: "Smart Nudges",
    description:
      "Keeps your momentum visible with timely motivation, reminders, and accountable next steps.",
    icon: BellRing,
    tone: "amber" as const,
  },
  {
    title: "YouTube Learning Resources",
    description:
      "Will recommend relevant educational videos that align with each phase of your learning plan.",
    icon: Youtube,
    tone: "rose" as const,
    comingSoon: true,
  },
  {
    title: "Google Calendar Sync",
    description:
      "Will turn roadmap milestones into scheduled study sessions and helpful reminders.",
    icon: CalendarDays,
    tone: "cyan" as const,
    comingSoon: true,
  },
];

export function FeatureGrid() {
  return (
    <section
      className="scroll-mt-20 border-b border-slate-200 bg-slate-50 py-20 sm:py-24"
      id="features"
    >
      <div className="mx-auto w-[min(100%-2rem,1180px)]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-blue-700">
            One companion, complete support
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
            Everything you need to keep learning forward
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Saarthi.AI connects planning, progress, coaching, and accountability
            into one clear learning experience.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
