# Project Status

## 2026-03-10 Addendum - Asset Cleanup & Detail Banner Policy

- Removed unused public assets after full reference audit:
  - Deleted: `link.svg`, `banner.png`, `banner.webp`, `og-image.png`, `Aimers.png`, `monthly.png`, `ranking3.png`
  - Deleted: `design_reference/` directory (8 design PNG files, no code references)
- Changed detail page banner policy:
  - `/hackathons/:slug` no longer uses a hardcoded common banner (`/banner.webp`)
  - Detail hero image now uses each hackathon's `thumbnailUrl` field
  - If `thumbnailUrl` is absent, the image block is hidden and the page renders as a text header with 8-section layout intact
- Removed ghost `war-room.svg` background reference from `/war-room/:teamId` (file never existed, was causing silent 404)
- Current active public assets: `Aimers.webp`, `monthly.webp`, `hacker.png`, `og-image-hero.webp`, `ranking3.webp`, `logo.svg`, `favicon.svg`, `checklist.svg`, `link.svg`→removed, `rocket.svg`, `search.svg`, `team.svg`, `trophy.svg`, `fonts/`
- Validation:
  - `npm run lint` passed
  - `npm run build` passed

## 2026-03-10 Addendum - Asset Loading Optimization

- Reduced first-load image cost without changing the visual font families or requiring new external assets.
- Added local web-delivery derivatives for the heaviest runtime images:
  - `public/og-image-hero.webp`
  - `public/Aimers.webp`
  - `public/monthly.webp`
  - `public/ranking3.webp`
- Home hero uses the dedicated `og-image-hero.webp` with `priority` and explicit `sizes`.
- Home featured cards and `/hackathons` list cards now render `thumbnailUrl` with responsive `sizes`.
- Detail and rankings banners use optimized assets without `priority`, reducing competition with initial text render.
- Converted bundled fonts to web delivery format while keeping the same typefaces:
  - `PressStart2P.woff2` stays preloaded
  - `DungGeunMo.woff2` now uses `preload: false`
- `next.config.ts` images.formats set to `['image/avif', 'image/webp']`
- Validation:
  - `npm run lint` passed
  - `npm run build` passed

## 2026-03-10 Addendum - Self-Review Follow-up Fixes

- Closed the 3 follow-up issues found in self review without weakening SSOT.
- Source-limited hackathons no longer fabricate missing start dates from the current timestamp.
- Missing `eventStartAt` / `registrationStartAt` now render as `미공개` instead of synthetic values.
- Public submit draft import is stricter:
  - text fields advance only their mapped text stage
  - URL fields advance readiness only when the value is a valid `http/https` URL
  - file-style public submit requirements are note-only and do not create fake upload state
- War-room import now keeps invalid URLs and note-only file prep content in notes only, not in readiness stages or artifact links.
- Validation:
  - `npm run lint` passed
  - `npm run build` passed

## 2026-03-10 Addendum - Ended Hackathon Archive Guard

- Re-checked the monthly source-limited detail flow against SSOT and tightened the public archive behavior.
- `ended` hackathons now keep `Teams` and `Submit` sections visible as read-only archive context.
- Ended public detail pages no longer expose:
  - recruiting actions
  - `작전실 이동`
  - `CAMP에서 팀 찾기`
  - public submit draft actions
- Validation:
  - `npm run lint` passed
  - `npm run build` passed

## 2026-03-10 Addendum - SSOT Strict Alignment

- Implemented strict SSOT alignment for public/team-local boundaries and incomplete source cases.
- Public contact links now follow a hard guard:
  - valid public URL -> external contact CTA
  - placeholder or dead demo URL -> `연락처 준비중`
- `/hackathons/:slug` now keeps the required 8-section shell even when bootstrap detail is missing.
- `monthly-vibe-coding-2026-02` now renders as a source-limited detail flow instead of falling back to a generic empty section message.
- Public `Submit Section` now behaves as a minimal draft handoff panel:
  - save browser-local draft
  - move to `/camp?hackathon=:slug` or `/war-room/:teamId`
  - keep team-local submission authority inside the war-room
