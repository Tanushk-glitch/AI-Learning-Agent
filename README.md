# AI-Learning-Agent

AI-Learning-Agent is a production-oriented foundation for an AI-powered personal learning assistant. This repository currently contains the development environment scaffold, Gemini configuration, and minimal smoke tests for direct Gemini and CrewAI-backed Gemini calls.

No FastAPI routes, frontend code, database models, authentication, memory, orchestration, or business workflows are implemented at this stage.

## Project Overview

The long-term goal is to evolve this project into a full-stack learning agent that can plan, personalize, and support learning workflows using modern AI engineering practices. The current milestone is intentionally limited to a clean, scalable setup that future contributors can build on safely.

## Architecture Overview

The planned architecture separates the system into a Python backend, a future React frontend, documentation, tests, and operational scripts.

- `backend/` will contain the FastAPI service, CrewAI agent modules, shared configuration, database access, schemas, services, memory integrations, and utilities.
- `frontend/` is reserved for the future React and TypeScript application.
- `tests/` is reserved for automated tests across backend components and future integration boundaries.
- `docs/` stores architecture notes, setup guides, and design decisions.
- `scripts/` stores project-level automation and maintenance scripts.

## Folder Structure

```text
AI-Learning-Agent/
|-- backend/
|   |-- agents/
|   |   `-- base_agent.py
|   |-- api/
|   |-- core/
|   |   |-- config.py
|   |   `-- llm.py
|   |-- database/
|   |-- memory/
|   |-- models/
|   |-- schemas/
|   |-- scripts/
|   |   |-- test_crewai.py
|   |   `-- test_gemini.py
|   |-- services/
|   `-- utils/
|-- docs/
|-- frontend/
|-- scripts/
|-- tests/
|-- .env
|-- .env.example
|-- .gitignore
|-- .python-version
|-- README.md
`-- requirements.txt
```

## Tech Stack

- Python 3.12+
- Google Gemini models
- Google GenAI SDK
- CrewAI
- FastAPI
- React + TypeScript later
- PostgreSQL later
- Redis later
- SQLAlchemy
- Pydantic
- python-dotenv
- pip
- Git

## Project Setup

Install Python 3.12 or newer before creating the virtual environment.

Clone the repository and move into the project directory:

```powershell
git clone <repository-url>
cd AI-Learning-Agent
```

Create a local `.env` file from the example:

```powershell
Copy-Item .env.example .env
```

Fill in the required API keys and service URLs in `.env`. Never commit `.env`.

Create a virtual environment:

```powershell
py -3.12 -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Activate it on macOS or Linux:

```bash
source venv/bin/activate
```

Upgrade pip and install dependencies:

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Run the Gemini connectivity test:

```powershell
python -m backend.scripts.test_gemini
```

Run the CrewAI Gemini smoke test:

```powershell
python -m backend.scripts.test_crewai
```

## Installation Instructions

Follow the Project Setup section above for local development.

## Virtual Environment Setup

Use `py -3.12 -m venv venv` on Windows or `python3.12 -m venv venv` on macOS and Linux.

## Dependency Installation

Install dependencies with `pip install -r requirements.txt` after activating the virtual environment.

## Running the Project

There is no application server to run yet because API routes and business logic are intentionally out of scope for this milestone.

When the FastAPI application is added later, it will typically run with:

```powershell
uvicorn backend.main:app --reload
```

Validate Gemini connectivity after adding `GEMINI_API_KEY` to `.env`:

```powershell
python -m backend.scripts.test_gemini
```

Validate CrewAI can use the centralized Gemini LLM:

```powershell
python -m backend.scripts.test_crewai
```

## Future Roadmap

- Add FastAPI application bootstrap.
- Add CrewAI agents and task orchestration.
- Add persistent memory and retrieval capabilities.
- Add PostgreSQL database models and migrations.
- Add Redis caching for selected workflows.
- Add React and TypeScript frontend.
- Add authentication and user profile management.
- Add CI checks, linting, formatting, and test automation.
- Add deployment documentation.

## Contribution Guidelines

- Keep changes scoped and aligned with the current milestone.
- Do not add agents, API routes, database tables, memory, or workflows until those milestones are explicitly started.
- Keep secrets out of version control and use `.env` for local-only configuration.
- Add tests when implementing behavior.
- Document architectural decisions in `docs/` as the system grows.

## Verification Steps

Confirm Python works:

```powershell
python --version
```

The version should be `3.12` or newer. On Windows, use this command if the default `python` points to an older interpreter:

```powershell
py -3.12 --version
```

Confirm dependencies install:

```powershell
pip install -r requirements.txt
```

Confirm Gemini connectivity:

```powershell
python -m backend.scripts.test_gemini
```

Confirm CrewAI Gemini connectivity:

```powershell
python -m backend.scripts.test_crewai
```

Confirm project structure:

```powershell
Get-ChildItem -Recurse
```
