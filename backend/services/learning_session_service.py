"""Service entry point for running and persisting AI learning workflows."""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import TYPE_CHECKING

from backend.crew.crew_manager import CrewManager
from backend.crew.crew_manager import WorkflowState
from backend.schemas.learning_session import LearningSessionResponse


if TYPE_CHECKING:
    from backend.database.models import User
    from backend.services.persistence_service import PersistenceService


logger = logging.getLogger(__name__)


def run_learning_session(
    user_request: str,
    *,
    user_id: int | None = None,
    user_name: str = "Default Learner",
    user_email: str | None = None,
) -> LearningSessionResponse:
    """Run a complete learning session workflow and persist complete outputs.

    Persistence failures are logged and treated as non-fatal so an AI-generated
    response is still returned to the caller.
    """

    try:
        from backend.services.persistence_service import PersistenceService

        persistence_service = PersistenceService()
    except Exception as exc:
        logger.error("Persistence service setup failed; continuing without persistence.")
        logger.debug("Persistence service setup details: %s", exc)
        persistence_service = None

    manager = CrewManager()
    user = (
        _resolve_user(
            persistence_service,
            user_id=user_id,
            user_name=user_name,
            user_email=user_email,
        )
        if persistence_service is not None
        else None
    )
    state = WorkflowState()

    logger.info("Starting persisted learning session workflow.")
    if not user_request.strip():
        return manager._stop_with_error(
            state,
            "intent",
            "User learning request cannot be empty.",
        )

    try:
        manager._run_intent_stage(user_request, state)
        if state.learner_intent is None:
            return manager._stop_with_error(
                state,
                "intent",
                "Intent Agent did not return learner intent.",
            )

        if not state.learner_intent.is_complete:
            logger.info("Intent incomplete. Stopping workflow for follow-up.")
            return manager._response(
                state,
                workflow_completed=False,
                current_stage="intent_follow_up_required",
                error_message="Learner intent is incomplete.",
            )

        if user is not None:
            _safe_persist(
                "learner intent",
                lambda: persistence_service.save_intent(
                    user_id=user.id,
                    intent=state.learner_intent,
                ),
            )

        manager._run_planner_stage(state)
        if user is not None and state.learning_plan is not None:
            _safe_persist(
                "learning plan",
                lambda: persistence_service.save_learning_plan(
                    user_id=user.id,
                    plan=state.learning_plan,
                ),
            )

        manager._run_progress_stage(state)
        if user is not None and state.progress_report is not None:
            _safe_persist(
                "progress",
                lambda: persistence_service.update_progress(
                    user_id=user.id,
                    progress_report=state.progress_report,
                ),
            )

        manager._run_feedback_stage(state)
        if user is not None and state.feedback_report is not None:
            _safe_persist(
                "feedback",
                lambda: persistence_service.save_feedback(
                    user_id=user.id,
                    feedback_report=state.feedback_report,
                ),
            )

        manager._run_nudge_stage(state)
        if user is not None and state.nudge_report is not None:
            _safe_persist(
                "nudge",
                lambda: persistence_service.save_nudge(
                    user_id=user.id,
                    nudge_report=state.nudge_report,
                ),
            )
    except (ValueError, RuntimeError) as exc:
        logger.exception("Learning workflow failed at stage %s", state.current_stage)
        return manager._stop_with_error(state, state.current_stage, str(exc))
    except Exception as exc:
        logger.exception(
            "Unexpected learning workflow failure at stage %s",
            state.current_stage,
        )
        return manager._stop_with_error(
            state,
            state.current_stage,
            f"Unexpected workflow error: {exc}",
        )

    logger.info("Persisted learning session workflow completed.")
    return manager._response(
        state,
        workflow_completed=True,
        current_stage="completed",
    )


def _resolve_user(
    persistence_service: "PersistenceService",
    *,
    user_id: int | None,
    user_name: str,
    user_email: str | None,
) -> "User | None":
    """Retrieve an existing user or create one for workflow persistence."""

    try:
        user = None
        if user_id is not None:
            user = persistence_service.get_user(user_id=user_id)
        if user is None and user_email is not None:
            user = persistence_service.get_user(email=user_email)
        if user is None:
            user = persistence_service.get_user(name=user_name)
        if user is not None:
            logger.info("Using existing user_id=%s for persistence.", user.id)
            return user

        logger.info("Creating user for learning workflow persistence.")
        return persistence_service.create_user(name=user_name, email=user_email)
    except Exception as exc:
        logger.error("User persistence setup failed; continuing without persistence.")
        logger.debug("User persistence setup details: %s", exc)
        return None


def _safe_persist(operation: str, persist: Callable[[], object]) -> None:
    """Run a persistence operation without crashing the AI workflow."""

    try:
        persist()
    except Exception as exc:
        logger.error("Failed to persist %s; continuing workflow.", operation)
        logger.debug("Persistence details: %s", exc)