- `/war-room/:teamId` now imports pending public submit drafts and shows a confirmation notice.
- `WAR ROOM > BASECAMP` white-card summary values were rebalanced to dark readable text with tinted pills instead of low-contrast mint/purple body text.
- Validation:
  - `npm run lint` passed
  - `npm run build` passed

Last Updated: 2026-03-10 (KST)
Focus Hackathon: `daker-handover-2026-03`
Product: `Expedition Hub`

## 2026-03-10 Addendum - Manual QA Status

- Desktop pointer drag sanity pass: completed by the operator
- Real-device phone pass: not completed yet
- Refreshed stale planning/integrity docs:
  - `docs/status/INTEGRITY-REPORT.md`
  - `ai-context/master-plan.md`
- Remaining practical blockers are now submission packaging and real-device evidence, not route implementation coverage

## 2026-03-10 Addendum - Drag and Privacy

- `/war-room/:teamId` now supports zero-dependency workflow card drag-and-drop across columns and within a column.
- Narrow mobile keeps the same workflow movement through compact move controls inside each card instead of requiring touch drag.
- Drag persistence is verified against localStorage by moving cards, reloading, and confirming the new `column` / `order` layout remains.
- Privacy boundary verification passed for the current public routes:
  - `/`
  - `/hackathons`
  - `/hackathons/daker-handover-2026-03`
  - `/camp`
  - `/rankings`
- Verified public-route non-leaks:
  - no `ownerLabel`
  - no `isPrivateProfile`
  - no checklist / team notes panels
  - no team-local artifact links
  - no seeded submission id exposure
- Verified team-local-only route behavior:
  - `/war-room/T-HANDOVER-01` shows checklist, notes, team member list, and artifact links as intended
- Evidence:
  - `docs/evidence/war-room-drag-and-privacy-verification-2026-03-10.md`
  - `docs/evidence/responsive-qa-phase2-playwright-2026-03-10.md`
- Remaining Phase 2 work:
  1. Run one manual phone pass for soft-keyboard compression, contrast, and touch comfort
  2. Finalize Submission 1 copy and align any remaining stale planning docs
  3. Prepare deployment evidence and PDF packaging assets once the product is frozen

## Current Phase
**Phase 2: QA + 확장 — IN PROGRESS**

## Implementation Progress
| Phase | 상태 | 구현 범위 | 비고 |
|-------|------|-----------|------|
| Phase 0: Scaffold | **완료** | 타입, 스토리지, 시딩, 디자인 토큰, 라우트 골격 | localStorage 기반 구조 고정 |
| Phase 1A: 셸 + 공개 페이지 | **완료** | TopNav, Footer, 상태 UI 3종, `/`, `/hackathons`, `/hackathons/:slug` | 상세 8개 섹션 구현 완료 |
| Phase 1B: 협업 + 팀 페이지 | **완료** | `/camp`, `/rankings`, `/war-room/:teamId` | 작전실 내부 구현과 공개 진입 흐름까지 정합화 완료 |
| Phase 2: QA + 확장 | 진행중 | 반응형, 프라이버시 검증, 디자인 고도화, 제출 자산 정리 | 배포 및 제출 체크리스트 남음 |

