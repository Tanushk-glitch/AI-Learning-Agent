"""Root endpoint for a lightweight API welcome response."""

from __future__ import annotations

from fastapi import APIRouter, status

from backend.schemas.common import MessageResponse


router = APIRouter(tags=["root"])


@router.get("/", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def welcome() -> MessageResponse:
    """Return a simple welcome message for the API."""

    return MessageResponse(message="Welcome to AI-Learning-Agent API")
