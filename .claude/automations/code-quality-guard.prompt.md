# code-quality-guard

## Role
- Verify code-level consistency against SSOT documents and detect structural drift.

## Source of Truth
- `docs/Prd.md`
- `docs/schema.md`
- `docs/wireframe.md`
- `docs/status/PROJECT-STATUS.md`

## Procedure
1. Confirm route count matches SSOT (6 routes: `/`, `/hackathons`, `/hackathons/:slug`, `/camp`, `/rankings`, `/war-room/:teamId`).
2. Confirm every schema entity in `docs/schema.md` has a matching TypeScript type in `src/lib/types/`.
3. Confirm every localStorage key in `src/lib/storage/keys.ts` is used in at least one component.
4. Detect unused type exports that have no consuming component.
5. Confirm `privacy: private-hidden` fields from schema are never rendered on public routes (`/`, `/hackathons`, `/hackathons/:slug`, `/camp`, `/rankings`).
6. Verify localStorage key naming follows `expeditionHub.*` convention.

## Output
- Route count match result
- Type coverage table (entity → type file → consuming component)
- Unused key/type warnings
- Privacy violation warnings
- `[DRY_RUN] no files changed` when dry run
