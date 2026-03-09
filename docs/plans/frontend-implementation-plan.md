# Frontend Implementation Plan — Hackerton 운영 포털

## Context
해커톤 운영 포털의 문서(PRD/Schema/Wireframe/Architecture)는 완료됐으나 코드는 0줄 상태. Codex와 협업 중이며, Codex는 프론트엔드 감각이 부족하므로 Claude가 프론트엔드 전체를 주도한다. GameLab 프로젝트의 폴더 CLAUDE.md, 스킬 시스템, 문서 동기화 패턴을 벤치마킹한다.

## 코딩 규칙 (전역)
1. **파일 상단 주석 필수**: 모든 신규 파일 상단에 1~3줄 한국어 기능 설명 주석을 작성한다.
   - `.ts/.tsx`: `// 해커톤 목록 페이지 — localStorage에서 해커톤 데이터를 읽어 카드 그리드로 렌더링`
   - `.css`: `/* 글로벌 스타일 — Tailwind 디렉티브 + 8비트 디자인 토큰 */`
2. **계층 간 파일명 1:1 매핑**: `lib/` 내부에서 types ↔ services ↔ hooks가 동일 도메인명으로 매칭되어야 한다.
   - `lib/types/team.ts` ↔ `lib/services/team.ts` ↔ `lib/hooks/useTeams.ts`
   - 타입 변경 시 service → hook 순서로 동시 업데이트 필수

## 로드맵 검증 결과
- PROJECT-STATUS.md 기준: 문서 Phase 1A 완료, 코드 미착수 → 정확함
- master-plan.md: Phase 2 "앱 골격 초기화" 다음 단계 → 올바름
- PAGE-UPGRADE-BOARD: 6개 라우트 모두 `Ready` 상태 → 구현 시작 가능
- 데모 JSON 4개 확인 완료, Schema 12개 엔티티와 매핑 필요

---

## 1. 폴더 구조 (frontend 단일 패키지)

> **결정**: backend/ 분리 없이 `frontend/src/lib/` 안에 모든 로직을 둔다.
> 지금 대회는 서버가 핵심이 아니고, localStorage 기반 프론트 앱이 핵심이다.
> 구조 욕심내다 빌드 깨지는 게 제일 손해. 진짜 백엔드 필요 시 그때 분리한다.

