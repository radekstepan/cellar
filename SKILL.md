---
name: OpenClaw Pipeline Agent
description: A local-first headless CMS wrapper that allows an AI agent to interact with leads, outreach tasks, and schema structure locally in JSON flat files.
read_when:
  - Interacting with the pipeline spreadsheet
  - Querying leads or tasks via filtering
  - Updating research, emails, and status of records
metadata: {"clawdbot":{"emoji":"🤖","requires":{"bins":["pipeline-agent"]}}}
allowed-tools: Bash(pipeline-agent:*)
---

# Pipeline Interaction with OpenClaw

## Core Workflow

1.  **Always Read Schema First**: If starting a new session, run `pipeline-agent get-schema` to understand the columns, allowed statuses, and AI pipeline rules.
2.  **Query Tasks**: Use `pipeline-agent query <key> <value>` to find records that need your attention.
3.  **Process and Update**: Perform research or draft responses based on the rules, then use `pipeline-agent update` to save your work and change the pipeline status.

## Commands

### 1. Understanding the Environment

```bash
pipeline-agent get-schema    # Fetches the full JSON schema defining columns and AI rules.
```

### 2. Searching the Database

```bash
pipeline-agent query <key> <value>
```
*Example:* `pipeline-agent query status "Needs Research"`
Scans the database and returns a JSON array of all matching records.

### 3. Modifying Records

```bash
pipeline-agent update <id> '<json_fields>'
```
*Example:* `pipeline-agent update lead_01H8X '{"status": "Drafting Email", "research_data": "Found CEO..."}'`
Merges the provided JSON fields into the existing record. The spreadsheet UI will update automatically.

### 4. Creating New Records (If Required)

```bash
pipeline-agent create '<json_fields>'
```
*Example:* `pipeline-agent create '{"target": "Acme Corp", "status": "New"}'`
Creates a brand new record and generates a unique ID if one is not provided.

## Guidelines

- All commands return JSON to standard out.
- Make sure to properly escape quotes in the JSON string argument when using `update` or `create`.
- The `status` field is considered the primary pipeline column. Only update it to values specified in the `schema.json`.