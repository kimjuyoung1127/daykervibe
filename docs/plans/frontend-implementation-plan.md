# Frontend Implementation Plan — Expedition Hub 실행 포털

## Context
Expedition Hub 운영 포털의 문서(PRD/Schema/Wireframe/Architecture)는 완료됐으나 코드는 0줄 상태다. 이번 단계의 핵심은 DAKER의 기존 팀 공간을 그대로 복제하는 것이 아니라, 작전실을 제출 준비 관리 허브로 재해석해 심사 친화형 정보 구조를 만드는 것이다.

## 코딩 규칙 (전역)
1. **파일 상단 주석 필수**: 모든 신규 파일 상단에 1~3줄 한국어 기능 설명 주석을 작성한다.
2. **계층 간 파일명 1:1 매핑**: `lib/` 내부에서 types ↔ services ↔ hooks가 동일 도메인명으로 매칭되어야 한다.
3. **기능 확장 제한**: 작전실 확장은 `카드 이동 기반 워크플로우 보드`까지로 제한하고, 편집기/메신저 구조는 도입하지 않는다.

## 1. 폴더 구조 (frontend 단일 패키지)

> **결정**: backend/ 분리 없이 `frontend/src/lib/` 안에 모든 로직을 둔다.
> 지금 대회는 서버가 핵심이 아니고, localStorage 기반 프론트 앱이 핵심이다.

```
expedition-hub/
  frontend/
    public/
      seed/
        normalized/
          hackathons.json
          hackathon-sections.json
          teams.json
          war-rooms.json
          war-room-workflow-cards.json
          leaderboard.json
          rankings.json
          submissions.json
          system-notices.json
    src/
      app/
        page.tsx
        hackathons/page.tsx
        hackathons/[slug]/page.tsx
        camp/page.tsx
        rankings/page.tsx
        war-room/[teamId]/page.tsx
      components/
        landing/
        layout/
        shared/
          BasecampSummaryCard.tsx
          WorkflowBoard.tsx
          WorkflowCard.tsx
          ProgressSteps.tsx
        forms/
          TeamForm.tsx
          SubmissionForm.tsx
          ChecklistForm.tsx
      lib/
        types/
          warRoom.ts
        services/
          warRoom.ts
        hooks/
          useWarRoom.ts
        storage/
          keys.ts
          localStorage.ts
          seed.ts
```

## 2. 구현 단계

### Phase 0: 스캐폴드
- [ ] `frontend` 앱 초기화
- [ ] 디자인 토큰과 글로벌 스타일 설정
- [ ] `docs/schema.md` 기준 타입 초안 작성
- [ ] `expeditionHub.*` localStorage 키 정의
- [ ] 정규화 시드 데이터 작성

### Phase 1: 코어 페이지
**1a. 글로벌 셸**
- [ ] TopNav
- [ ] PageShell
- [ ] Footer
- [ ] NoticeBanner

**1b. 랜딩 `/`**
- [ ] `Expedition Hub` 서비스명과 한 줄 소개
- [ ] CTA 3개
- [ ] 포털 가치 섹션

**1c. 해커톤 목록 `/hackathons`**
- [ ] 카드 그리드
- [ ] 상태 필터

**1d. 해커톤 상세 `/hackathons/:slug`**
- [ ] 상단 요약 바
- [ ] 8개 섹션 네비
- [ ] 원정대 찾기 / 원정대 만들기 CTA
- [ ] 제출 섹션 상태 표시
- [ ] 리더보드 `미제출` 표시

**1e. 캠프 `/camp`**
- [ ] 원정대 카드 리스트
- [ ] 필터 바
- [ ] 원정대 생성 모달

**1f. 랭킹 `/rankings`**
- [ ] 랭킹 테이블
- [ ] 기간 필터

**1g. 작전실 `/war-room/:teamId`**
- [ ] `BasecampSummaryCard` — 원정대명, 해커톤, 현재 단계, 다음 액션, 멤버 상태
- [ ] `ProgressSteps` — `teaming -> plan -> web -> pdf -> done`
- [ ] `WorkflowBoard` — `기획서 준비 / 웹 제출 준비 / PDF 준비 / 제출 완료`
- [ ] `WorkflowCard` — 제목, 담당, 기한, 메모, block 여부
- [ ] 체크리스트
- [ ] 링크 관리
- [ ] 팀 메모
- [ ] 팀원 + 초대 상태

### Phase 2: 심사 품질
- [ ] 디자인 일관성 패스
- [ ] 반응형 정밀 조정
- [ ] 원정대 초대/수락/거절 플로우
- [ ] 워크플로우 카드 시드 보강
- [ ] 프라이버시 감사
- [ ] localStorage 새로고침 생존 테스트

### Phase 3: 배포 + 증빙
- [ ] Vercel 최종 배포
- [ ] 스크린샷 → PDF 증빙
- [ ] PROJECT-STATUS.md 동기화
- [ ] daily log 작성

## 3. 핵심 아키텍처 결정

### localStorage 서비스 3계층
1. **Raw Storage** (`storage/localStorage.ts`) — typed get/set/remove
2. **Entity Services** (`services/*.ts`) — CRUD + visibility 필터
3. **React Hooks** (`hooks/*.ts`) — `{ data, isLoading, error }` 패턴

### 시딩 전략
- `public/seed/normalized/*.json`이 앱의 진실 소스
- `expeditionHub.__seeded` 플래그 확인 후 초기 데이터 적재
- 워크플로우 카드 시드는 제출 준비 흐름을 설명하는 카드 5~8개로 구성

### 작전실 제한 원칙
- `compose` 참조는 카드 이동 UX 아이디어만 차용
- 블록 팔레트, 속성 패널, 프리뷰, 템플릿 저장 기능은 미도입
- 워크플로우 보드는 `팀 내부 실행 순서 공유` 목적에 한정

### 베이스캠프 처리
- 별도 라우트 추가 없음
- 작전실 상단 카드가 베이스캠프 역할 수행
- 요약 데이터는 `WarRoom`에서 파생

### 제출 폼
- 링크 제출형만 지원
- 입력 필드: `planUrl`, `webUrl`, `githubUrl`, `pdfUrl`, `notes`
- 파일 업로드 UI는 도입하지 않음

## 4. 검증 방법
1. `npm run build` 에러 0
2. 6개 라우트 수동 확인
3. localStorage 초기화 후 새로고침 시 시드 자동 로드 확인
4. 작전실 카드 이동 후 상태 유지 확인
5. 베이스캠프 요약과 작전실 상세 상태 일치 확인
6. private-hidden 필드 DOM 비노출 확인
7. 배포 URL 외부 접근 가능 확인
