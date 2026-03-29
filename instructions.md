# INSTRUCTIONS

1. Generate base files from idea:
   - `node backend/src/inputProcessor.js "Build a vendor management system with dashboard and API"`
2. Start watcher:
   - `node backend/src/watcher.js`
3. Append runtime output to:
   - `traces/session_log/logs.txt`
4. Append agent steps to:
   - `traces/session_log/agent_trace.txt`
5. Update performance/history files as needed:
   - `traces/performance/memory.txt`
   - `traces/performance/latency.txt`
   - `traces/history/history_log.txt`
   - `traces/summary/summary.md`
6. Read generated analysis in:
   - `GEMINI/src/output.md`
7. Deploy when ready:
   - `node backend/src/deployer.js vercel`
   - `node backend/src/deployer.js gcp`
