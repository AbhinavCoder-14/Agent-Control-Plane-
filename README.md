# Agent Control Plane (ACP)

ACP is an MVP orchestration layer that sits between a developer and AI coding tools (like Copilot-style workflows).

The goal is simple:
- Take one high-level prompt from a developer
- Enrich it with dynamic project context in real time
- Apply task-specific skills
- Generate better, faster, and more reliable code iterations

In short, ACP behaves like a senior engineer middleware for vibe coding.

## What ACP Does

ACP combines multiple context sources into a single actionable prompt:
- `instructions.md` - task requirements and execution steps
- `CONTEXT.md` - project intent and current understanding
- `CHANGELOG.md` - recent changes and evolution history
- `skills/*.md` - domain-specific guidance for the current task

It then runs an iterative loop:
1. Read context + skills
2. Build prompt
3. Call AI provider (Gemini in this MVP)
4. Write outputs and traces
5. Re-run analysis when traces change

## Current Repository Structure

```text
.
├── architecture.md
├── CHANGELOG.md
├── CONTEXT.md
├── instructions.md
├── backend/
│   ├── src/
│   │   ├── agentRunner.js
│   │   ├── deployer.js
│   │   ├── geminiClient.js
│   │   ├── inputProcessor.js
│   │   ├── parser.js
│   │   ├── server.js
│   │   └── watcher.js
├── frontend/
│   └── public/
│       ├── app.js
│       └── index.html
├── GEMINI/
│   └── src/
│       ├── ground_rules.md
│       ├── index.js
│       ├── output.md
│       ├── prompt.md
│       └── test.js
├── skills/
│   ├── architecture.md
│   ├── backend.md
│   ├── debugging.md
│   ├── deployment.md
│   ├── frontend.md
│   └── performance.md
└── traces/
```

## Architecture Overview

### 1) Input/Context Layer
- `backend/src/inputProcessor.js`
- Converts raw idea prompts into project control files (`CONTEXT.md`, `instructions.md`, `architecture.md`)

### 2) Agent Execution Layer
- `backend/src/agentRunner.js`
- Selects skill files by step
- Builds generation prompts
- Parses strict `FILE:` / `CODE:` output
- Writes files safely (temp + rename)

### 3) Watcher/Automation Layer
- `backend/src/watcher.js`
- Watches trace/performance/history files
- Debounces frequent updates
- Triggers parser + AI pipeline
- Uses lock file to prevent multiple watcher processes

### 4) Prompt Composer Layer
- `backend/src/parser.js`
- Merges context, rules, logs, trace, performance, and summary into one prompt

### 5) AI Provider Layer
- `backend/src/geminiClient.js`
- Sends prompts to Gemini
- Writes analysis to `GEMINI/src/output.md`
- Falls back to local analysis if API call fails

### 6) Demo App Layer
- Backend API demo in `backend/src/server.js`
- Frontend demo in `frontend/public/`
- Used as a test harness for ACP tracing and iteration

## Local Setup

### Prerequisites
- Node.js 18+
- npm

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment
Create `.env.local` in repository root (or update existing):

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_API_URL=
GEMINI_MODEL=gemini-2.0-flash
PORT=3001
```

### 3. Run services

Backend API:
```bash
cd backend
npm start
```

Frontend demo:
```bash
cd frontend
npm start
```

Watcher loop:
```bash
cd backend
node src/watcher.js
```

Optional agent runner:
```bash
cd backend
node src/agentRunner.js
```

## Default Endpoints

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:3001/api/health`
- Backend tasks (demo): `http://localhost:3001/api/tasks`

## Product Vision

ACP is evolving from a file-driven local MVP into a real VS Code extension that:
- Integrates directly into the editor workflow
- Adds dynamic, real-time context to coding requests
- Uses skill packs to improve reasoning quality per task type
- Produces higher-confidence code in shorter time from a single prompt

## MVP Limitations (Current)

- Not yet a packaged VS Code extension
- File-based tracing only (no persistent run database)
- Minimal guardrails on generated code application
- Demo app is task-manager oriented (placeholder surface)
- Limited tests and observability

## Recommended Next Milestones

1. Build extension shell (commands, webview, configuration)
2. Move watcher/parser/runner into extension services
3. Add patch preview + human approval flow before writes
4. Add structured run telemetry and searchable history
5. Add stronger safety policies (path allowlist, protected files)
6. Add CI tests for parser, watcher, and response parsing

## License

No license file is currently defined in this repository. Add one before public release.
