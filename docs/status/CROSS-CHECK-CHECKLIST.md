# Cross-Check Checklist

Last Updated: 2026-03-10 (KST)
Scope: document-to-product cross-check, remaining feature decisions, missing submission assets

## Decisions Locked

- [x] README should be upgraded as a visual entry document, not left as a plain link list.
- [x] War-room workflow card drag should be added as a scoped Phase 2 enhancement.
- [x] Drag scope is limited to moving workflow cards across columns in `/war-room/:teamId`.
- [x] Privacy verification, deployment evidence, and submission assets remain mandatory even if drag is added.

## Why These Decisions

- README is currently the fastest repo entry point but still contains stale workspace links and low visual guidance.
- The product docs repeatedly describe workflow-card movement, and the current product only supports card creation plus stage changes.
- Adding scoped drag closes the largest remaining product-vs-doc behavior gap without expanding into chat, invites flow UI, or multi-user sync.
- Drag must stay narrow: localStorage persistence, single-user browser state, no multiplayer assumptions.

## Phase A - Document Integrity

- [x] Fix stale absolute links in `README.md` so every local path matches this workspace.
- [x] Add Mermaid diagrams to `README.md` for:
  - route map
  - public flow -> camp -> war-room flow
  - document/evidence map
- [x] Add a concise "Current Build Status" section to `README.md`.
- [x] Update `docs/status/INTEGRITY-REPORT.md` from bootstrap-time wording to current implementation reality.
- [x] Update `ai-context/master-plan.md` so it no longer says implementation has not started.
- [x] Reconcile `docs/plans/expedition-hub-submission-1-draft.md` with actual implementation.
  - added a drag implementation note now that workflow movement is shipped
  - added a scope note that the link form does not yet expose every artifact kind as a selectable UI option

## Phase B - Product Alignment

- [x] Add war-room workflow card drag-and-drop between columns.
- [x] Persist dragged card column/order to localStorage.
- [x] Verify drag works on seeded team `T-HANDOVER-01`.
- [x] Decide whether drag also needs keyboard-accessible move controls in the same pass.
  - Decision: no separate keyboard reorder UI in this pass; mobile-safe move controls are the supported fallback path.
- [x] Re-check responsive behavior after drag UI is introduced.
- [x] Run one manual desktop pointer-drag sanity pass before submission freeze.

## Phase C - Privacy and Data Boundary

- [x] Verify `private-hidden` fields never render on public routes.
- [x] Verify team-local data only appears in `/war-room/:teamId`.
- [x] Confirm `ownerLabel` on public `Team` never leaks into `/camp` or `/hackathons/:slug`.
- [x] Confirm `TeamMember.isPrivateProfile` is never rendered.
- [x] Confirm `SystemNotice`, `TeamInvite`, and other team-local data are not accidentally surfaced by seed or fallback UI.

## Phase D - Submission Assets Still Missing

- [ ] Create deployment evidence once Vercel URL exists.
- [ ] Add a dedicated deployment checklist/evidence doc.
- [ ] Add one manual phone-pass evidence item for:
  - soft keyboard compression
  - contrast
  - touch comfort
  - Status: not completed yet because no real-device pass was run
- [ ] Produce final Submission 1 copy asset from the current draft.
- [ ] Prepare PDF source outline or capture list for final PDF packaging.
- [ ] Decide whether root images `Hackathon-UI-Flow.png` and `memo.png` are submission assets or internal leftovers.

## Phase E - Nice To Have After Core Gaps

- [ ] Consider public submission-status summary wiring from stored `Submission` data if submission docs still require stronger reviewer-facing visibility.
- [ ] Consider team/invite status summary UI only if it is needed for judging clarity.
- [ ] Consider NoticeBanner/SystemNotice UI only if it supports judging or handoff clarity.

## Execution Order

1. Document integrity
2. War-room drag feature
3. Privacy verification
4. Missing submission assets
5. Optional reviewer-facing polish
6. Final manual desktop drag + phone pass

## Success Condition

- README becomes a trustworthy visual entry point.
- Submission-facing docs no longer overclaim unavailable behavior.
- War-room supports actual workflow-card movement.
- Privacy rules are verified with evidence.
- Deployment, manual QA, and submission packaging assets are all present.
