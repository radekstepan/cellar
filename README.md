# Outreach Pipeline

![Outreach Pipeline Screenshot](./screenshot.png)

A **Local-First, JSON-backed, Git-synced** multi-table management system. This app acts as a generic headless CMS for AI agents, presented as a high-performance spreadsheet.

## 🏗️ Architecture

- **Local-First**: Complete data ownership. No cloud database required.
- **Multi-Table Support**: Manage multiple pipelines or tasks via different semantic tokens (e.g., `outreach`, `recruiting`).
- **JSON-backed**: Each record is a separate, beautifully indented JSON file in `data/<token>/records/`. This makes Git diffs clean and merge conflicts rare. Safe concurrent read/writes are handled by `lowdb` with file locking.
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
pipeline/
├── data/
│   ├── outreach/         # Table token (e.g., 'outreach')
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

This app is designed to be co-piloted by AI agents operating as headless CMS manipulators using the specific `pipeline-agent` CLI. Agents can:
1. Read the project context from `AGENTS.md`.
2. Understand the table structure via `pipeline-agent get-schema <token>`.
3. Directly manipulate data safely via commands like `pipeline-agent query`, `update`, and `create`.
4. The UI will instantly reflect these changes for the human user.

## License

AGPL-3.0
