# 개발 과정 기록 — Phase 0: Scaffold

> PPT 슬라이드 소재용. 각 단계의 의사결정 근거와 검증 결과를 포함.

---

## 전체 타임라인

```
[문서 100% 완료] → [구현 전략 수립] → [6단계 스캐폴드] → [자체 리뷰 통과] → [Phase 1 준비 완료]
```

---

## 1. 구현 전 의사결정

### 왜 문서를 먼저 완성했는가?
- PRD, Schema, Wireframe, Architecture 4개 SSOT를 먼저 확정
- 이유: 타입과 스토리지가 모든 페이지의 기반 → schema.md와 1:1 매핑이 안 맞으면 나중에 전부 뒤집어야 함
- **심사 기준 연결**: 기본 구현 30점 중 "모든 페이지 데이터 기반 렌더링(하드코딩 X)"

### 왜 Phase 0을 분리했는가?
- 타입 → 스토리지 → 시딩 → 디자인 → 라우트 순서로 의존성 방향이 한쪽임
- 이 기반이 없으면 Phase 1 페이지 구현 시 매번 타입 수정 → import 깨짐 반복
- **결정**: 하루를 투자해서 기반을 완벽히 잡고, Phase 1부터는 순수 UI 구현에만 집중

### 추가 페이지(프로필/설정) 불필요 판단
- schema.md에 User 엔티티 없음, 인증 없는 localStorage 기반 구조
- 페이지 수를 늘리는 것보다 기존 6개 페이지의 완성도가 점수에 직결
- **결정**: 6개 라우트에 집중, 확장은 기능 깊이(War Room 워크플로우 등)로

---

## 2. 단계별 구현 과정

### Step 1: 프로젝트 초기화
```
Next.js 16 + TypeScript (strict) + Tailwind v4 + App Router
```
- 기존 문서/에셋이 있는 디렉토리에서 수동 초기화 (create-next-app 불가)
- **검증**: `npm run build` 성공 확인

### Step 2: 13개 엔티티 타입 정의
```
schema.md 테이블 → TypeScript interface 1:1 변환
```
- 13개 엔티티, 총 약 80개 필드
- visibility 레벨을 JSDoc 주석으로 기록 (`@visibility public/team-local/private-hidden`)
- **검증**: 모든 필드명, 타입, required/optional이 schema.md와 정확히 일치 확인

### Step 3: localStorage 유틸리티
```
expeditionHub.* 프리픽스 12개 키 + 타입 안전 CRUD
```
- SSR 안전 가드 (`typeof window !== 'undefined'`)
- JSON.parse 에러 시 null 반환 (graceful degradation)
- **검증**: 키 12개 = schema.md "Local Storage Keys" 섹션과 전수 대조

### Step 4: 시드 데이터 변환기
```
hackathonsjson/ 4개 JSON → schema 엔티티로 변환
```
- 주요 변환 매핑:
  | JSON 원본 | Schema 타입 | 변환 내용 |
  |-----------|-------------|-----------|
  | `teamCode` | `id` | 필드 리네이밍 |
  | `contact.url` | `contactUrl` | 중첩 → 평탄화 |
  | `period.endAt` | `eventEndAt` | 필드 리네이밍 |
  | `info` 섹션 | `guide` 타입 | 섹션 타입 매핑 |
  | `prize.items[]` | `prizeTotalKRW` | 합산 계산 |
- `__seeded` 플래그로 새로고침 시 중복 시딩 방지
- **검증**: 변환 후 데이터가 TypeScript 타입 체크 통과

### Step 5: 8비트 디자인 토큰
```
wireframe.md 색상 8개 + 폰트 2개 → Tailwind v4 @theme
```
- 색상: `#171314`(배경), `#F7F1E8`(카드), 5개 악센트 컬러
- 폰트: Press Start 2P(영문 타이틀), DungGeunMo(한글 본문)
- **검증**: `npm run dev`에서 폰트 렌더링 + 색상 적용 확인

### Step 6: 라우트 스캐폴드 + 시딩 통합
```
6개 라우트 placeholder + Providers에서 자동 시딩
```
- `/`, `/hackathons`, `/hackathons/:slug`, `/camp`, `/rankings`, `/war-room/:teamId`
- 시딩 타이밍: 클라이언트 마운트 시 `useEffect` → 최초 1회 실행
- **검증**: 6개 라우트 빌드 성공 (static 4 + dynamic 2)

---

## 3. 자체 리뷰 프로세스

매 단계 커밋 전에 다음 체크리스트를 통과해야 함:

| 검증 항목 | 방법 |
|-----------|------|
| `npm run build` 0 errors | CI 수준 타입 체크 |
| schema.md ↔ types 필드 대조 | 수동 전수 검사 |
| localStorage 키 프리픽스 통일 | `expeditionHub.*` 12개 확인 |
| visibility 주석 기록 | public/team-local/private-hidden 구분 |
| SSR 안전성 | `typeof window` 가드 확인 |

---

## 4. 커밋 이력 (PPT 슬라이드용)

| # | 커밋 메시지 | 핵심 변경 |
|---|-------------|-----------|
| 1 | `feat(scaffold): initialize Next.js + TypeScript + Tailwind` | 프로젝트 기반 |
| 2 | `feat(types): define 13 entity types matching schema.md 1:1` | 데이터 모델 |
| 3 | `feat(storage): add typed localStorage utilities` | 저장소 계층 |
| 4 | `feat(seed): add JSON→Entity transformers and seeding` | 데이터 파이프라인 |
| 5 | `feat(design): configure 8-bit design tokens and fonts` | 디자인 시스템 |
| 6 | `feat(routes): scaffold 6 app routes + seeding integration` | 페이지 구조 |
| 7 | `docs: update PROJECT-STATUS and Phase 0 daily log` | 증빙 문서 |

---

## 5. 아키텍처 다이어그램 (PPT용)

```
┌─────────────────────────────────────────────┐
│              Expedition Hub                  │
├─────────────────────────────────────────────┤
│  App Router (6 routes)                       │
│  ┌─────┐ ┌──────────┐ ┌──────────────────┐ │
│  │  /  │ │/hackathons│ │/hackathons/:slug │ │
│  └─────┘ └──────────┘ └──────────────────┘ │
│  ┌──────┐ ┌─────────┐ ┌──────────────────┐ │
│  │/camp │ │/rankings│ │/war-room/:teamId │ │
│  └──────┘ └─────────┘ └──────────────────┘ │
├─────────────────────────────────────────────┤
│  Design System                               │
│  8 colors · 2 fonts · Tailwind v4 @theme    │
├─────────────────────────────────────────────┤
│  lib/types (13 entities)                     │
│  ↕ schema.md 1:1                             │
├─────────────────────────────────────────────┤
│  lib/storage                                 │
│  keys → localStorage → seed → transformers  │
├─────────────────────────────────────────────┤
│  hackathonsjson/ (4 JSON seed files)         │
│  → transformers → localStorage              │
└─────────────────────────────────────────────┘
```

---

## 6. 심사 기준 매핑

| 심사 항목 (배점) | Phase 0에서 준비된 것 |
|------------------|----------------------|
| 기본 구현 (30점) | 데이터 기반 렌더링 파이프라인 완성, 하드코딩 없는 구조 |
| 확장 아이디어 (30점) | War Room 타입/스토리지 기반 준비 |
| 완성도 (25점) | localStorage 새로고침 생존, 프라이버시 visibility 모델 |
| 문서 (15점) | 이 문서 자체가 증빙 |
