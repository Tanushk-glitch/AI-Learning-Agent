/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import {
  initialSessionState,
  sessionReducer,
} from "@/context/sessionReducer";
import type {
  SessionContextValue,
  SessionState,
} from "@/context/sessionTypes";
import type { LearningPlan, LearningSessionResponse, User } from "@/types/learning";

const SESSION_STORAGE_KEY = "ai-learning-agent-session";

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

type SessionProviderProps = {
  children: ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const [state, dispatch] = useReducer(
    sessionReducer,
    initialSessionState,
    loadStoredSession
  );

  useEffect(() => {
    if (isEmptySession(state)) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const saveWorkflow = useCallback(
    (workflow: LearningSessionResponse, user?: User | null) => {
      dispatch({
        type: "SESSION_SUCCESS",
        payload: { workflow, user },
      });
    },
    []
  );

  const setLoading = useCallback(() => {
    dispatch({ type: "SESSION_LOADING" });
  }, []);

  const setError = useCallback((message: string) => {
    dispatch({ type: "SESSION_ERROR", payload: message });
  }, []);

  const toggleTopicCompletion = useCallback(
    (phaseNumber: number, topic: string, completed: boolean) => {
      dispatch({
        type: "TOPIC_COMPLETION_TOGGLE",
        payload: { phaseNumber, topic, completed },
      });
    },
    []
  );

  const clearSession = useCallback(() => {
    dispatch({ type: "SESSION_CLEAR" });
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      state,
      dispatch,
      saveWorkflow,
      setLoading,
      setError,
      toggleTopicCompletion,
      clearSession,
    }),
    [clearSession, saveWorkflow, setError, setLoading, state, toggleTopicCompletion]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider.");
  }
  return context;
}

function loadStoredSession(): SessionState {
  const storedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!storedSession) {
    return initialSessionState;
  }

  try {
    const parsedSession: unknown = JSON.parse(storedSession);
    const normalizedSession = normalizeStoredSession(parsedSession);
    if (!normalizedSession) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return initialSessionState;
    }

    return {
      ...normalizedSession,
      isLoading: false,
    };
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return initialSessionState;
  }
}

function normalizeStoredSession(value: unknown): SessionState | null {
  if (!isRecord(value)) {
    return null;
  }

  const candidate = {
    ...value,
    intent: value.intent ?? value.learner_intent ?? null,
    learningPlan: getStoredLearningPlan(value),
    progress: value.progress ?? value.progress_report ?? null,
    feedback: value.feedback ?? value.feedback_report ?? null,
    nudges: value.nudges ?? value.nudge_report ?? null,
    completedTopics: isCompletedTopics(value.completedTopics)
      ? value.completedTopics
      : {},
  };

  if (!isValidSessionState(candidate)) {
    return null;
  }

  return candidate;
}

function getStoredLearningPlan(value: Record<string, unknown>): LearningPlan | null {
  const camelPlan = value.learningPlan;
  const snakePlan = value.learning_plan;
  const genericPlan = value.plan;

  if (isLearningPlan(camelPlan)) {
    return camelPlan;
  }
  if (isLearningPlan(snakePlan)) {
    return snakePlan;
  }
  if (isLearningPlan(genericPlan)) {
    return genericPlan;
  }
  if (isRecord(genericPlan) && isLearningPlan(genericPlan.plan_json)) {
    return genericPlan.plan_json;
  }

  return null;
}

function isValidSessionState(value: unknown): value is SessionState {
  if (!isRecord(value)) {
    return false;
  }

  return (
    "user" in value &&
    "intent" in value &&
    "learningPlan" in value &&
    "progress" in value &&
    "feedback" in value &&
    "nudges" in value &&
    "completedTopics" in value &&
    isCompletedTopics(value.completedTopics) &&
    typeof value.workflowCompleted === "boolean" &&
    (typeof value.currentStage === "string" || value.currentStage === null) &&
    typeof value.isLoading === "boolean" &&
    (typeof value.error === "string" || value.error === null)
  );
}

function isCompletedTopics(value: unknown): value is Record<string, boolean> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((item) => typeof item === "boolean");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLearningPlan(value: unknown): value is LearningPlan {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.learning_goal === "string" &&
    typeof value.subject === "string" &&
    typeof value.learner_level === "string" &&
    typeof value.total_available_time === "string" &&
    typeof value.target_deadline === "string" &&
    typeof value.overview === "string" &&
    Array.isArray(value.phases) &&
    typeof value.final_milestone === "string"
  );
}

function isEmptySession(state: SessionState): boolean {
  return (
    state.user === null &&
    state.intent === null &&
    state.learningPlan === null &&
    state.progress === null &&
    state.feedback === null &&
    state.nudges === null &&
    Object.keys(state.completedTopics).length === 0 &&
    state.workflowCompleted === false &&
    state.currentStage === null &&
    state.error === null
  );
}
