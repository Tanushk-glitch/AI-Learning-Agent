"""Centralized LLM configuration for CrewAI agents."""

from __future__ import annotations

from functools import lru_cache

from crewai import LLM

from backend.core.config import get_settings


GEMINI_FLASH_MODEL = "gemini/gemini-flash-latest"


@lru_cache
def get_gemini_llm() -> LLM:
    """Return the shared Gemini LLM instance used by CrewAI agents."""

    settings = get_settings()
    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is required when MOCK_MODE is false."
        )

    return LLM(
        model=GEMINI_FLASH_MODEL,
        api_key=settings.gemini_api_key,
        temperature=0.2,
        timeout=120,
        max_tokens=4096,
        max_output_tokens=4096,
    )
