"""Independent quiz generation and submission endpoints."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status
from fastapi.concurrency import run_in_threadpool

from backend.api.schemas.common import ErrorResponse, SuccessResponse
from backend.schemas.quiz import (
    QuizGenerationRequest,
    QuizGenerationResponse,
    QuizSubmissionRequest,
    QuizSubmissionResponse,
)
from backend.services.openrouter_service import (
    OpenRouterConfigurationError,
    OpenRouterResponseError,
)
from backend.services.quiz_service import InvalidQuizResponseError, QuizService


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post(
    "/generate",
    response_model=SuccessResponse[QuizGenerationResponse],
    status_code=status.HTTP_200_OK,
    summary="Generate a quiz",
    description="Generate a validated multiple-choice quiz with OpenRouter.",
    responses={
        status.HTTP_502_BAD_GATEWAY: {
            "model": ErrorResponse,
            "description": "OpenRouter returned an invalid or failed response.",
        },
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "model": ErrorResponse,
            "description": "OpenRouter is not configured.",
        },
    },
)
async def generate_quiz(
    request: QuizGenerationRequest,
) -> SuccessResponse[QuizGenerationResponse]:
    """Generate a quiz independently of the CrewAI workflow."""

    service = QuizService()
    try:
        quiz = await run_in_threadpool(service.generate_quiz, request)
    except OpenRouterConfigurationError as exc:
        logger.warning("Quiz generation is not configured: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "message": str(exc),
                "error_code": "openrouter_not_configured",
            },
        ) from exc
    except (OpenRouterResponseError, InvalidQuizResponseError) as exc:
        logger.warning("Quiz generation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={
                "message": str(exc),
                "error_code": "quiz_generation_failed",
            },
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected quiz generation failure.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Unable to generate quiz.",
                "error_code": "quiz_generation_error",
            },
        ) from exc

    return SuccessResponse(
        message="Quiz generated successfully.",
        data=quiz,
    )


@router.post(
    "/submit",
    response_model=SuccessResponse[QuizSubmissionResponse],
    status_code=status.HTTP_200_OK,
    summary="Submit a quiz",
    description="Score a generated quiz deterministically in backend code.",
)
async def submit_quiz(
    request: QuizSubmissionRequest,
) -> SuccessResponse[QuizSubmissionResponse]:
    """Score selected answers without calling OpenRouter or CrewAI."""

    result = await run_in_threadpool(QuizService().submit_quiz, request)
    return SuccessResponse(
        message="Quiz submitted successfully.",
        data=result,
    )
