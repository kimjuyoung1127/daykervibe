# 2026-03-11 - Hackathon List and War Room UX Polish

## Summary
- `/hackathons` 목록을 상태 우선순위 기준으로 재정렬했다.
- `/hackathons`에 상태 필터와 함께 쓰는 태그 필터를 추가했다.
- `/war-room/:teamId`에서 새로 추가한 카드, 체크리스트, 링크를 즉시 삭제할 수 있게 만들었다.
- 워룸 링크 입력 문구를 `링크 이름`으로 다듬고 모바일 줄바꿈/간격을 보강했다.
- `/rankings` 모바일 카드에서 순위, 닉네임, 점수, 활동 요약의 간격을 재배치했다.
- `/camp`와 해커톤 상세 팀 섹션의 모집 역할 칩 스타일을 통일했다.
- `/camp` 생성 폼에서 모집 역할을 선택/추가/제거할 수 있는 UI를 넣었다.
- `/camp` 생성/수정 폼에 `isOpen` 입력과 커스텀 팀 전용 `수정`, `모집 마감` 흐름을 추가했다.
- 핵심 6개 라우트의 `loading / empty / error` 상태 UI 분기를 다시 맞췄다.
- `/hackathons/:slug` SummaryBar에 `기간`, `조회수`를 추가해 SSOT 요약 항목을 모두 맞췄다.
- 해커톤 상세 Teams Section에 `원정대 만들기` CTA를 추가해 `/camp` 생성 폼을 직접 열 수 있게 했다.
- Submit Section에 파일형 제출용 `file input`을 추가하고, 선택 파일명을 pending draft로 저장하도록 보강했다.
- 루트 메타데이터에 `openGraph`, `twitter`, `metadataBase`를 추가해 카카오톡 공유 카드에 대표 이미지가 붙도록 정리했다.

## Why
- 모집중인 해커톤이 목록 상단에 오지 않으면 참가자 탐색 효율이 떨어졌다.
- 워룸은 추가는 가능하지만 제거가 안 되어 로컬 상태를 정리하기 불편했다.
- 좁은 화면에서 텍스트가 붙거나 끊겨 보이는 구간이 남아 있었다.

## Changes
- `src/app/hackathons/page.tsx`
  - `upcoming -> ongoing -> ended` 정렬 우선순위 추가
  - 태그 필터 추가
  - 모바일 `<select>` + 데스크톱 버튼 행 구성
  - 제목/요약/태그/날짜/팀 수 모바일 가독성 보강
- `src/app/war-room/[teamId]/page.tsx`
  - 카드/체크리스트/링크 삭제 핸들러 추가
  - `localStorage` 동기화 유지
  - 링크 입력 placeholder를 `링크 이름`으로 변경
  - 워크플로, 체크리스트, 링크 섹션 모바일 레이아웃 보강
- `src/app/rankings/page.tsx`
  - 모바일 전용 랭킹 행 레이아웃 추가
- `src/app/camp/page.tsx`
  - 모집 역할 칩 typography, padding, gap 통일
  - 기본 역할 선택 + 직접 입력 + 선택된 역할 제거 UI 추가
- `src/components/hackathon/sections/TeamsSection.tsx`
  - `#역할명` 표기 제거
  - RECRUIT HUB와 같은 모집 역할 칩 스타일 적용
- `src/app/camp/page.tsx`
  - `isOpen` 입력 추가
  - 커스텀 팀 전용 수정 모드와 모집 마감 처리 추가
  - 저장 시 `updatedAt` 갱신
- `src/app/page.tsx`
  - 홈 라우트에 `ErrorState`, `EmptyState` 분기 보강
- `src/app/hackathons/page.tsx`
  - 목록 로드 실패 시 `ErrorState` 분기 추가
- `src/app/hackathons/[slug]/page.tsx`
  - 섹션 카탈로그 비어 있음 처리와 bootstrap 에러 수렴 보강
- `src/app/rankings/page.tsx`
  - 랭킹 로드 실패 시 `ErrorState` 분기 추가
- `src/app/war-room/[teamId]/page.tsx`
  - 작전실 bootstrap 에러 처리 추가
  - 워크플로/체크리스트/링크 empty 상태를 공통 컴포넌트로 정리
- `src/components/hackathon/SummaryBar.tsx`
  - `D-DAY` 대신 `PERIOD`, `VIEWS`를 포함한 SSOT 기준 5개 요약 항목으로 조정
- `src/components/hackathon/sections/TeamsSection.tsx`
  - `원정대 만들기` CTA 추가
  - `/camp?hackathon=:slug&compose=1` 딥링크 연결
- `src/app/camp/page.tsx`
  - `compose=1` 쿼리 진입 시 생성 폼 자동 오픈 처리
- `src/components/hackathon/sections/SubmitSection.tsx`
  - `zip/csv` 제출형에 대한 실제 `file input` UI 추가
  - 선택한 파일명만 브라우저 draft에 저장하도록 변경
- `src/lib/submission-drafts.ts`
  - 파일 선택 draft도 stage draft와 notes에 반영되도록 보강
- `src/app/layout.tsx`
  - `metadataBase`, `canonical`, `openGraph`, `twitter` 메타 추가
  - 공유 대표 이미지로 `og-image-hero.webp` 연결

## Validation
- `npm run lint`
- `npm run build`

## Self Review / Docs Consistency
- `/camp` CRUD와 공통 상태 UI 정합성 패치 기준으로 SSOT 재대조를 수행했다.
- 새 코드 기준으로 직접 충돌하는 SSOT 위배는 발견하지 못했다.
- 파생 문서에서 실제와 어긋난 항목 1건을 수정했다:
  - `docs/wireframe.md`가 삭제된 `public/design_reference/*` 자산을 계속 참조하고 있었음
  - 라이브 구현 + evidence 문서 기준으로 교체
- 제출 draft 구현이 `file input` 기반으로 바뀐 뒤 남아 있던 파생 문서 설명도 동기화했다.
  - `docs/schema.md`, `docs/ref/daker-handover-ui-spec.md`, `docs/status/PAGE-UPGRADE-BOARD.md`, `docs/plans/expedition-hub-submission-1-draft.md`
- 작전실 설명 문구에서 `협업이 아닌 허브`처럼 읽히던 표현을 걷어내고, `팀 전용 협업 흐름 + 제출 준비 관리 허브` 방향으로 정리했다.
  - `docs/Prd.md`, `docs/status/PROJECT-STATUS.md`
- `docs/status/INTEGRITY-REPORT.md`, `ai-context/master-plan.md`를 현재 구현 상태에 맞게 갱신했다.
- 배포 공유 메타를 추가해 카카오톡 등 메신저에서 이미지 포함 미리보기가 가능하도록 맞췄다.
