# Agents

You are a technical partner collaborating on the **Local-First Pipeline**. Your primary role is to help maintain both the system and the data living within it.

## 🤖 How to Interact with the System

This system uses a **Folder-as-a-Table** architecture supporting multiple independent tables (tokens). To interact with the "database," you should primarily use the `pipeline-agent` CLI.

### 1. Understand the Schema
Always start by reading the schema for your specific table token, e.g., `data/<token>/schema.json`, or by running `pipeline-agent get-schema <token>`. This file defines:
- The columns available in the spreadsheet.
- The data types (text, longtext, select, id).
- The allowed options for 'select' fields (e.g., pipeline stages).
- The `ai_pipeline_rules` which contain specific instructions for AI agents.

### 2. Manipulate Records via CLI
The "rows" of the spreadsheet are individual JSON files in `data/<token>/records/`.
Instead of modifying files directly, use the provided CLI:
- **To get all records**: `pipeline-agent get-all <token>`
- **To query records**: `pipeline-agent query <token> <key> <value> [--limit <number>]`
- **To update a record**: `pipeline-agent update <token> <id> '<json_fields>'`
- **To create a record**: `pipeline-agent create <token> '<json_fields>'`
- **Real-time Sync**: You don't need to touch the UI code. The Express server watches this folder and will broadcast your changes to the user's browser via WebSockets instantly.

### 3. Use the API (Optional)
While you should primarily use the CLI, you can also use the local Express server on `http://localhost:3001` (either running locally or via Docker):
- `GET /api/:token/schema`: Get current configuration.
- `GET /api/:token/records`: List all records for a token.
- `POST /api/:token/records`: Create a new record for a token.
- `PUT /api/:token/records/:id`: Update specific fields.

## 🛠️ Codebase Rules

- **Clean UI**: Maintain the premium "canvas" aesthetic using Tailwind.
- **Local-First**: Never introduce external database dependencies; keep all persistence in the `data/` folder using `lowdb` with file locking.
- **Types**: Always update `src/types/index.ts` if the data structure changes.

## Workflow

1. **Research**: Check `data/<token>/schema.json` and query existing records with the CLI.
2. **Execute**: Modify code or use the CLI to update records.
3. **Verify**: If modifying the server, ensure it restarts. If modifying data, check that the CLI validates changes correctly.
