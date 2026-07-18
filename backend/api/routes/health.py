"""Health-check endpoint for deployment and uptime checks."""

from __future__ import annotations

from fastapi import APIRouter, status

from backend.schemas.health import HealthResponse


router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check() -> HealthResponse:
    """Return a lightweight service health response."""

    return HealthResponse(status="ok")
