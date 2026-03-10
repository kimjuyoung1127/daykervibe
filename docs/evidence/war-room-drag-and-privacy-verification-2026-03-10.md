# War-Room Drag and Privacy Verification

- Date: 2026-03-10 KST
- Scope:
  - `/war-room/:teamId` workflow drag-and-drop
  - mobile fallback move controls
  - route-level privacy boundary verification for public vs team-local data

## Summary

- Result: `implemented and verified`
- Workflow cards now support:
  - desktop drag-and-drop across columns
  - desktop drop-based reordering within a column
  - mobile fallback controls with `이전 컬럼`, `다음 컬럼`, `위로`, `아래로`
- Privacy boundary check passed for the currently implemented public routes
- One privacy-adjacent bug was closed during implementation:
  - submission artifacts are now filtered by the current team's submission instead of reading the entire artifact pool into the war-room view

## Implementation Notes

- File changed:
  - `src/app/war-room/[teamId]/page.tsx`
- Persistence model:
  - no new storage keys
  - card moves rewrite `column` and `order`
  - per-column ordering is normalized back to `0..n-1`
- Drag robustness improvement:
  - drag handlers now resolve the active card from either React state or `dataTransfer`
  - this keeps native pointer drag and browser-automation drag on the same path
- Mobile fallback:
  - compact move controls are rendered inside each card on narrow viewports
  - disabled states are applied for impossible moves at list and column boundaries

## Drag Verification

### Desktop drag

- Viewport: `1280x800`
- Seed route: `/war-room/T-HANDOVER-01`
- Verified flow:
  1. Reset localStorage to the seeded baseline
  2. Move `PRD 작성` from `제출 완료` to `기획서 준비`
  3. Reload the route
  4. Confirm the moved card remains in the destination column
- Result:
  - passed
  - moved state persisted after reload

### Mobile fallback controls

- Viewport: `360x800`
- Verified flow:
  1. Confirm control rows render under each workflow card
  2. Use `아래로` to reorder within `제출 완료`
  3. Use `이전 컬럼` to move the card across columns
  4. Reload the route
  5. Confirm the new order and column placement persist
- Result:
  - passed
  - disabled states behaved correctly on first/last card and first/last column edges

### Evidence Artifacts

- `output/playwright/war-room-drag-desktop-1280.png`
- `output/playwright/war-room-mobile-controls-360.png`

## Privacy Boundary Verification

### Static audit

- Checked seed/type/render references for:
  - `ownerLabel`
  - `isPrivateProfile`
  - `TEAM_INVITES`
  - `SYSTEM_NOTICES`
  - war-room notes/checklist/artifact storage usage
- Findings:
  - `ownerLabel` and `isPrivateProfile` exist in stored data, but are not referenced by public route renderers
  - `TEAM_INVITES` and `SYSTEM_NOTICES` are seeded, but not surfaced in current UI
  - public routes do not import or render war-room checklist/notes panels

### Playwright route audit

- Public routes inspected:
  - `/`
  - `/hackathons`
  - `/hackathons/daker-handover-2026-03`
  - `/camp`
  - `/rankings`
- Team-local route inspected:
  - `/war-room/T-HANDOVER-01`

### DOM/text checks

- Public routes did **not** expose:
  - `ownerLabel`
  - `isPrivateProfile`
  - `TEAM NOTES`
  - `CHECKLIST`
  - `README 업데이트 필요`
  - `PRD 최종 검토`
  - `PDF 제출물 준비`
  - `sub-demo`
  - `TEAM_INVITES`
  - `SYSTEM_NOTICES`
  - team member list `김탐험, 이원정, 박모험`
- Public routes did **not** contain the team-local artifact links:
  - `https://docs.google.com/document/d/example`
  - `https://github.com/example/hackathon`
- Team-local route did expose the expected team-only data:
  - checklist section
  - team notes
  - team member list
  - plan/github artifact links
  - current submission id

## Judging Criteria Mapping

- Completeness:
  - closes the documented workflow-card movement gap between plan docs and product behavior
- Implementation quality:
  - zero-dependency drag persistence stays aligned with the browser-local architecture
- Documentation and evidence:
  - route-level privacy rules are now backed by both static audit and browser evidence

## Remaining Notes

- Privacy verification is UI/data-boundary verification, not an authentication model. The demo is still a browser-local seeded product.
- The add-link form still supports a single generic URL entry field. It does not yet expose a kind selector for every `SubmissionArtifact.kind`.
- A manual phone pass is still recommended for final keyboard-compression and contrast checks before submission freeze.

## Self-Review Notes

- No blocking implementation issue was found in the final `lint` / `build` pass after the drag handlers and privacy scoping changes landed.
- Residual verification risk remains on one point:
  - desktop drag persistence was verified through the same `dragstart` / `dragover` / `drop` event path the UI uses, and the operator also confirmed a manual desktop pointer-drag sanity pass
  - real-device phone validation is still missing, so soft-keyboard compression and touch comfort are not signed off in this evidence item
- Documentation follow-up still remains outside this evidence item:
  - resolved on 2026-03-10 by refreshing `docs/status/INTEGRITY-REPORT.md`
  - resolved on 2026-03-10 by refreshing `ai-context/master-plan.md`