```
hackerton/
  frontend/                           # === 단일 Next.js 앱 ===
    CLAUDE.md                         # FE 규칙
    package.json
    next.config.ts
    tailwind.config.ts
    tsconfig.json
    public/
      seed/
        normalized/                   # SSOT 기준 정규화된 시드 데이터 (진실 소스)
          hackathons.json
          hackathon-sections.json
          teams.json
          leaderboard.json
          rankings.json
          war-rooms.json
          submissions.json
          system-notices.json
        raw/                          # hackathonsjson/ 원본 (참고자료만)
          public_hackathons.json
          public_hackathon_detail.json
          public_teams.json
          public_leaderboard.json
    src/
      app/
        layout.tsx                    # 루트 레이아웃 (다크 배경, TopNav, 시드)
        page.tsx                      # / 랜딩
        hackathons/
          page.tsx                    # /hackathons 목록
          [slug]/
            page.tsx                  # /hackathons/:slug 상세 (핵심 페이지)
        camp/
          page.tsx                    # /camp 팀 모집
        rankings/
          page.tsx                    # /rankings 글로벌 랭킹
        war-room/
          [teamId]/
            page.tsx                  # /war-room/:teamId 작전실
        not-found.tsx
      components/
        layout/
          TopNav.tsx                  # 글로벌 네비게이션 바
          Footer.tsx                  # 하단 푸터
          PageShell.tsx               # Loading/Empty/Error 3상태 래퍼
          NoticeBanner.tsx            # 글로벌/해커톤별 알림 배너
        shared/
          PixelCard.tsx               # 8비트 스타일 카드
          StatusBadge.tsx             # 상태 배지 (upcoming/ongoing/ended)
          PixelButton.tsx             # 8비트 스타일 버튼
          EmptyState.tsx              # 데이터 없음 상태
          LoadingState.tsx            # 로딩 상태
          ErrorState.tsx              # 에러 상태
          FilterBar.tsx               # 재사용 필터 바
          DataTable.tsx               # 재사용 데이터 테이블
          SectionNav.tsx              # 상세 페이지 섹션 앵커 탭
          ProgressSteps.tsx           # 제출 단계 스테퍼
          Modal.tsx                   # 범용 모달
        forms/
          TeamForm.tsx                # 팀 생성/수정 폼
          SubmissionForm.tsx          # 링크 제출 폼 (URL 전용, 파일 업로드 없음)
          ChecklistForm.tsx           # 체크리스트 항목 추가 폼
        landing/
          HeroSection.tsx             # 8비트 히어로 + 3개 CTA
          FeaturedHackathons.tsx      # 추천 해커톤 카드
          ValueSection.tsx            # 포털 가치 제안 5개 카드
          RankingsPreview.tsx         # 상위 랭킹 미리보기
          EvidenceSection.tsx         # 운영 품질 증거 섹션
      lib/
        types/                        # 엔티티 타입 정의
          index.ts                    # barrel export
          hackathon.ts                # Hackathon + HackathonSection
          team.ts                     # Team + TeamMember + TeamInvite
          warRoom.ts                  # WarRoom + WarRoomChecklistItem
          submission.ts               # Submission + SubmissionArtifact
          leaderboard.ts              # LeaderboardEntry
          ranking.ts                  # RankingProfile
          systemNotice.ts             # SystemNotice
          visibility.ts               # public/team-local/private-hidden
        services/                     # CRUD 서비스 (순수 함수, React 없음)
          hackathon.ts
          team.ts
          warRoom.ts
          submission.ts
          leaderboard.ts
          ranking.ts
          systemNotice.ts
        storage/                      # localStorage 추상화
          localStorage.ts             # get<T>/set<T>/remove 제네릭 헬퍼
          keys.ts                     # hackerton.* 키 상수 11개
          seed.ts                     # 첫 방문 시 normalized JSON → localStorage
        hooks/                        # React 훅 (services 래핑)
          useHackathons.ts
          useHackathonDetail.ts
          useTeams.ts
          useWarRoom.ts
          useSubmission.ts
          useLeaderboard.ts
          useRankings.ts
          useSystemNotices.ts
        utils/                        # 공유 유틸
          date.ts                     # KST 날짜 포맷
          privacy.ts                  # private-hidden 필드 필터
          id.ts                       # nanoid/UUID 생성
      styles/
        globals.css                   # Tailwind 디렉티브 + 8비트 커스텀 토큰
        tokens.ts                     # 디자인 토큰 JS 상수
```

### 계층 매핑 (lib/ 내부)

| hooks (React) | services (순수 함수) | types (인터페이스) |
|---|---|---|
| `useHackathons.ts` | `hackathon.ts` | `hackathon.ts` |
| `useTeams.ts` | `team.ts` | `team.ts` |
| `useWarRoom.ts` | `warRoom.ts` | `warRoom.ts` |
| `useSubmission.ts` | `submission.ts` | `submission.ts` |
| `useLeaderboard.ts` | `leaderboard.ts` | `leaderboard.ts` |
| `useRankings.ts` | `ranking.ts` | `ranking.ts` |
| `useSystemNotices.ts` | `systemNotice.ts` | `systemNotice.ts` |

---

## 2. 구현 단계 (Claude 프론트엔드 전담)

