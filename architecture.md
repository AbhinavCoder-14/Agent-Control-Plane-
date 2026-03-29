# ARCHITECTURE

## Layers

- Input layer: `backend/src/inputProcessor.js`
- Watch layer: `backend/src/watcher.js`
- Parse layer: `backend/src/parser.js`
- AI layer: `backend/src/geminiClient.js`
- Deploy layer: `backend/src/deployer.js`

## Data Flow

User Idea -> inputProcessor -> root files -> watcher -> parser -> geminiClient -> `GEMINI/src/output.md`

## Trace Inputs

- `traces/session_log/logs.txt`
- `traces/session_log/agent_trace.txt`
- `traces/history/history_log.txt`
- `traces/performance/memory.txt`
- `traces/performance/latency.txt`
- `traces/summary/summary.md`

## Deployment Targets

- Vercel
- GCP
