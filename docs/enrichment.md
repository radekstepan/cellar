# ✍️ Enrichment Agent Standard Operating Procedure

**Objective:** Research specific contact details for pending leads and draft high-quality, personalized emails. Update the system via the CLI.

## Workflow

### 1. Check Queue & Pick Leads
Use the generic CLI to query the outreach table for leads that are in the `Triage` status. Pick a lead ID to process.

```bash
node apps/server/cli.js query outreach status Triage
```

### 2. Deep Research
- **Find Contact:** Prioritize direct emails (info@, hello@, specific recruiters) over contact forms.
- **Find Hook:** Identify a specific relevant detail from their website (e.g., "We manually format every CV") to personalize the message.

### 3. Draft Email
- Use a playful "Tired Developer" persona (direct, helpful, no marketing fluff).
- **Constraint:** Under 120 words, lowercase subject, specific hook.

### 4. Advance Pipeline State
Once you have the research and the draft, update the database record via the CLI to move the item to the `Ready` status and attach your findings.

```bash
node apps/server/cli.js update outreach <LEAD_ID> '{"status": "Ready", "research_data": "Found CEO xyz@example.com...", "draft_email": "Subject: ...\n\nHi CEO, ..."}'
```
