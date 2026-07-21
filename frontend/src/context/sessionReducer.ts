import type { SessionAction, SessionState } from "@/context/sessionTypes";

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
        intent: action.payload.workflow.learner_intent,
        learningPlan: action.payload.workflow.learning_plan,
        progress: action.payload.workflow.progress_report,
        feedback: action.payload.workflow.feedback_report,
        nudges: action.payload.workflow.nudge_report,
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