## Completed Deliverables
- `src/components/ui/*` — Card, StatusBadge, PixelButton, Loading/Empty/Error 상태 UI
- `src/components/layout/*` — TopNav, Footer, PageShell
- `src/app/page.tsx` — 랜딩, 주요 CTA, featured hackathon, 포털 가치 섹션
- `src/app/hackathons/page.tsx` — 해커톤 목록, 상태 필터, 카드 그리드
- `src/app/hackathons/[slug]/page.tsx` — 요약 바, 섹션 탭, 필수 8개 상세 섹션
- `src/components/hackathon/sections/*` — overview / guide / eval / schedule / prize / teams / submit / leaderboard
- `src/app/camp/page.tsx` — 원정대 모집 필터, `?hackathon=:slug` query flow, 생성 폼, 모집 상태 카드, 작전실 열기 CTA
- `src/app/rankings/page.tsx` — 기간 기반 글로벌 랭킹 테이블
- `src/app/war-room/[teamId]/page.tsx` — 베이스캠프 요약, 단계 관리, 제출 준비 허브
- `src/components/hackathon/sections/TeamsSection.tsx` — 상세 팀 카드와 작전실 이동 CTA, `/camp?hackathon=:slug` deep link
- `src/lib/storage/*`, `src/lib/types/*` — schema 정렬된 로컬 저장 및 시드 구조 유지

## Validation Snapshot
- `npm install` 완료
- `npm run build` 통과
- `npm run lint` 통과 (`eslint.config.mjs` 추가, localStorage hydration 패턴 정리)
- `npm run dev -- --hostname 127.0.0.1 --port 3000`는 기존 `next dev` 인스턴스와 `.next/dev/lock` 점유로 완전 검증 보류
- Playwright responsive QA pass completed across `/camp`, `/hackathons/daker-handover-2026-03`, `/war-room/T-HANDOVER-01`
- Same-day responsive fix pass removed the blocking mobile overflow on `/war-room/:teamId` and improved mobile CTA density across `/camp` and detail tabs
- QA evidence recorded in `docs/evidence/responsive-qa-phase2-playwright-2026-03-10.md`

## Canonical Source
- `docs/ref/hackathons/daker-handover-2026-03.md`

## Confirmed Facts
- 개인 참가 가능, 팀 최대 5인
- 제출은 `기획서 -> 웹 URL + GitHub -> PDF` 순서
- 평가 비중은 참가자 30%, 심사위원 70%
- 외부 접속 가능한 배포 URL이 필요
- 심사자 검토에 별도 API 키가 필요하면 불리함
- 전 페이지 공통 상단 이동과 상태 UI 3종이 필요
- 핵심 페이지는 `/hackathons/:slug`
- `teams`는 해커톤과 연결되지 않아도 생성 가능
- 내부 유저 정보, 비공개 정보, 다른 팀 내부 정보는 공개 금지
- 팀 수 `43`, 조회수 `614`, 총상금 `1,000,000원`

## Open Gaps
- 실기기 기준 소프트 키보드 압축과 iOS/Android 뷰포트 차이 최종 확인
- 모바일 대비, 텍스트 밀도, 피로도에 대한 수동 폰 패스 1회
- 데스크톱 실제 포인터 기반 drag-and-drop 수동 확인 1회
- 디자인 고도화(호버, 전환, 시각적 리듬)
- Submission 1 기획서 문안 정리
- Vercel 배포 및 제출 체크리스트 확정
- `docs/status/INTEGRITY-REPORT.md`, `ai-context/master-plan.md` 최신 상태 반영

## Next Actions
1. Run one manual phone pass for soft-keyboard compression, final contrast, and touch comfort.
2. Do one focused browser pass for the stricter public submit handoff flow.
3. Finalize Submission 1 copy and remaining delivery planning docs.
4. Prepare Vercel deployment evidence and PDF packaging assets once the product is frozen.

## Recent Decisions
- 제품 서비스명은 `Expedition Hub`
- 공식 안내가 사용자 수기 명세, PNG, 기존 JSON보다 우선
- 베이스캠프는 별도 라우트가 아니라 작전실 상단 상태 요약으로 처리
- 작전실은 팀 전용 협업 공간이 아니라 제출 준비 관리 허브로 해석
- 기술 스택은 `Next.js + TypeScript + Tailwind + localStorage + Vercel`
- 추가 페이지(프로필, 설정 등) 불필요하며 기존 6개 페이지 완성도에 집중한다
- Next.js 16 / ESLint 9 조합에 맞춰 flat config 기준으로 lint 체계를 유지한다
