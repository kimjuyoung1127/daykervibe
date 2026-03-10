# Project Status

## 2026-03-10 Addendum - UI Polish: Dark Card, Filter, Typography

- Camp 페이지 필터 UI 개선:
  - 모바일(`< sm`): `<select>` 드롭다운으로 전환 (긴 해커톤 타이틀 대응)
  - 데스크톱(`≥ sm`): 기존 버튼 행 유지 + `truncate max-w-[180px]` 적용
- Card 컴포넌트에 `variant="dark"` 지원 추가:
  - 배경: `--color-dark-card: #252025`, 테두리: `accent-orange/30`
  - 텍스트: `card-white` 계열로 전환
- 다크 카드 적용 대상:
  - `/camp` TeamCard (모집 카드)
  - `/camp` NEW EXPEDITION 폼 (input/select/textarea 포함)
  - `/war-room/:teamId` BASECAMP 카드
- `/hackathons` 카드 그리드 컴팩트화:
  - `lg:grid-cols-3` 추가, 썸네일 `max-h-[160px]`, 카드 패딩 `p-3`
- `/hackathons/:slug` 배너 이미지 데스크톱 축소:
  - `lg:w-3/5 lg:mx-auto` 적용
- 텍스트 가독성 강화:
  - Camp 해커톤 태그: `font-dunggeunmo text-xs font-bold`
  - War Room 워크플로 컬럼 제목: `font-dunggeunmo text-sm font-bold`
  - War Room 제출 단계 버튼 + BASECAMP 뱃지: `font-dunggeunmo text-sm font-bold`
- Validation:
  - `npm run lint` passed
  - `npm run build` passed

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

## 2026-03-10 Addendum - Extensibility Implementation (SSOT-Compliant)

- 확장성 분석(`docs/evidence/extensibility-analysis-2026-03-10.md`)에서 도출한 7개 항목 중 SSOT 준수 5개 구현 완료.
- 구현 완료 항목:
  1. **포맷 유틸 중앙화** — `src/lib/format.ts` 생성, 6개 파일에서 중복 함수(`formatPrize`, `formatDateTime`, `formatDate`, `dDay`, `formatKRW`, `formatPoints`) 제거 및 import 교체. `formatDatetime`/`formatDateTime` 중복도 후속 커밋으로 통합.
  2. **TeamCard 통합** — `src/components/ui/TeamCard.tsx` 생성 (camp/detail variant 지원), `camp/page.tsx`와 `TeamsSection.tsx` 중복 제거.
  3. **Modal 컴포넌트** — `src/components/ui/Modal.tsx` 생성 (ESC 닫기, 오버레이 클릭 닫기, 8비트 디자인 토큰 적용).
  4. **Ended 가드 검증** — TeamsSection + SubmitSection에서 이미 Wireframe Addendum 요구사항 충족 확인.
  5. **역할 칩** — War Room에 TEAM MEMBERS 섹션 추가, `roleLabel` 칩 표시 (team-local only, 공개 노출 없음).
- SSOT 위반으로 의도적 제외:
  - 팀 삭제 — Wireframe/Handover가 "수정, 모집 마감 처리"만 명시
  - 랭킹 모달 — Schema에 추가 데이터 없음, Wireframe은 테이블 형식만 명시
- 영향받은 파일 (12개): `src/lib/format.ts`, `src/components/ui/Modal.tsx`, `src/components/ui/TeamCard.tsx`, `src/app/camp/page.tsx`, `src/app/hackathons/page.tsx`, `src/app/rankings/page.tsx`, `src/app/war-room/[teamId]/page.tsx`, `src/components/hackathon/SummaryBar.tsx`, `src/components/hackathon/sections/PrizeSection.tsx`, `src/components/hackathon/sections/ScheduleSection.tsx`, `src/components/hackathon/sections/TeamsSection.tsx`, `src/lib/hackathon-detail.ts`
- Validation:
  - `npm run lint` passed
  - `npm run build` passed

## 2026-03-10 Addendum - SSOT Gap Features & Automation Reinforcement

