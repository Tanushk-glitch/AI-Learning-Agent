import type {
  FeedbackReport,
  LearnerIntent,
  LearningPlan,
  LearningSessionResponse,
  NudgeReport,
  ProgressReport,
  User,
} from "@/types/learning";
import type { Dispatch } from "react";

export type SessionState = {
  user: User | null;
  intent: LearnerIntent | null;
  learningPlan: LearningPlan | null;
  progress: ProgressReport | null;
  feedback: FeedbackReport | null;
  nudges: NudgeReport | null;
  workflowCompleted: boolean;
  currentStage: string | null;
  isLoading: boolean;
  error: string | null;
};

export type SessionAction =
  | { type: "SESSION_LOADING" }
  | {
      type: "SESSION_SUCCESS";
      payload: {
        workflow: LearningSessionResponse;
        user?: User | null;
      };
    }
  | { type: "SESSION_ERROR"; payload: string }
  | { type: "SESSION_RESTORE"; payload: SessionState }
  | { type: "SESSION_CLEAR" };

export type SessionContextValue = {
  state: SessionState;
  dispatch: Dispatch<SessionAction>;
  saveWorkflow: (workflow: LearningSessionResponse, user?: User | null) => void;
  setLoading: () => void;
  setError: (message: string) => void;
  clearSession: () => void;
};
