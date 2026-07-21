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
import type { LearningSessionResponse, User } from "@/types/learning";

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
      clearSession,
    }),
    [clearSession, saveWorkflow, setError, setLoading, state]
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
    if (!isValidSessionState(parsedSession)) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return initialSessionState;
    }

    return {
      ...parsedSession,
      isLoading: false,
    };
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return initialSessionState;
  }
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
    typeof value.workflowCompleted === "boolean" &&
    (typeof value.currentStage === "string" || value.currentStage === null) &&
    typeof value.isLoading === "boolean" &&
    (typeof value.error === "string" || value.error === null)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isEmptySession(state: SessionState): boolean {
  return (
    state.user === null &&
    state.intent === null &&
    state.learningPlan === null &&
    state.progress === null &&
    state.feedback === null &&
    state.nudges === null &&
    state.workflowCompleted === false &&
    state.currentStage === null &&
    state.error === null
  );
}