- SSOT 전수 비교(PRD, Wireframe, Schema, Handover)로 누락 기능 6개 식별 후 전수 구현 완료.
- 구현 항목:
  1. **SummaryBar 5항목 완성** — viewCount(조회수) + 기간(start~end) 추가. Wireframe 4.3 "상태, 기간, 팀 수, 조회수, 총상금" 정합.
  2. **홈 랭킹 프리뷰** — Wireframe 4.1 "Rankings Preview" 섹션. localStorage에서 전체 기간 상위 5명 렌더링.
  3. **홈 운영 품질 증거** — Wireframe 4.1 "운영 품질 증거" 섹션. SSOT 문서 4개 + 자동화 프로세스 6개 카드 그리드.
  4. **Camp 모집 마감 토글** — Handover "지원 기능: 모집 마감 처리". `isOpen` 토글 버튼으로 모집/마감 전환.
  5. **Camp 팀 수정** — Handover "지원 기능: 수정". 기존 값을 폼에 채워 수정 후 localStorage 저장.
  6. **자동화 강화 (4→6개)** — `code-quality-guard.prompt.md` (코드↔문서 정합성), `security-boundary-check.prompt.md` (보안 경계 검증) 추가.
- 영향받은 파일: `SummaryBar.tsx`, `page.tsx`, `camp/page.tsx`, `TeamCard.tsx`, `.claude/automations/*`, `CLAUDE.md`, `CROSS-CHECK-CHECKLIST.md`
- Phase F 체크리스트 전항 완료. 선택 확장 4개(팀 초대, 태그 필터, 유의사항 팝업, 채팅)는 미구현.
- Validation:
  - `npm run lint` passed
  - `npm run build` passed

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
- `src/components/ui/*` — Card, StatusBadge, PixelButton, Modal, TeamCard, Loading/Empty/Error 상태 UI
- `src/components/layout/*` — TopNav, Footer, PageShell
- `src/app/page.tsx` — 랜딩, 주요 CTA, featured hackathon, 포털 가치 섹션, 랭킹 프리뷰, 운영 품질 증거 섹션
- `src/app/hackathons/page.tsx` — 해커톤 목록, 상태 필터, 카드 그리드
- `src/app/hackathons/[slug]/page.tsx` — 요약 바, 섹션 탭, 필수 8개 상세 섹션
- `src/components/hackathon/sections/*` — overview / guide / eval / schedule / prize / teams / submit / leaderboard
- `src/app/camp/page.tsx` — 원정대 모집 필터, `?hackathon=:slug` query flow, 생성/수정 폼, 모집 마감 토글, 모집 상태 카드, 작전실 열기 CTA
- `src/app/rankings/page.tsx` — 기간 기반 글로벌 랭킹 테이블
- `src/app/war-room/[teamId]/page.tsx` — 베이스캠프 요약, 단계 관리, 제출 준비 허브
- `src/components/hackathon/sections/TeamsSection.tsx` — 상세 팀 카드와 작전실 이동 CTA, `/camp?hackathon=:slug` deep link
- `src/lib/format.ts` — 포맷 유틸 중앙화 (formatPrize, formatDateTime, formatDate, dDay, formatKRW, formatPoints)
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
1. ~~확장성 개선 구현~~ — **완료** (SSOT 준수 5개 구현, 2개 SSOT 위반으로 제외)
2. ~~SSOT 갭 기능 구현~~ — **완료** (필수 6개 전수 구현, 자동화 4→6개 강화)
3. Run one manual phone pass for soft-keyboard compression, final contrast, and touch comfort.
4. Do one focused browser pass for the stricter public submit handoff flow.
5. Finalize Submission 1 copy and remaining delivery planning docs.
6. Prepare Vercel deployment evidence and PDF packaging assets once the product is frozen.

## Recent Decisions
- 제품 서비스명은 `Expedition Hub`
- 공식 안내가 사용자 수기 명세, PNG, 기존 JSON보다 우선
- 베이스캠프는 별도 라우트가 아니라 작전실 상단 상태 요약으로 처리
- 작전실은 팀 전용 협업 공간이 아니라 제출 준비 관리 허브로 해석
- 기술 스택은 `Next.js + TypeScript + Tailwind + localStorage + Vercel`
- 추가 페이지(프로필, 설정 등) 불필요하며 기존 6개 페이지 완성도에 집중한다
- Next.js 16 / ESLint 9 조합에 맞춰 flat config 기준으로 lint 체계를 유지한다
