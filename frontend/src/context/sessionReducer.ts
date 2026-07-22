import type { SessionAction, SessionState } from "@/context/sessionTypes";
import type {
  FeedbackReport,
  LearnerIntent,
  LearningPlan,
  LearningSessionResponse,
  NudgeReport,
  ProgressReport,
} from "@/types/learning";

export const initialSessionState: SessionState = {
  user: null,
  intent: null,
  learningPlan: null,
  progress: null,
  feedback: null,
  nudges: null,
  workflowCompleted: false,
  currentStage: null,
  isLoading: false,
  error: null,
};

export function sessionReducer(
  state: SessionState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case "SESSION_LOADING":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "SESSION_SUCCESS":
      return {
        user: action.payload.user ?? state.user,
        intent: getWorkflowField<LearnerIntent>(
          action.payload.workflow,
          "learner_intent",
          "intent"
        ),
        learningPlan: getWorkflowLearningPlan(action.payload.workflow),
        progress: getWorkflowField<ProgressReport>(
          action.payload.workflow,
          "progress_report",
          "progress"
        ),
        feedback: getWorkflowField<FeedbackReport>(
          action.payload.workflow,
          "feedback_report",
          "feedback"
        ),
        nudges: getWorkflowField<NudgeReport>(
          action.payload.workflow,
          "nudge_report",
          "nudges"
        ),
        workflowCompleted: action.payload.workflow.workflow_completed,
        currentStage: action.payload.workflow.current_stage,
        isLoading: false,
        error: action.payload.workflow.error_message,
      };
    case "SESSION_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "SESSION_RESTORE":
      return {
        ...action.payload,
        isLoading: false,
      };
    case "SESSION_CLEAR":
      return initialSessionState;
    default:
      return state;
  }
}

function getWorkflowLearningPlan(
  workflow: LearningSessionResponse
): LearningPlan | null {
  const workflowRecord = workflow as LearningSessionResponse &
    Record<string, unknown>;
  const directPlan = workflow.learning_plan;
  const camelPlan = workflowRecord.learningPlan;
  const genericPlan = workflowRecord.plan;

  if (isLearningPlan(directPlan)) {
    return directPlan;
  }
  if (isLearningPlan(camelPlan)) {
    return camelPlan;
  }
  if (isLearningPlan(genericPlan)) {
    return genericPlan;
  }
  if (isRecord(genericPlan) && isLearningPlan(genericPlan.plan_json)) {
    return genericPlan.plan_json;
  }

  return null;
}

function getWorkflowField<T>(
  workflow: LearningSessionResponse,
  key: "learner_intent" | "progress_report" | "feedback_report" | "nudge_report",
  alias: "intent" | "progress" | "feedback" | "nudges"
): T | null {
  const record = workflow as LearningSessionResponse & Record<string, unknown>;
  return (workflow[key] ?? record[alias] ?? null) as T | null;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
