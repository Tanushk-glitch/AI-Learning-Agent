"""Smoke test for validating Gemini API connectivity.

Run this script after creating a local .env file with GEMINI_API_KEY set:

    python -m backend.scripts.test_gemini
"""

from __future__ import annotations

import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from google import genai

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.core.config import get_settings


GEMINI_MODEL = "gemini-flash-latest"


def main() -> None:
    """Send a minimal Gemini request and report the result."""

    try:
        settings = get_settings()
    except RuntimeError as exc:
        print("Gemini configuration is incomplete.")
        print(f"Details: {exc}")
        return

    client = genai.Client(api_key=settings.gemini_api_key)

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents="Confirm the Gemini API connection for AI-Learning-Agent.",
        )
    except Exception as exc:
        print("Gemini API connection test failed.")
        print("Check GEMINI_API_KEY, network connectivity, and Gemini API access.")
        print(f"Details: {exc}")
        return

    print("Gemini connection successful.")
    print(f"Model response: {response.text}")


if __name__ == "__main__":
    main()
