# Implementing the AI Cellar via Local API/CLI

This document outlines how the architecture is designed to be **completely generic** (acting as a "headless CMS" for autonomous agents) while specifically demonstrating how to migrate the Outreach from `docs/example.md`.

## The Generic Architecture: A Headless CMS for AI

The core philosophy of this project is that the backend and UI should **not** hardcode any specific domains, workflows, or instructions. Instead, everything is driven by data schema definitions.

How to create an entirely new task/workflow:

1. **Multiple Tables:**
   The `data/` directory supports multiple independent workflows/tables. Creating a new workflow simply means creating a new directory (e.g., `data/recruitment/` or `data/content-writer/`). 

2. **Data Model defined by `schema.json`:**
   Inside the new folder, the `schema.json` acts as the source of truth. The `columns` array tells the UI exactly how to render the spreadsheet and handle data types. The backend acts as a dumb CRUD wrapper around `records/*.json` based on this schema.

3. **Agent AI Rules defined in Schema:**
   The specific instructions on how an agent should behave (what leads to fetch, what action to take next) are heavily dependent on the task. These prompts are stored in the `ai_cellar_rules` object within the `schema.json`. When an agent "wakes up", it simply asks the API for its rules for that specific table. 

4. **Generic State Transitions:**
   Instead of hardcoded "To Do" / "In Progress" / "Done" logic, the stages for any given task are just options inside a `select` column in the `schema.json`. The AI agent gets a rule saying "Query records with status=Ready", processes them, and sets "status=Completed".

---

## Example Implementation: The Outreach

To implement the specific markdown-based Outreach workflow (described in `docs/example.md`), follow these steps within a specific table (e.g., `data/outreach/`).

### Step 1: Initialize the Outreach Schema

The `data/outreach/schema.json` needs columns for URLs and hooks, and needs to encode the instructions for the "Discovery" and "Enrichment" agents.

```json
{
  "projectName": "Outreach",
  "version": "1.0.5",
  "columns": [
    { "key": "id", "label": "ID", "type": "id", "width": "80px" },
    { "key": "target", "label": "Target", "type": "text", "width": "180px" },
    { "key": "status", "label": "Stage", "type": "select", "options": ["Triage", "Researching", "Drafting", "Ready"], "width": "140px" },
    { "key": "url", "label": "Website URL", "type": "text", "width": "180px" },
    { "key": "hook", "label": "Context/Hook", "type": "longtext", "width": "200px" },
    { "key": "research_data", "label": "Agent Research", "type": "longtext", "width": "260px" },
    { "key": "draft_email", "label": "Draft", "type": "longtext", "width": "260px" }
  ],
  "ai_cellar_rules": {
    "discovery_prompt": "You are the Discovery Agent. Use `node cli.js get-schema outreach` to understand the table. Use `node cli.js query outreach status 'Triage'` and other statuses to build your blocklist. Search the web for new leads. Use `node cli.js create outreach '{\"target\": \"...\", \"url\": \"...\", \"hook\": \"...\", \"status\": \"Triage\"}'` to add new leads.",
    "enrichment_prompt": "You are the Enrichment Agent. Use `node cli.js query outreach status 'Triage'` to find new leads. Take up to 2. Research contact details. Draft an email. Use `node cli.js update outreach <ID> '{\"status\": \"Ready\", \"research_data\": \"...\", \"draft_email\": \"...\"}'` to save."
  }
}
```

### Step 2: Agent Standard Operating Procedures (SOPs)

Instead of modifying monolithic markdown files to track state, the agents interact via standard CLI queries against this specific `outreach` table:

**Discovery Agent Loop:**
1. Fetch existing entries: `node apps/server/cli.js query outreach status Triage` (plus other states to avoid overlaps).
2. Browse the web and discover new agencies.
3. Queue new entries:
   ```bash
   node apps/server/cli.js create outreach '{"target": "Agency Name", "url": "https://...", "hook": "manual vetting", "status": "Triage"}'
   ```

**Enrichment Agent Loop:**
1. Check queue: `node apps/server/cli.js query outreach status Triage`. Pick a lead ID.
2. Conduct deep research and draft the email strictly according to the `enrichment_prompt` rule.
3. Advance the cellar state:
   ```bash
   node apps/server/cli.js update outreach <ID> '{"status": "Ready", "research_data": "Found CEO...", "draft_email": "Hi CEO..."}'
   ```

### Step 3: Required Enhancements to Generic CLI

While the architecture supports infinite workflows, a few missing pieces should be implemented to perfectly accommodate complex workflows like `example.md`:

- **CLI Limit Flags:** The Enrichment agent specifies "taking up to 2 items" at a time. Enhance `cli.js query` with a `--limit X` flag to prevent context window bloat when thousands of leads exist.
- **CLI Wildcard Matching:** The Discovery agent needs all existing targets for its "blocklist". Add a `cli.js get-all <table>` command or allow wildcard queries so it doesn't have to query every status individually.
