---
name: OpenClaw Pipeline Agent
description: A local-first headless CMS wrapper that allows an AI agent to interact with leads, outreach tasks, and schema structure locally in JSON flat files via the CLI.
read_when:
  - Interacting with the pipeline spreadsheet
  - Querying leads or tasks via filtering
  - Updating research, emails, and status of records
metadata: {"clawdbot":{"emoji":"🤖","requires":{"bins":["pipeline-agent"]}}}
allowed-tools: Bash(pipeline-agent:*)
---

# Pipeline Interaction with OpenClaw

## Core Workflow

1.  **Always Read Schema First**: If starting a new session, run `pipeline-agent get-schema <token>` (e.g., `pipeline-agent get-schema outreach`) to understand the columns, allowed statuses, and AI pipeline rules.
2.  **Query Tasks**: Use `pipeline-agent query <token> <key> <value> [--limit <limit>]` to find records that need your attention.
3.  **Process and Update**: Perform research or draft responses based on the rules, then use `pipeline-agent update` to save your work and change the pipeline status.

## Commands

### 1. Understanding the Environment

```bash
pipeline-agent get-schema <token>    # Fetches the full JSON schema defining columns and AI rules.
```
*Example:* `pipeline-agent get-schema outreach`

### 2. Searching the Database

```bash
pipeline-agent get-all <token>
pipeline-agent query <token> <key> <value> [--limit <number>]
```
*Example:* `pipeline-agent query outreach status "Triage" --limit 2`
Scans the database and returns a JSON array of all matching records. `get-all` retrieves every record.

### 3. Modifying Records

```bash
pipeline-agent update <token> <id> '<json_fields>'
```
*Example:* `pipeline-agent update outreach lead_01H8X '{"status": "Drafting", "research_data": "Found CEO..."}'`
Merges the provided JSON fields into the existing record. The spreadsheet UI will update automatically.

### 4. Creating New Records (If Required)

```bash
pipeline-agent create <token> '<json_fields>'
```
*Example:* `pipeline-agent create outreach '{"target": "Acme Corp", "status": "Triage"}'`
Creates a brand new record and generates a unique ID if one is not provided.

## Guidelines

- All commands return JSON to standard out.
- Make sure to properly escape quotes in the JSON string argument when using `update` or `create`.
- The `status` field is considered the primary pipeline column. Only update it to values specified in the `schema.json`.