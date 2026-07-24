"""OpenRouter-backed quiz generation and deterministic scoring."""

from __future__ import annotations

import json

from pydantic import BaseModel, ValidationError

from backend.schemas.quiz import (
    QuizGenerationRequest,
    QuizGenerationResponse,
    QuizQuestion,
    QuizQuestionResult,
    QuizSubmissionRequest,
    QuizSubmissionResponse,
)
from backend.services.openrouter_service import OpenRouterClient


SYSTEM_PROMPT = """You generate educational multiple-choice quizzes.
Return strict JSON only. Do not include markdown, code fences, or commentary.
Every question must have exactly four unique options. The correct_answer must
exactly match one option. Include a concise explanation for every answer."""


class QuizServiceError(RuntimeError):
    """Base error raised by quiz generation."""


class InvalidQuizResponseError(QuizServiceError):
    """Raised when generated quiz JSON is malformed or invalid."""


class _GeneratedQuestions(BaseModel):
    questions: list[QuizQuestion]


class QuizService:
    """Generate quizzes with OpenRouter and score them in backend code."""

    def __init__(self, client: OpenRouterClient | None = None) -> None:
        self.client = client

    def generate_quiz(
        self,
        request: QuizGenerationRequest,
    ) -> QuizGenerationResponse:
        """Generate and validate a multiple-choice quiz."""

        topics = ", ".join(request.topics)
        user_prompt = f"""Create exactly {request.number_of_questions} multiple-choice
questions about these learning topics: {topics}.
Difficulty: {request.difficulty.value}.

Return this exact JSON shape:
{{
  "questions": [
    {{
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "One exact option value",
      "explanation": "Why the answer is correct"
    }}
  ]
}}

The questions array must contain exactly {request.number_of_questions} items."""

        client = self.client or OpenRouterClient()
        content = client.create_json_completion(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )
        try:
            payload = json.loads(content)
        except json.JSONDecodeError as exc:
            raise InvalidQuizResponseError(
                "OpenRouter returned invalid quiz JSON."
            ) from exc

        try:
            generated = _GeneratedQuestions.model_validate(payload)
        except ValidationError as exc:
            raise InvalidQuizResponseError(
                "OpenRouter returned quiz data that failed validation."
            ) from exc

        if len(generated.questions) != request.number_of_questions:
            raise InvalidQuizResponseError(
                "OpenRouter returned an unexpected number of quiz questions."
            )

        return QuizGenerationResponse(
            topics=request.topics,
            difficulty=request.difficulty,
            questions=generated.questions,
        )

    def submit_quiz(
        self,
        request: QuizSubmissionRequest,
    ) -> QuizSubmissionResponse:
        """Score selected answers without using an LLM."""

        results: list[QuizQuestionResult] = []
        score = 0
        for index, (question, selected_answer) in enumerate(
            zip(
                request.generated_quiz.questions,
                request.selected_answers,
                strict=True,
            ),
            start=1,
        ):
            is_correct = selected_answer == question.correct_answer
            score += int(is_correct)
            results.append(
                QuizQuestionResult(
                    question_number=index,
                    question=question.question,
                    selected_answer=selected_answer,
                    correct_answer=question.correct_answer,
                    is_correct=is_correct,
                    explanation=question.explanation,
                )
            )

        total_questions = len(request.generated_quiz.questions)
        return QuizSubmissionResponse(
            score=score,
            total_questions=total_questions,
            percentage=round(score / total_questions * 100, 2),
            results=results,
        )