### Phase 0: 스캐폴드 (1일차)
- [ ] `npx create-next-app@latest frontend --typescript --tailwind --app --src-dir`
- [ ] `tailwind.config.ts` 디자인 토큰 설정 (색상: #171314, #F08A24, #F7D64A, #98F0E1, #FF79C9, #A98DF8, #F7F1E8)
- [ ] `globals.css` 다크 배경 기본, 픽셀 보더 유틸리티
- [ ] `lib/types/*.ts` — 12개 엔티티 인터페이스 도메인별 분리 (`docs/schema.md` 기반)
- [ ] `lib/storage/keys.ts` + `localStorage.ts` + `seed.ts`
- [ ] `lib/services/*.ts` — 7개 도메인 CRUD 서비스 스텁
- [ ] `lib/utils/*.ts` — date, privacy, id 유틸
- [ ] 정규화 시드 생성: `hackathonsjson/` 원본 → SSOT 기준 보정 → `public/seed/normalized/*.json`
- [ ] `hackathonsjson/` 원본은 `public/seed/raw/`에 참고용 복사
- [ ] `frontend/CLAUDE.md` 작성
- [ ] 루트 `layout.tsx` — 시드 호출 + TopNav 렌더
- [ ] Vercel 배포 파이프라인 확인

### Phase 1: 코어 페이지 (2-4일차) — P0 필수

**1a. 글로벌 셸**
- [ ] `TopNav.tsx` — 메인/Hackathons/Camp/Rankings 링크, 반응형 햄버거
- [ ] `PageShell.tsx` — isLoading/isEmpty/error 3상태 (심사 채점 항목)
- [ ] `NoticeBanner.tsx` — SystemNotice 기반 글로벌/해커톤별 알림 배너
- [ ] `Footer.tsx` — 하단 푸터 + "데모 데이터 초기화" 버튼

**1b. 랜딩 `/`**
- [ ] `HeroSection.tsx` — 8비트 히어로 + 3개 CTA
- [ ] `FeaturedHackathons.tsx` — 모집중/종료 해커톤 카드
- [ ] `ValueSection.tsx` — 포털 가치 5개 카드
- [ ] `RankingsPreview.tsx` — 상위 3~5위
- [ ] `EvidenceSection.tsx` — 운영 품질 증거 (SSOT/PRD/Schema/Automation)

**1c. 해커톤 목록 `/hackathons`**
- [ ] `useHackathons` 훅
- [ ] PixelCard 그리드 (제목, 상태배지, 태그, 기간, 팀수)
- [ ] 상태 필터

**1d. 해커톤 상세 `/hackathons/:slug`** ⭐ 핵심 페이지
- [ ] 상단 요약 바 (상태/기간/팀수/조회수/상금)
- [ ] `SectionNav` — 8개 섹션 앵커 탭
- [ ] 개요 / 안내 / 평가 / 일정 / 상금 / 팀 / 제출 / 리더보드 섹션
- [ ] 팀 섹션 버튼 2개: "팀 찾기" → `/camp?hackathon=:slug`, "이 해커톤으로 팀 만들기" → `/camp?hackathon=:slug&mode=create` (폼 바로 열림)
- [ ] 제출 섹션: 가이드 + `SubmissionForm` (링크 제출형 MVP) + 상태 표시
- [ ] 리더보드에서 미제출 "Not Submitted" 표시

**1e. 캠프 `/camp`**
- [ ] 필터 바 (전체 / 특정 해커톤)
- [ ] 팀 카드 리스트 (이름, 소개, 모집상태, 포지션, 연락처)
- [ ] 팀 생성 모달 `TeamForm` (query `mode=create` 시 자동 오픈)

**1f. 랭킹 `/rankings`**
- [ ] `DataTable` (rank, nickname, points, activity)
- [ ] 기간 필터 (7d/30d/all)

**1g. 작전실 `/war-room/:teamId`**
- [ ] 팀 요약 카드
- [ ] `ProgressSteps` 제출 단계 (teaming→planning→web→pdf→done)
- [ ] 체크리스트 보드 (todo/doing/done 토글 + 추가)
- [ ] 팀 메모 (textarea → localStorage 저장)
- [ ] 링크 관리 (SubmissionArtifact URL 목록)
- [ ] 팀원 + 초대 상태

### Phase 2: 폴리시 (5-6일차) — 심사 품질

- [ ] 디자인 일관성 패스 (픽셀 보더, 컬러 토큰 통일)
- [ ] 반응형 정밀 조정 (Desktop 2-3컬럼 / Tablet 스택 / Mobile 1컬럼)
- [ ] 팀 초대/수락/거절 플로우
- [ ] 시드 데이터 보강 (더 많은 팀, 랭킹, 체크리스트)
- [ ] 프라이버시 감사 — private-hidden 필드 렌더 금지 확인
- [ ] React Error Boundary
- [ ] localStorage 새로고침 생존 테스트

### Phase 3: 배포 + 증빙 (7일차)

- [ ] Vercel 최종 배포
- [ ] 스크린샷 → PDF 증빙
- [ ] PROJECT-STATUS.md 동기화
- [ ] daily log 작성

---

## 3. Claude vs Codex 역할 분담

| 영역 | 담당 | 이유 |
|------|------|------|
| `src/app/**` 페이지 | **Claude** | 시각 디자인 + UX 흐름 |
| `src/components/**` | **Claude** | 8비트 미학 + 반응형 |
| `src/lib/hooks/*.ts` | **Claude** | React 상태 관리 |
| `src/styles/*` | **Claude** | 디자인 토큰 + Tailwind |
| `src/lib/types/*.ts` | **Codex** | 스키마 → 타입 변환 |
| `src/lib/services/*.ts` (CRUD) | **Codex** | 순수 함수, React 없음 |
| `src/lib/storage/*.ts` | **Codex** | localStorage 추상화 |
| `src/lib/utils/*.ts` | **Codex** | 날짜/ID/프라이버시 유틸 |
| `public/seed/normalized/*.json` | **공동** | SSOT 기준 정규화 |
| `frontend/CLAUDE.md` | **Claude** | FE 영역 규칙 |

---

## 4. 핵심 아키텍처 결정

### localStorage 서비스 3계층 (`src/lib/` 내부)
1. **Raw Storage** (`storage/localStorage.ts`) — typed get/set/remove
2. **Entity Services** (`services/*.ts`) — CRUD + visibility 필터
3. **React Hooks** (`hooks/*.ts`) — `{ data, isLoading, error }` 패턴

### 시딩 전략
- **정규화 시드 우선**: `public/seed/normalized/*.json`이 앱의 진실 소스
  - SSOT(`docs/ref/hackathons/daker-handover-2026-03.md`) 기준으로 수동 보정된 데이터
  - `hackathonsjson/` 원본은 `public/seed/raw/`에 참고자료로만 보관
- `hackerton.__seeded` 플래그 확인 → 없으면 `normalized/*.json` fetch → localStorage 저장
- 정규화 시 JSON 필드 매핑: `teamCode`→`id`, `contact.url`→`contactUrl`, `period.*`→`eventStartAt/eventEndAt`
- 추가 생성: WarRoom, ChecklistItem, Submission, RankingProfile, SystemNotice

### 제출 폼 (MVP 잠금)
- **링크 제출형만 지원** — 파일 업로드 UI 없음
- 입력 필드: `planUrl`, `webUrl`, `githubUrl`, `pdfUrl`, `notes`
- "허용 형식: URL (text/url)" 안내 텍스트만 표시
- 이유: 실제 대회도 text/url/pdf 축. localStorage에 파일 저장은 실익 없음

### 해커톤 상세 → 팀 생성 흐름
- 상세 페이지 팀 섹션에 버튼 2개:
  1. **팀 찾기** → `/camp?hackathon=:slug`
  2. **이 해커톤으로 팀 만들기** → `/camp?hackathon=:slug&mode=create`
- `/camp` 페이지: `mode=create` query 감지 시 `TeamForm` 모달 자동 오픈
- 이유: "해커톤 상세에서도 팀 생성 가능" 요구 충족

### 프라이버시
- Entity 서비스 계층에서 `private-hidden` 필드 제거 후 반환
- `team-local` 데이터는 해당 teamId 컨텍스트에서만 접근

### 재사용성
- 해커톤 slug 기반 피벗 — 하드코딩 없음
- `HackathonSection.type`으로 동적 섹션 렌더링
- JSON 시드 교체만으로 다른 해커톤 지원

---

## 5. GameLab 벤치마킹 적용 항목

| GameLab 패턴 | hackerton 적용 |
|---|---|
| 폴더별 CLAUDE.md | `frontend/CLAUDE.md` (단일 패키지이므로 1개) |
| Source of Truth Docs | 이미 적용됨 (docs/ 구조) |
| Automation prompts | 이미 4개 설정됨 |
| Completion Format | 작업 종료 시 Scope/Files/Validation/Sync/Risks/Next |
| Subagent Rules | 탐색은 서브에이전트, 변경은 메인에서 |
| Quick Commands | `cd frontend && npm run build` / `npm run dev` |
| BE↔FE 1:1 미러 | `lib/types/*.ts` ↔ `lib/services/*.ts` ↔ `lib/hooks/*.ts` (단일 패키지 내 계층 매핑) |

---

## 6. 검증 방법

1. **빌드**: `cd frontend && npm run build` — 에러 0
2. **Dev 서버**: `npm run dev` → 6개 라우트 수동 확인
3. **시딩**: 브라우저 localStorage 초기화 → 새로고침 → 데이터 자동 로드 확인
4. **3상태 UI**: 각 페이지에서 Loading/Empty/Error 상태 전환 확인
5. **프라이버시**: DevTools에서 private-hidden 필드가 렌더 DOM에 없는지 확인
6. **반응형**: Chrome DevTools 디바이스 모드 (Desktop/Tablet/Mobile)
7. **Vercel 배포**: 배포 URL로 외부 접근, API 키 없이 동작 확인

---

## 7. 디자인 레퍼런스 (페이지별 6장)

| 파일 | 대상 라우트 | 핵심 참조 포인트 |
|------|-----------|----------------|
| `public/design_reference/landing_page.png` | `/` | 히어로 레이아웃, 3 CTA 버튼, 해커톤 카드 캐러셀, 포털 기능 5개 아이콘, 푸터 CTA |
| `public/design_reference/hackathon_listing.png` | `/hackathons` | 카드 그리드 (3열), 상태 필터 탭, 상태배지+태그+기간+팀수+상금 카드 구성, 페이지네이션 |
| `public/design_reference/hackathon_detail.png` | `/hackathons/:slug` | 상단 요약 바 5칸, 8섹션 탭 네비, 평가 루브릭 테이블, FIND TEAM/CREATE TEAM 버튼 |
| `public/design_reference/camp_recruitment.png` | `/camp` | 해커톤 필터 바, 2열 팀 카드, 모집상태 배지, 포지션 태그, 연락하기 버튼, CREATE TEAM FAB |
| `public/design_reference/rankings.png` | `/rankings` | 기간 필터 (7D/30D/ALL TIME), 상위 3명 포디엄 카드, 테이블 (rank/avatar/nickname/points/status) |
| `public/design_reference/war_room.png` | `/war-room/:teamId` | 팀 요약+데드라인 카운터, 5단계 스테퍼, 칸반 3열 (Backlog/Engaged/Secured), 전술 노트, 링크 관리 |
| `public/design_reference/1.png` | (전체) | 8비트 컴포넌트 스타일 원본 — 픽셀 보더, 카드 형태, 컬러 조합 참조 |

## 8. 폰트

| 폰트 | 용도 | 파일 경로 |
|------|------|----------|
| **Press Start 2P** | 영문 타이틀, 섹션 헤더, 버튼 라벨 (8비트 감성) | `public/fonts/press-start-2p/PressStart2P.ttf` |
| **DungGeunMo (둥근모)** | 한글 타이틀, 본문, UI 텍스트 (한글 픽셀) | `public/fonts/DungGeunMo/DungGeunMo.ttf` |

### 적용 규칙
- `layout.tsx`에서 `next/font/local`로 로드
- CSS 변수: `--font-pixel-en` (Press Start 2P), `--font-pixel-kr` (DungGeunMo)
- 타이틀/헤더: 영문은 Press Start 2P, 한글은 DungGeunMo
- 본문/소형 텍스트: DungGeunMo 또는 시스템 sans-serif fallback

## 9. 핵심 문서 (구현 시 참조)

- `docs/schema.md` — 12개 엔티티 정의 (타입 생성 기반)
- `docs/wireframe.md` — 페이지별 와이어프레임
- `docs/ref/hackathons/daker-handover-2026-03.md` — SSOT
- `hackathonsjson/*.json` — 시드 데이터 원본
