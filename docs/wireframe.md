# Expedition Hub Wireframe

## 2026-03-11 Camp CRUD and State UI Addendum

- `/camp`
  - 생성 폼과 수정 폼은 같은 화면에서 동작한다
  - 폼 필수 입력에는 `모집중 여부`가 포함된다
  - 커스텀 팀만 `수정`, `모집 마감` 액션을 가진다
  - 시드 공개 팀은 계속 읽기 전용 공개 카드로 남는다
- Common states
  - 핵심 6개 라우트는 `LoadingState`, `EmptyState`, `ErrorState`를 모두 가질 수 있다
  - not found는 detail / war-room에서 `ErrorState`로 유지한다
- Design references
  - 2026-03-10에 정적 `public/design_reference/*` 이미지는 제거됐다
  - 현재 와이어프레임 확인 기준은 라이브 라우트 구현과 `docs/evidence/*` 캡처다

## 2026-03-10 SSOT Strict Alignment Addendum

- `/hackathons/:slug`
  - keeps the required 8-section layout even when some source detail is missing
  - missing source-backed detail must render as an intentional limited-state panel, not a generic blank fallback
- `Teams` section
  - active hackathons may expose `작전실 이동`
  - ended hackathons keep the team cards read-only and do not expose recruiting actions
  - contact CTA rules:
    - valid public link: `연락하기`
    - invalid or unavailable link: `연락처 준비중`
- `Submit` section
  - remains visible on the public detail page
  - now acts as `제출 가이드 + 최소 제출 패널 + 다음 행동 연결`
  - ended hackathons switch this panel to an archive/read-only state instead of showing draft actions
  - missing source-backed start dates render as `미공개`
  - file-style public submit requirements use note-only prep fields, not real uploads
  - invalid URL draft values do not advance submit readiness
  - primary action routes:
    - exactly one local team for the hackathon: `/war-room/:teamId`
    - zero or multiple local teams: `/camp?hackathon=:slug`
- `/war-room/:teamId`
  - basecamp summary uses dark readable text on white-card surfaces
  - workflow board supports desktop drag-and-drop and mobile move-button fallback
  - when a public submit draft exists, the war-room shows an import notice after it absorbs that draft

Last Updated: 2026-03-11 (KST)

## Design References
| 페이지 | 레퍼런스 파일 |
|--------|-------------|
| `/` 랜딩 | 라이브 구현 + `docs/evidence/responsive-qa-phase2-playwright-2026-03-10.md` |
| `/hackathons` 목록 | 라이브 구현 + `docs/evidence/responsive-qa-phase2-playwright-2026-03-10.md` |
| `/hackathons/:slug` 상세 | 라이브 구현 + `docs/evidence/responsive-qa-phase2-playwright-2026-03-10.md` |
| `/camp` 원정대 모집 | 라이브 구현 + `docs/evidence/responsive-qa-phase2-playwright-2026-03-10.md` |
| `/rankings` 랭킹 | 라이브 구현 |
| `/war-room/:teamId` 작전실 | 라이브 구현 + `docs/evidence/war-room-drag-and-privacy-verification-2026-03-10.md` |
| 공통 컴포넌트 스타일 | `src/components/ui/*`, `src/app/globals.css` |

## 1. 디자인 방향
- 8비트 게이머 감성
- 랜딩은 롱스크롤 쇼케이스
- 포털은 운영 가독성 우선
- 픽셀 보더, 스티커 같은 컬러 카드, 블랙 배경 섹션, 밝은 카드 박스 조합

## 2. Foundations
### 2.1 Color
- Background Dark: `#171314`
- Orange: `#F08A24`
- Yellow: `#F7D64A`
- Mint: `#98F0E1`
- Pink: `#FF79C9`
- Purple: `#A98DF8`
- White Card: `#F7F1E8`
- Border Dark: `#1A1A1A`

