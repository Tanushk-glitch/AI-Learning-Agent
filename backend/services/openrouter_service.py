"""Reusable OpenRouter chat-completions client."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv


OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_TIMEOUT_SECONDS = 60
ENV_FILE = Path(__file__).resolve().parents[2] / ".env"

load_dotenv(dotenv_path=ENV_FILE)


class OpenRouterError(RuntimeError):
    """Base error raised by the OpenRouter client."""


class OpenRouterConfigurationError(OpenRouterError):
    """Raised when required OpenRouter configuration is missing."""


class OpenRouterResponseError(OpenRouterError):
    """Raised when OpenRouter returns an unusable response."""


class OpenRouterClient:
    """Small reusable client for OpenRouter chat completions."""

    def __init__(
        self,
        *,
        api_key: str | None = None,
        model: str | None = None,
        timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS,
    ) -> None:
        self.api_key = (api_key or os.getenv("OPENROUTER_API_KEY", "")).strip()
        self.model = (model or os.getenv("OPENROUTER_MODEL", "")).strip()
        self.timeout_seconds = timeout_seconds

        if not self.api_key:
            raise OpenRouterConfigurationError(
                "OPENROUTER_API_KEY is required."
            )
        if not self.model:
            raise OpenRouterConfigurationError(
                "OPENROUTER_MODEL is required."
            )

    def create_json_completion(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ) -> str:
        """Return the text content of one JSON-only chat completion."""

        try:
            response = requests.post(
                OPENROUTER_API_URL,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": temperature,
                    "response_format": {"type": "json_object"},
                },
                timeout=self.timeout_seconds,
            )
        except requests.RequestException as exc:
            raise OpenRouterResponseError(
                "Unable to connect to OpenRouter."
            ) from exc

        if response.status_code >= 400:
            raise OpenRouterResponseError(
                f"OpenRouter returned HTTP {response.status_code}."
            )

        try:
            payload: Any = response.json()
            content = payload["choices"][0]["message"]["content"]
        except (ValueError, KeyError, IndexError, TypeError) as exc:
            raise OpenRouterResponseError(
                "OpenRouter returned an invalid response structure."
            ) from exc

        if not isinstance(content, str) or not content.strip():
            raise OpenRouterResponseError(
                "OpenRouter returned empty completion content."
            )
        return content.strip()
