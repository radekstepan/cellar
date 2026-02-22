---
name: Cellar
description: A local-first headless CMS wrapper that allows an AI agent to interact with leads, outreach tasks, and schema structure locally in JSON flat files via the CLI.
read_when:
  - Querying leads or tasks via filtering
  - Updating research, emails, and status of records
metadata: {"clawdbot":{"emoji":"🤖","requires":{"bins":["cellar"]}}}
allowed-tools: Bash(cellar:*)
---

# Cellar Interaction with OpenClaw

## Core Workflow

1.  **Always Read Schema First**: If starting a new session, run `cellar get-schema <table>` (e.g., `cellar get-schema outreach`) to understand the columns, allowed statuses, and AI cellar rules.
2.  **Query Tasks**: Use `cellar query <table> <key> <value> [--limit <limit>]` to find records that need your attention.
3.  **Process and Update**: Perform research or draft responses based on the rules, then use `cellar update` to save your work and change the cellar status.

## Commands

### 1. Understanding the Environment

```bash
cellar get-schema <table>    # Fetches the full JSON schema defining columns and AI rules.
```
*Example:* `cellar get-schema outreach`

### 2. Searching the Database

```bash
cellar get-all <table>
cellar query <table> <key> <value> [--limit <number>]
```
*Example:* `cellar query outreach status "Triage" --limit 2`
Scans the database and returns a JSON array of all matching records. `get-all` retrieves every record.

### 3. Modifying Records

```bash
cellar update <table> <id> '<json_fields>'
```
*Example:* `cellar update outreach lead_01H8X '{"status": "Drafting", "research_data": "Found CEO..."}'`
Merges the provided JSON fields into the existing record. The spreadsheet UI will update automatically.

### 4. Creating New Records (If Required)

```bash
cellar create <table> '<json_fields>'
```
*Example:* `cellar create outreach '{"target": "Acme Corp", "status": "Triage"}'`
Creates a brand new record and generates a unique ID if one is not provided.

## Guidelines

- All commands return JSON to standard out.
- Make sure to properly escape quotes in the JSON string argument when using `update` or `create`.
- The `status` field is considered the primary cellar column. Only update it to values specified in the `schema.json`.