### 2.2 Typography
- **영문 타이틀/헤더**: `Press Start 2P` (`public/fonts/press-start-2p/PressStart2P.woff2`, source assets 함께 보존)
- **한글 타이틀/본문**: `DungGeunMo` (`public/fonts/DungGeunMo/DungGeunMo.woff2`, source assets 함께 보존)
- Body: DungGeunMo 또는 시스템 sans-serif fallback
- Small: compact pixel-inspired label text

### 2.3 Component Mood
- 강한 외곽선
- 낮은 라운드 또는 모서리 잘린 카드
- 상태 배지와 CTA가 명확한 게임 UI 느낌

## 3. Global Layout
- Top navigation:
  - 메인
  - Hackathons
  - Camp
  - Rankings
- Common states:
  - 로딩중...
  - 데이터 없음
  - 에러

## 4. Page Wireframes
### 4.1 Home (`/`)
- Hero
  - `Expedition Hub` 서비스명
  - 한 줄 소개
  - 주요 CTA 3개
- Featured Hackathons
  - 모집중 / 종료 카드
- Portal Value Section
  - 해커톤 탐색, 원정대 구성, 베이스캠프, 작전실, 평가 이해
- Rankings Preview
- 운영 품질 증거 섹션
  - SSOT / PRD / Schema / Workflow 카드
- Footer CTA

### 4.2 Hackathons (`/hackathons`)
- 헤더
  - 페이지 타이틀
  - 선택 필터 영역
- 해커톤 카드 리스트
  - 제목
  - 상태
  - 태그
  - 시작일
  - 종료일
  - 참가자수
- 카드 클릭 -> 상세

### 4.3 Hackathon Detail (`/hackathons/:slug`)
- 상단 요약 바
  - 상태
  - 기간
  - 팀 수
  - 조회수
  - 총상금
- 섹션 네비
  - 개요
  - 안내
  - 평가
  - 일정
  - 상금
  - 팀
  - 제출
  - 리더보드
- 각 섹션은 카드형 모듈
- 팀 섹션 CTA
  - 원정대 만들기
  - 원정대 찾기
  - 초대/수락/거절 버튼 영역
- 제출 섹션
  - 가이드
  - 상태
  - 최소 폼
- 리더보드
  - 점수 설명
  - 미제출 상태

### 4.4 Camp (`/camp`)
- 필터 바
  - 전체 / 특정 해커톤
- 원정대 리스트 카드
  - 원정대명
  - 소개
  - 모집 상태
  - 모집 포지션
  - 연락 링크
- 원정대 생성 폼
  - 원정대명
  - 소개
  - 모집중 여부
  - 모집 포지션
  - 연락 링크

### 4.5 Rankings (`/rankings`)
- 타이틀
- 기간 필터
- 글로벌 랭킹 테이블
  - rank
  - nickname
  - points
  - activity summary

### 4.6 War Room (`/war-room/:teamId`)
- 베이스캠프 요약 카드
  - 원정대명
  - 연결된 해커톤
  - 현재 제출 단계
  - 다음 해야 할 일
  - 멤버 참여 상태
- 제출 단계 상태 카드
- 작전실 워크플로우 보드
  - `기획서 준비`
  - `웹 제출 준비`
  - `PDF 준비`
  - `제출 완료`
- 체크리스트 보드
- 팀 메모
- 링크 관리
- 팀원 상태/초대 상태 요약

## 5. Responsive
### Desktop
- 랜딩은 1열 롱스크롤
- 포털은 2~3열 카드 조합

### Tablet
- 상세 페이지 섹션 네비 고정 또는 접기
- 캠프/작전실 카드 세로 적층

### Mobile
- CTA 우선
- 표보다 카드 우선
- 작전실은 단일 컬럼

## 6. Designer Handoff Checklist
- [ ] 색상 토큰 확정
- [ ] 카드 형태와 보더 규칙 확정
- [ ] 상태 배지 스타일 확정
- [ ] 랜딩과 포털의 연결 톤 확정
- [ ] 베이스캠프 요약 구조 확정
- [ ] 작전실 워크플로우 보드 구조 확정
