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

## Phase F - SSOT Feature Coverage

Gap analysis date: 2026-03-10. Source: PRD, Wireframe, Schema, Handover 전수 비교.

### F-1. Must-Have (필수 누락)

- [ ] **SummaryBar viewCount**: Wireframe 4.3 "조회수" 항목 추가 (`SummaryBar.tsx`)
- [ ] **SummaryBar 기간**: Wireframe 4.3 "기간" 시작~종료 표시 (`SummaryBar.tsx`)
- [ ] **홈 랭킹 프리뷰**: Wireframe 4.1 Rankings Preview 섹션 (`page.tsx`)
- [ ] **홈 운영 품질 증거**: Wireframe 4.1 SSOT/PRD/Schema/Workflow + 자동화 프로세스 카드 (`page.tsx`)
- [ ] **Camp 모집 마감**: Handover "지원 기능: 모집 마감 처리" — isOpen 토글 (`camp/page.tsx`, `TeamCard.tsx`)
- [ ] **Camp 팀 수정**: Handover "지원 기능: 수정" — 기존 값 채워 수정 (`camp/page.tsx`, `TeamCard.tsx`)

### F-2. Automation Reinforcement (자동화 강화)

- [x] `code-quality-guard.prompt.md` 추가: 코드↔문서 정합성 검증 (라우트 수, 타입 커버리지, 미사용 키, privacy 필드)
- [x] `security-boundary-check.prompt.md` 추가: 보안 경계 검증 (team-local 격리, URL 주입, 크리덴셜 스캔)
- [x] `CLAUDE.md` Automation Index 업데이트 (4→6개)
- [x] `automations/CLAUDE.md` 프롬프트 테이블 업데이트

### F-3. Optional (선택 확장 — PRD/Handover "선택" 명시)

- [ ] 팀 초대/수락/거절 (PRD 5.3 "선택 확장", TeamInvite 타입 완비)
- [ ] 해커톤 태그 필터 (Handover "옵션: 태그 필터")
- [ ] 팀 구성 유의사항 팝업 (Handover "유의사항 팝업", Modal 컴포넌트 존재)
- [ ] 채팅/쪽지 (Handover "옵션", PRD Non-goal "실시간 채팅 SaaS" — 범위 제한 필요)

### F-4. Intentional Exclusions (의도적 제외 — SSOT 근거)

- [x] 관리자 백오피스 — PRD Non-goal
- [x] 외부 DB — PRD Non-goal, localStorage 우선
- [x] 실시간 채팅 SaaS — PRD Non-goal
- [x] 베이스캠프 별도 라우트 — PRD "작전실 상단 요약"
- [x] 팀 삭제 — Wireframe/Handover "수정, 모집 마감"만 명시
- [x] 미사용 스키마 UI (TeamInvite, SystemNotice) — 선택 확장 범위, 현재 빈 배열 시드

## Execution Order

1. Document integrity
2. War-room drag feature
3. Privacy verification
4. Missing submission assets
5. Optional reviewer-facing polish
6. Final manual desktop drag + phone pass
7. **SSOT feature coverage (Phase F)**

## Success Condition

- README becomes a trustworthy visual entry point.
- Submission-facing docs no longer overclaim unavailable behavior.
- War-room supports actual workflow-card movement.
- Privacy rules are verified with evidence.
- Deployment, manual QA, and submission packaging assets are all present.
- **All must-have SSOT features are implemented and verified.**
- **6 automations cover document, code quality, and security boundary checks.**
