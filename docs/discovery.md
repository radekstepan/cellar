# 🕵️‍♂️ Discovery Agent Standard Operating Procedure

**Objective:** Continuously find new recruitment agencies that are not yet in the system and queue them up via the CLI.

## Workflow

### 1. Read & Build Blocklist
Before searching for new leads, you must understand what is already in the pipeline.
Use the generic CLI to query existing targets and avoid adding duplicates. (Hint: check multiple statuses)

```bash
node apps/server/cli.js query outreach status Triage
# Repeat for other statuses like 'Researching', 'Drafting', 'Ready' to build a complete blocklist
```

### 2. Generate Query
Use a "Variety Engine" to create unique search queries combining Niche + Location + Type (e.g., "Legal Headhunters in Toronto").

### 3. Search & Qualify
- Perform web searches (exclude major aggregators like Indeed/LinkedIn).
- Visit agency websites to scan for "Hooks" (keywords: *manual vetting*, *privacy*, *blind hiring*, *high-touch*).

### 4. Queue Leads
Add new, qualified leads into the system using the CLI create command.
Make sure to initialize them with the status `Triage`.

```bash
node apps/server/cli.js create outreach '{"target": "Agency Name", "url": "https://...", "hook": "manual vetting", "status": "Triage"}'
```
