import { ListChecks } from "lucide-react";

import { TopicCard } from "@/components/learning-plan/TopicCard";
import type { YouTubeVideo } from "@/services/youtubeService";
import { getTopicKey } from "@/utils/learningPlan";

type TopicChecklistProps = {
  completedTopics: Record<string, boolean>;
  phaseDuration: string;
  phaseNumber: number;
  topics: string[];
  videos: Record<string, YouTubeVideo | null>;
  loadingTopics: Record<string, boolean>;
  onToggleTopic: (phaseNumber: number, topic: string, completed: boolean) => void;
};

export function TopicChecklist({
  completedTopics,
  loadingTopics,
  onToggleTopic,
  phaseDuration,
  phaseNumber,
  topics,
  videos,
}: TopicChecklistProps) {
  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 rounded-md bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-slate-500" aria-hidden="true" />
        <h4 className="text-sm font-semibold text-slate-950">Topics</h4>
      </div>
      <div className="grid gap-3">
        {topics.map((topic, index) => {
          const topicKey = getTopicKey(phaseNumber, topic);
          return (
            <TopicCard
              difficulty={getDifficulty(index, topics.length)}
              duration={estimateTopicDuration(phaseDuration, topics.length)}
              isCompleted={completedTopics[topicKey] ?? false}
              isVideoLoading={loadingTopics[topicKey] ?? false}
              key={topicKey}
              onToggle={(completed) =>
                onToggleTopic(phaseNumber, topic, completed)
              }
              topic={topic}
              video={videos[topicKey] ?? null}
            />
          );
        })}
      </div>
    </div>
  );
}

function getDifficulty(
  topicIndex: number,
  topicCount: number
): "Beginner" | "Intermediate" | "Advanced" {
  const progress = topicCount <= 1 ? 0 : topicIndex / (topicCount - 1);
  if (progress < 0.34) {
    return "Beginner";
  }
  if (progress < 0.67) {
    return "Intermediate";
  }
  return "Advanced";
}

function estimateTopicDuration(phaseDuration: string, topicCount: number): string {
  if (topicCount <= 1 || !phaseDuration.trim()) {
    return phaseDuration || "Self-paced";
  }

  return `${phaseDuration} phase`;
}
