"""Service entry point for running the AI learning workflow."""

from __future__ import annotations

from backend.crew.crew_manager import CrewManager
from backend.schemas.learning_session import LearningSessionResponse


def run_learning_session(user_request: str) -> LearningSessionResponse:
    """Run a complete learning session workflow from a user request."""

    manager = CrewManager()
    return manager.run_learning_workflow(user_request)
