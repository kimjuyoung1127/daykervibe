# automations/

Hackerton automation prompt index for deterministic documentation and evidence maintenance.

## Principles
- Keep every automation deterministic and idempotent.
- Use SSOT as the first comparison target.
- Default to `DRY_RUN=true`.
- Automations maintain docs and evidence, not product code.

## Prompt Files
| File | Purpose | Schedule |
|---|---|---|
| `docs-nightly-organizer.prompt.md` | Organize daily logs and archive candidate notes. | Daily 22:00 KST |
| `code-doc-align.prompt.md` | Check SSOT, PRD, status, and route plan drift. | Daily 03:30 KST |
| `architecture-diagrams-sync.prompt.md` | Check architecture diagram coverage against SSOT and wireframe. | Daily 04:00 KST |
| `automation-health-monitor.prompt.md` | Summarize automation health and lock status. | Daily 09:30 KST |
| `code-quality-guard.prompt.md` | Verify code-level consistency: route count, type coverage, unused keys, privacy fields. | Daily 04:30 KST |
| `security-boundary-check.prompt.md` | Verify data privacy boundaries: team-local isolation, URL injection, credential scan. | Daily 05:00 KST |
