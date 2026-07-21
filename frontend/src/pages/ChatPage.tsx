import { Bot, Sparkles } from "lucide-react";
import { useState } from "react";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatResponse } from "@/components/chat/ChatResponse";
import { ErrorState } from "@/components/chat/ErrorState";
import { LoadingState } from "@/components/chat/LoadingState";
import { useStartLearningSession } from "@/hooks/useLearningApi";

const MIN_PROMPT_LENGTH = 10;

export function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const startLearningSession = useStartLearningSession();

  const response = startLearningSession.data?.data ?? null;
  const apiError = startLearningSession.error?.message ?? null;

  function handlePromptChange(value: string) {
    setPrompt(value);
    if (validationError) {
      setValidationError(null);
    }
  }

  function handleSubmit() {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setValidationError("Enter a learning goal before generating a plan.");
      return;
    }

    if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
      setValidationError(
        `Your learning goal must be at least ${MIN_PROMPT_LENGTH} characters.`
      );
      return;
    }

    setValidationError(null);
    startLearningSession.mutate({
      user_name: "Frontend Learner",
      email: null,
      prompt: trimmedPrompt,
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="text-center">
        <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm">
          <Bot className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
          Build your personalized learning plan
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Tell the AI Learning Agent what you want to learn, your timeline, and
          your current level. It will generate a structured roadmap with next
          steps, feedback, and nudges.
        </p>
      </header>

      <div className="rounded-md border border-slate-200 bg-slate-100/70 p-2 shadow-sm">
        <div className="rounded-md bg-white/70 p-3 sm:p-4">
          <ChatInput
            error={validationError}
            isSubmitting={startLearningSession.isPending}
            onChange={handlePromptChange}
            onSubmit={handleSubmit}
            value={prompt}
          />
        </div>
      </div>

      {startLearningSession.isPending ? <LoadingState /> : null}

      {apiError ? <ErrorState message={apiError} /> : null}

      {response ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Generated response
          </div>
          <ChatResponse response={response} />
        </div>
      ) : null}
    </div>
  );
}
