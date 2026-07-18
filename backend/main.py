"""FastAPI application entry point for AI-Learning-Agent."""

from __future__ import annotations

import logging
import sys

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from backend.api.router import api_router
from backend.utils.console import configure_utf8_output


configure_utf8_output(sys.stdout, sys.stderr)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI-Learning-Agent API",
    description="Backend foundation for the AI-powered personal learning agent.",
    version="0.1.0",
)

app.include_router(api_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """Log unexpected errors and return a stable API error shape."""

    logger.exception("Unhandled error while processing %s", request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )
