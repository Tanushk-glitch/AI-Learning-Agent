"""Intent Agent for structuring learner requests.

The Intent Agent is responsible only for understanding what the learner wants.
It does not create plans, store memory, call databases, or orchestrate crews.
"""

from __future__ import annotations

from crewai import Agent

from backend.agents.base_agent import create_base_agent
from backend.schemas.intent import LearnerIntent


INTENT_EXTRACTION_PROMPT = """Analyze the learner request below.

Extract the user's learning intent into the required structured schema.

Essential fields:
- learning_goal
- subject
- current_skill_level
- available_time
- target_deadline

Rules:
- Do not invent missing information.
- Use null for fields that are not explicitly stated or clearly implied.
- If any essential field is missing, set is_complete to false.
- For each missing essential field, add a short clear follow-up question.
- Only include preferred_learning_style when the learner mentions or strongly implies it.
- Keep follow-up questions practical and learner-friendly.

Learner request:
{user_request}
"""


def create_intent_agent() -> Agent:
    """Create the CrewAI agent that extracts structured learner intent."""

    return create_base_agent(
        role="Learner Intent Analyst",
        goal=(
            "Extract accurate structured learning intent from user requests "
            "and ask clarifying questions when essential details are missing."
        ),
        backstory=(
            "You are an expert learning intake specialist. You carefully "
            "identify what a learner wants to achieve, what they already know, "
            "how much time they have, and when they need results. You never "
            "guess missing details."
        ),
        max_iter=3,
        max_retry_limit=2,
    )


def analyze_learner_intent(user_request: str) -> LearnerIntent:
    """Analyze a learner request and return structured intent data."""

    if not user_request.strip():
        raise ValueError("Learner request cannot be empty.")

    agent = create_intent_agent()
    result = agent.kickoff(
        INTENT_EXTRACTION_PROMPT.format(user_request=user_request),
        response_format=LearnerIntent,
    )
    if result.pydantic is None:
        raise ValueError("Intent Agent did not return structured output.")

    return result.pydantic
