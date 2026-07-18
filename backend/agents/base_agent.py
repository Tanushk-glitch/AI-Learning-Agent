"""Shared factory for creating CrewAI agents with project defaults."""

from __future__ import annotations

from crewai import Agent, LLM

from backend.core.llm import get_gemini_llm


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
