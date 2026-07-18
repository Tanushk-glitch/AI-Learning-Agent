"""Structured output schema for the Intent Agent."""

from __future__ import annotations

from pydantic import BaseModel, Field


class LearnerIntent(BaseModel):
    """Structured representation of a learner's request."""

    learning_goal: str | None = Field(
        default=None,
        description="The outcome the learner wants to achieve.",
    )
    subject: str | None = Field(
        default=None,
        description="The topic, skill, domain, or subject area to learn.",
    )
    current_skill_level: str | None = Field(
        default=None,
        description="The learner's current level, such as beginner or intermediate.",
    )
    available_time: str | None = Field(
        default=None,
        description="How much time the learner can spend studying.",
    )
    target_deadline: str | None = Field(
        default=None,
        description="The target completion date, exam date, or deadline.",
    )
    preferred_learning_style: str | None = Field(
        default=None,
        description="Preferred learning style if the learner mentions one.",
    )
    is_complete: bool = Field(
        description="Whether all essential intent fields are present.",
    )
    missing_information: list[str] = Field(
        default_factory=list,
        description="Essential fields that are missing from the request.",
    )
    follow_up_questions: list[str] = Field(
        default_factory=list,
        description="Questions to ask before planning if essential information is missing.",
    )
