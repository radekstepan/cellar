# OpenClaw Docker Integration Tasks

## Overall Goal
Support an architecture where an OpenClaw agent operates within a Docker container to automatically read and update tasks via a local JSON-backed file system (acting as a "lite Airtable" locally). The human operator should be able to oversee the agent's work and intervene concurrently without causing data loss or complex migration headaches.

## Remaining Implementation Tasks

### 1. Docker & Container Orchestration
The primary piece needed to get OpenClaw running in a controlled containerized environment referencing local files.
- [ ] Create a `Dockerfile`: Needs to bundle the Node backend, frontend statics, and any OS-level dependencies the agent requires.
- [ ] Create `docker-compose.yml`: Must include volume mounting for `data/records/` and `schema.json` so the agent interacts with the exact same files the human sees on the host machine.
- [ ] Document Docker startup commands (`docker-compose up -d`) to ensure proper mapping and permissions.

### 2. The Agent Interface (CLI vs API)
The interface through which OpenClaw actually interacts with the "spreadsheet" state. Right now, only basic CRUD via HTTP API is implemented in `apps/server/index.js`, without agent-friendly affordances.
- [ ] Option A (CLI): Create a `cli.js` script to expose commands directly to the terminal for OpenClaw (e.g., `node cli.js query --status="Needs Research"`).
- [ ] Option B (API): Extend the current backend API specifically for OpenClaw. Needs:
  - Add query/filtering endpoints (e.g., `GET /api/records?status=X`).
  - Add specific endpoints to read/update the `schema.json` `ai_pipeline_rules`.

### 3. Concurrency and File Locking Mechanisms
Critical for ensuring the human and the OpenClaw agent can work simultaneously without overwriting each other's changes.
- [x] Add file locking wrapper around `fs.writeFile` in the Local JS Server. This guarantees synchronous writes across the UI `PUT` and OpenClaw containerized commands.
- [x] Consider atomic temp file writes + renames instead of raw `fs.writeFile` to avoid partial JSON corruption.

### 4. Agent Configuration & Trigger Pipeline
The orchestration piece mapping the `schema.json` logic described in `docs/plan.md` to actual OpenClaw prompts.
- [ ] Implement the OpenClaw config/rules mapping to `schema.json` `ai_pipeline_rules` (the "system prompts").
- [ ] Build the loop script or cron job inside testing setup to wake OpenClaw, check triggers ("If status is Ready for Review..."), and execute actions.
- [ ] Create the custom tools bindings (`functions`) mapping OpenClaw generic calls to the interface defined in Step 2.
