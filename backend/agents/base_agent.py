"""Shared factory and execution helpers for CrewAI agents."""

from __future__ import annotations

import logging
import time
from collections.abc import Callable
from typing import TypeVar

from crewai import Agent, LLM

from backend.core.llm import get_gemini_llm


logger = logging.getLogger(__name__)
T = TypeVar("T")
TRANSIENT_GEMINI_STATUS_CODES = ("429", "503")


class TransientLLMError(RuntimeError):
    """Raised when Gemini remains unavailable after retry attempts."""


def create_base_agent(
    *,
    role: str,
    goal: str,
    backstory: str,
    llm: LLM | None = None,
    verbose: bool = False,
    allow_delegation: bool = False,
    max_iter: int = 5,
    max_retry_limit: int = 2,
) -> Agent:
    """Create a CrewAI agent with shared defaults for this project."""

    return Agent(
        role=role,
        goal=goal,
        backstory=backstory,
        llm=llm or get_gemini_llm(),
        verbose=verbose,
        allow_delegation=allow_delegation,
        max_iter=max_iter,
        max_retry_limit=max_retry_limit,
    )


def run_with_gemini_retry(
    operation: str,
    call: Callable[[], T],
    *,
    max_attempts: int = 3,
    initial_delay_seconds: float = 1.0,
) -> T:
    """Run a Gemini-backed agent call with retries for transient 429/503 errors."""

    delay_seconds = initial_delay_seconds
    for attempt in range(1, max_attempts + 1):
        try:
            return call()
        except Exception as exc:
            if not _is_transient_gemini_error(exc):
                raise

            if attempt == max_attempts:
                logger.exception(
                    "%s failed after %s Gemini retry attempts.",
                    operation,
                    max_attempts,
                )
                raise TransientLLMError(
                    "Gemini API is temporarily unavailable after retrying. "
                    "Please try again in a few minutes."
                ) from exc

            logger.warning(
                "%s hit a transient Gemini error on attempt %s/%s. Retrying in %.1fs.",
                operation,
                attempt,
                max_attempts,
                delay_seconds,
            )
            time.sleep(delay_seconds)
            delay_seconds *= 2

    raise TransientLLMError("Gemini API retry loop ended unexpectedly.")


def _is_transient_gemini_error(exc: Exception) -> bool:
    """Return whether an exception represents a retryable Gemini 429/503 response."""

    error_text = f"{type(exc).__name__}: {exc}".lower()
    return any(status_code in error_text for status_code in TRANSIENT_GEMINI_STATUS_CODES)
