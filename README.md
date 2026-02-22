# Cellar

![Outreach Screenshot](./screenshot.png)

A **Local-First, JSON-backed, Git-synced** multi-table management system. This app acts as a generic headless CMS for AI agents, presented as a high-performance spreadsheet.

## 🏗️ Architecture

- **Local-First**: Complete data ownership. No cloud database required.
- **Multi-Table Support**: Manage multiple cellars or tasks via different semantic table identifiers (e.g., `outreach`, `recruiting`).
- **JSON-backed**: Each record is a separate, beautifully indented JSON file in `data/<table>/records/`. This makes Git diffs clean and merge conflicts rare. Safe concurrent read/writes are handled by `lowdb` with file locking.
- **Git-sycned**: Your audit history and version control are handled by regular Git commits.
- **WebSocket Sync**: The UI live-updates instantly when local files are changed (by you or an AI agent) via a built-in file watcher.

## 🚀 Getting Started

You can run the system using Docker (recommended) or manually by starting the backend and frontend dev servers separately.

### Using Docker (Recommended)

The easiest way to get the system running is using Docker Compose, which handles building the frontend and running the server automatically. We provide convenience scripts in the `bin/` folder for this:

```bash
# To build and start the system (best for first run or after changes):
./bin/rebuild

# To start the system without rebuilding:
./bin/start

# To stop the system:
./bin/stop

# To check if the system is running:
./bin/status
```

*The application and API are available at `http://localhost:3001`*

### Running Manually

This project uses Turborepo. You can run it locally outside of Docker by starting the development servers.

#### 1. Install Dependencies
```bash
yarn install
```

#### 2. Start Both Servers (Turbo)
```bash
yarn dev
```
*Frontend runs on `http://localhost:5173` (requests to `/api` are automatically proxied to the backend).*
*Backend runs on `http://localhost:3001` and handles file-locking and WebSocket sync.*

## 📁 Project Structure

```text
cellar/
├── data/
│   ├── outreach/         # Table (e.g., 'outreach')
│   │   ├── schema.json   # Defines your columns and AI rules for this table
│   │   └── records/      # Folder-as-a-Table (one JSON file per row)
│   └── default/          # Fallback table
├── apps/
│   ├── server/           # Express backend APIs, WebSocket sync, & CLI
│   └── frontend/         # React UI workspace
├── package.json          # Monorepo root
└── turbo.json            # Turborepo task runner
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Vite.
- **Backend**: Node.js, Express, Chokidar (file watching), proper-lockfile, WebSockets.
- **Storage**: Flat-file JSON (Git-friendly) managed by lowdb.

## 🤖 AI Agent Integration

This app is designed to be co-piloted by AI agents operating as headless CMS manipulators using the specific `cellar` CLI. Agents can:
1. Read the project context from `AGENTS.md`.
2. Understand the table structure via `cellar get-schema <table>`.
3. Directly manipulate data safely via commands like `cellar query`, `update`, and `create`.
4. The UI will instantly reflect these changes for the human user.

## 📖 Walkthrough: Running the Outreach

To see the system in action, let's walk through how the Outreach (`docs/example.md`) is configured and executed.

### 1. Configure the Table (Schema)
Create a new directory for your cellar (e.g., `data/outreach/`) and define its data model and agent instructions in `schema.json`.

For the Outreach, the schema defines columns like `target`, `status` (Triage, Researching, Drafting, Ready), and fields for the AI's output (`research_data`, `draft_email`). It also contains `ai_cellar_rules`, giving explicit system prompts to the "Discovery" and "Enrichment" agents.

### 2. Start the Application
Boot up the local system so the API and UI are ready:
```bash
./bin/start
```
*The UI will be available at `http://localhost:3001`, displaying your Outreach table.*

### 3. Run the Agents
AI agents interact with the generic CLI to process the workflow autonomously.

**The Discovery Agent** discovers new leads and queues them:
```bash
# 1. Agent first checks what's already in the table to avoid duplicates
node apps/server/cli.js query outreach status Triage

# 2. Agent adds a newly discovered lead to the queue
node apps/server/cli.js create outreach '{"target": "Acme Corp", "url": "https://acme.com", "status": "Triage"}'
```

**The Enrichment Agent** processes the queue and drafts emails:
```bash
# 1. Agent finds a lead ready for processing
node apps/server/cli.js query outreach status Triage

# 2. Agent saves its research and the generated email draft
node apps/server/cli.js update outreach <ID> '{"status": "Ready", "research_data": "Found CEO...", "draft_email": "Subject: Hello\n\nHi..."}'
```

### 4. Real-time UI Sync
Because of the local-first architecture and built-in file watching, every time an agent modifies a JSON record via the CLI, your browser UI updates instantly via WebSockets. You can sit back and watch your spreadsheet fill up with personalized drafts!

## License

AGPL-3.0
