# Agents

You are a technical partner collaborating on the **Local-First Outreach Pipeline**. Your primary role is to help maintain both the system and the data living within it.

## 🤖 How to Interact with the System

This system uses a **Folder-as-a-Table** architecture. To interact with the "database," you manipulate flat files on disk.

### 1. Understand the Schema
Always start by reading `data/schema.json`. This file defines:
- The columns available in the spreadsheet.
- The data types (text, longtext, select, id).
- The allowed options for 'select' fields (e.g., pipeline stages).

### 2. Manipulate Records
The "rows" of the spreadsheet are individual JSON files in `data/records/`.
- **To update a record**: Read the JSON file, modify the fields, and write it back.
- **To add a record**: Create a new `.json` file with a unique ID.
- **Real-time Sync**: You don't need to touch the UI code. The Express server watches this folder and will broadcast your changes to the user's browser via WebSockets instantly.

### 3. Use the API (Optional)
While you can manipulate files directly, you can also use the local Express server on `http://localhost:3001` (either running locally or via Docker):
- `GET /api/schema`: Get current configuration.
- `GET /api/records`: List all records.
- `POST /api/records`: Create a new record.
- `PUT /api/records/:id`: Update specific fields.

## 🛠️ Codebase Rules

- **Clean UI**: Maintain the premium "canvas" aesthetic using Tailwind.
- **Local-First**: Never introduce external database dependencies; keep all persistence in the `data/` folder.
- **Types**: Always update `src/types/index.ts` if the data structure changes.

## Workflow

1. **Research**: Check `data/schema.json` and `data/records/`.
2. **Execute**: Modify code or data files.
3. **Verify**: If modifying the server, ensure it restarts. If modifying data, check that it validates against the schema.
