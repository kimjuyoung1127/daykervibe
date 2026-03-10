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

## 2026-03-10 Addendum - UI Polish: Dark Card, Filter, Typography

- `/camp`
  - 필터 UI: 모바일 `<select>` 드롭다운 + 데스크톱 `truncate` 버튼 행
  - TeamCard: `variant="dark"` 적용 (배경 `#252025`, 오렌지 테두리, 크림 텍스트)
  - NEW EXPEDITION 폼: 다크 카드 + input 색상 전환
  - 해커톤 태그 텍스트 강조 (`font-dunggeunmo text-xs font-bold`)
- `/hackathons`
  - 카드 그리드 `lg:grid-cols-3`, 썸네일 `max-h-[160px]`, 패딩 `p-3`
- `/hackathons/:slug`
  - 배너 이미지 데스크톱 `lg:w-3/5 lg:mx-auto`
- `/war-room/:teamId`
  - BASECAMP 카드 `variant="dark"` 적용
  - 워크플로 컬럼 제목, 제출 단계 버튼, 팀 구성 뱃지 텍스트 강조
- `src/components/ui/Card.tsx`
  - `variant` prop 추가 (`default` | `dark`)
- `src/app/globals.css`
  - `--color-dark-card: #252025` 추가

## 2026-03-10 Addendum - Extensibility Implementation

- **공통 컴포넌트 레이어 신규**
  - `src/components/ui/Modal.tsx` — 재사용 가능한 8비트 스타일 모달 (ESC/오버레이 닫기)
  - `src/components/ui/TeamCard.tsx` — camp/detail 두 variant 지원하는 통합 팀 카드
  - `src/lib/format.ts` — 포맷 유틸 중앙화 (6개 파일 중복 제거)
- `/camp`
  - TeamCard를 공용 `TeamCard.tsx`로 교체, 기존 인라인 구현 제거
- `/hackathons/:slug`
  - TeamsSection이 공용 `TeamCard.tsx`로 교체됨
  - SummaryBar, PrizeSection, ScheduleSection이 `src/lib/format.ts` import로 전환
- `/war-room/:teamId`
  - TEAM MEMBERS 섹션 추가, `roleLabel` 칩 표시 (team-local only)
- `/hackathons`, `/rankings`
  - 포맷 함수 import를 `src/lib/format.ts`로 통합
- SSOT 위반으로 의도적 제외:
  - 팀 삭제: Wireframe/Handover가 "수정, 모집 마감 처리"만 명시
  - 랭킹 모달: Schema에 추가 데이터 없음

## 2026-03-10 Addendum - SSOT Gap Features & Automation Reinforcement

- `/`
  - Rankings Preview 섹션 추가: localStorage에서 전체 기간 상위 5명 미니 테이블 렌더링
  - Operations Quality Evidence 섹션 추가: SSOT 문서 4개(PRD, Schema, Wireframe, Architecture) + 자동화 6개 카드 그리드
- `/hackathons/:slug`
  - SummaryBar 5항목 완성: STATUS, 기간(start~end), TEAMS, 조회수(viewCount), PRIZE
  - 기존 D-DAY를 기간 표시로 교체, 그리드 `sm:grid-cols-3 lg:grid-cols-5` 반응형
- `/camp`
  - 팀 수정 기능 추가: TeamCard에 "수정" 버튼 → 폼에 기존 값 채움 → 수정 완료 저장
  - 모집 마감 토글 추가: TeamCard에 "모집 마감"/"모집 재개" 버튼 → `isOpen` 토글 + localStorage 저장
  - 수정 모드시 폼 제목 "EDIT EXPEDITION", 버튼 "수정 완료"로 전환
- 자동화 레이어
  - `code-quality-guard.prompt.md` 추가 (코드↔문서 정합성: 라우트 수, 타입 커버리지, privacy 필드)
  - `security-boundary-check.prompt.md` 추가 (보안 경계: team-local 격리, URL 주입, 크리덴셜 스캔)
  - 자동화 총 6개 (기존 4 + 신규 2)

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
