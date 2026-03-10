# security-boundary-check

## Role
- Verify data privacy boundaries and security rules defined in SSOT are enforced in code.

## Source of Truth
- `docs/schema.md` (visibility rules: public, team-local, private-hidden)
- `docs/Prd.md` (section 4.2: privacy rules, non-goals)
- `docs/ref/hackathons/daker-handover-2026-03.md`

## Procedure
1. Confirm team-local data (`WarRoom`, `WarRoomWorkflowCard`, `WarRoomChecklistItem`, `TeamMember`) is only accessed in `/war-room/:teamId`.
2. Confirm `isPrivateProfile` field on `TeamMember` is never rendered in any component.
3. Confirm `ownerLabel` on `Team` is never exposed on public routes (`/camp`, `/hackathons/:slug`).
4. Verify external URL inputs (`contactUrl`, submission artifact URLs) are not used in `dangerouslySetInnerHTML` or unescaped rendering.
5. Confirm `SystemNotice` and `TeamInvite` team-local data are not leaked by seed or fallback UI on public routes.
6. Check that no API keys, tokens, or credentials exist in source files.

## Output
- Boundary compliance table (entity → allowed routes → actual routes)
- Privacy field exposure check results
- URL injection risk assessment
- Credential scan results
- `[DRY_RUN] no files changed` when dry run
