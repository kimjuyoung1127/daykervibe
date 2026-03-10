# 개발 과정 기록 - Phase 1B Navigation and Camp Flow

> 공개 사용자 흐름에서 작전실을 발견할 수 있도록 진입 경로를 복구하고, SSOT가 요구한 `/camp?hackathon=:slug` 흐름까지 닫은 증빙 문서.

---

## 전체 타임라인

```
[작전실 구현 존재 확인] -> [공개 진입 CTA 복구] -> [상세 팀 섹션 deep link 연결] -> [상태 문서 정합화] -> [camp query flow SSOT 충족]
```

---

## 1. 구현 전 판단

### 왜 이 작업이 필요했는가?
- `/war-room/:teamId` 페이지 파일은 이미 구현되어 있었지만 공개 사용자 흐름 어디에서도 도달 링크가 없었다.
- 사용자 체감상 "작전실이 안 보인다"가 맞는 상태였고, 이는 기능 부재보다 발견성 결함에 가까웠다.
- SSOT는 `/camp?hackathon=:slug` 쿼리 필터를 명시하고 있었지만 실제 `/camp`는 컴포넌트 내부 상태로만 필터링하고 있었다.

### 무엇을 고쳤는가?
- `/camp` 팀 카드에 `작전실 열기` CTA 추가
- `/hackathons/:slug` 팀 섹션 카드에 `작전실 이동` CTA 추가
- 상세 팀 섹션 하단 CTA를 `/camp?hackathon=:slug`로 연결
- `/camp`가 URL query를 필터 소스로 읽고 버튼 클릭 시 query를 갱신하도록 변경
- 상태 문서와 일일 로그를 이번 흐름 기준으로 재정렬

### 심사 기준과의 연결
- 기본 구현: 공개 라우트와 협업 라우트가 끊기지 않는 탐색 흐름 확보
- 완성도: 구현은 있으나 진입 불가능한 화면을 사용자 흐름 안으로 복귀
- 문서/설명: SSOT 대비 실제 갭과 해결 방법을 증빙 파일로 보존

---

## 2. 단계별 구현 내용

### Step 1: 작전실 발견성 갭 확인
- `/camp` 팀 카드가 외부 연락 링크만 제공하고 내부 `/war-room/:teamId` 이동 경로가 없음을 확인
- `/hackathons/:slug` 팀 섹션도 팀 상세 맥락은 보여주지만 작전실 deep link는 없음을 확인
- 상태 문서가 "완료"로 표기하던 범위와 실제 사용자 도달 가능 범위가 다름을 식별

### Step 2: `/camp`에 작전실 진입 CTA 추가
- 각 팀 카드 액션 영역에 `/war-room/${team.id}` 내부 CTA 추가
- 기존 공개 contact link는 유지해 모집 게시판 역할을 해치지 않도록 구성
- 공개 포털과 팀 로컬 데이터의 경계는 그대로 유지

### Step 3: 상세 팀 섹션에 작전실 이동 연결
- 팀별 카드 하단에 `작전실 이동` CTA 추가
- 섹션 하단 `CAMP에서 팀 찾기` CTA는 유지하되 이후 query flow 작업과 연결될 수 있도록 구조 유지

### Step 4: `/camp?hackathon=:slug` SSOT 정합화
- `/camp`에서 `useSearchParams()`로 `hackathon` query를 읽어 활성 필터로 사용
- 필터 버튼 클릭 시 컴포넌트 로컬 state 대신 URL query를 갱신
- 특정 해커톤으로 진입했을 때 상단에 현재 스코프된 해커톤을 안내
- 새 원정대 생성 폼을 열 때 현재 query filter를 기본 해커톤 값으로 재사용
- Next.js 16 빌드 규칙에 맞게 `Suspense` 경계 추가

### Step 5: 상태 문서와 로그 보정
- `PROJECT-STATUS`에서 `/camp?hackathon=:slug`를 남은 갭에서 제거
- `PAGE-UPGRADE-BOARD`에 `/camp`와 `/hackathons/:slug`의 query/deep-link 흐름 완료 사실 반영
- 일일 로그에 Phase 4 query flow 작업과 검증 결과를 추가

---

## 3. 검증 결과

| 검증 항목 | 결과 |
|---|---|
| `/camp` 팀 카드에서 작전실 CTA 노출 | 통과 |
| 상세 팀 섹션에서 작전실 CTA 노출 | 통과 |
| `/camp?hackathon=daker-handover-2026-03` 필터링 | 통과 |
| 상세 팀 섹션 하단 CTA -> scoped camp 진입 | 통과 |
| `npm run lint` | 통과 |
| `npm run build` | 통과 |

추가 메모:
- `useSearchParams()` 도입 후 Next.js 16 빌드에서 `Suspense` 경계 요구가 발생했고, 이를 반영한 뒤 빌드가 정상 통과했다.
- `next-env.d.ts`나 `package-lock.json` 같은 생성물 드리프트는 이번 증빙 커밋 범위에 포함하지 않았다.

---

## 4. 커밋 이력

| # | 커밋 | 의미 |
|---|---|---|
| 1 | `c3e59c0 chore: stabilize baseline before war-room navigation work` | lint/문서 기준선 정리 |
| 2 | `7ab2cb7 feat(camp): add war-room entry action to team cards` | `/camp` 작전실 진입 CTA 추가 |
| 3 | `782f725 feat(detail): add war-room links to team section cards` | 상세 팀 섹션 작전실 deep link 추가 |
| 4 | `6eb407b docs: align status docs after war-room navigation fix` | 상태 문서 표현 보정 |
| 5 | `278938a feat(camp): support hackathon query filter flow` | `/camp?hackathon=:slug` query flow 구현 |

---

## 5. 남은 리스크

- 모바일/태블릿에서 `/camp`, `/war-room/:teamId`의 반응형 세부 레이아웃 QA는 아직 남아 있다.
- `private-hidden` 필드가 공개 라우트에 섞여 나오지 않는지 최종 검증이 필요하다.
- 제출용 기획서, Vercel 배포, 최종 체크리스트는 아직 증빙 자산으로 정리되지 않았다.

---

## 6. 제출 관점 요약

- 이번 단계는 "없던 기능 추가"보다 "이미 만든 기능을 심사자가 실제로 발견하고 따라갈 수 있게 만든 단계"에 가깝다.
- 공개 탐색 -> 팀 모집 -> 작전실 -> 제출 준비라는 제품 서사가 문서와 라우트 양쪽에서 일치하게 되었다.
- 따라서 Phase 1B는 이제 구현 존재뿐 아니라 사용자 흐름 기준으로도 설명 가능한 상태가 되었다.
