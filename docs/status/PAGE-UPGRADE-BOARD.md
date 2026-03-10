# Page Upgrade Board

Source of truth for route-level execution status.

| route | label | group | priority | status | must_read_docs | note |
|---|---|---|---|---|---|---|
| `/` | Home Landing | Marketing | P0 | Done | `docs/Prd.md`, `docs/wireframe.md` | 8비트 랜딩 + 포털 진입 구현 완료 |
| `/hackathons` | Hackathon List | Portal | P0 | Done | `docs/Prd.md`, `docs/schema.md` | 상태 필터 포함 멀티 해커톤 목록 구현 완료 |
| `/hackathons/:slug` | Hackathon Detail | Portal | P0 | Done | `docs/ref/hackathons/daker-handover-2026-03.md`, `docs/wireframe.md` | 필수 8개 섹션과 팀 섹션 작전실 이동 흐름, `/camp?hackathon=:slug` deep link 구현 완료 |
| `/camp` | Team Camp | Collaboration | P0 | Done | `docs/schema.md`, `docs/wireframe.md` | 팀 모집 허브, 생성 폼, URL query 기반 해커톤 필터, 작전실 열기 CTA 구현 완료 |
| `/rankings` | Rankings | Portal | P1 | Done | `docs/schema.md` | 글로벌 랭킹 기본형 구현 완료 |
| `/war-room/:teamId` | War Room | Collaboration | P0 | Done | `docs/Prd.md`, `docs/architecture-diagrams.md` | 베이스캠프 + 제출 준비 관리 허브 구현 완료, `/camp`와 상세 팀 섹션에서 진입 가능. 2026-03-10 Playwright QA 이후 모바일 가로 오버플로우 수정 및 재검증 완료 |

## Status Flow
`Ready -> InProgress -> QA -> Done` (`Hold` for blocked work)

## 2026-03-10 Addendum

- `/war-room/:teamId`
  - workflow drag-and-drop is now verified on desktop
  - mobile move controls are the supported narrow-screen fallback
  - public entry flows from `/camp` and `/hackathons/:slug` remain connected
  - route-level privacy checks confirmed that team-local checklist, notes, member list, and artifact links stay inside the war-room route

## 2026-03-10 Addendum - Asset Optimization & Detail Banner Policy

- `/hackathons/:slug`
  - detail hero image now uses each hackathon's `thumbnailUrl` instead of a hardcoded common banner
  - if `thumbnailUrl` is absent, the image block is hidden and the 8-section layout stays intact
- `/`
  - home hero uses `og-image-hero.webp` with `priority` and responsive `sizes`
  - featured cards now render `thumbnailUrl` with responsive `sizes`
- `/hackathons`
  - list cards render `thumbnailUrl` with 2-column-aware `sizes`
- `/rankings`
  - ranking banner uses `ranking3.webp` without `priority`
- `/war-room/:teamId`
  - removed ghost `war-room.svg` background reference (file never existed)
- All pages: font delivery switched to woff2, DungGeunMo preload disabled
- Unused public assets cleaned up (7 files + design_reference/ directory)

## 2026-03-10 Addendum - SSOT Strict Alignment

- `/hackathons/:slug`
  - keeps the 8-section shell even when raw bootstrap detail is missing
  - now uses source-limited panels for incomplete source-backed sections
  - submit section routes users into a minimal draft handoff flow instead of a self-anchor CTA
  - missing source-backed start dates now render as `미공개`
  - file-style public submit requirements are note-only prep fields
  - invalid draft URLs do not advance readiness or create artifacts during war-room import
  - ended hackathons now switch `Teams` and `Submit` into archive/read-only behavior
- `/camp`
  - invalid public contact links no longer navigate to dead external pages
  - scoped camp view can now continue a pending submit draft started on the hackathon detail page
- `/war-room/:teamId`
  - imports pending public submit drafts into team-local state
  - basecamp white-card contrast was aligned with the home-card readability rule
