"""Temporary chat endpoint for validating FastAPI to CrewAI communication."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status
from fastapi.concurrency import run_in_threadpool

from backend.schemas.chat import ChatRequest, ChatResponse
from backend.services.chat_service import ChatServiceError, generate_chat_response


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat(request: ChatRequest) -> ChatResponse:
    """Send a user prompt to the temporary CrewAI Gemini agent."""

    try:
        return await run_in_threadpool(generate_chat_response, request)
    except ChatServiceError as exc:
        logger.exception("Temporary chat endpoint failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc
