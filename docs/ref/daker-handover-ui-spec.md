# Daker Handover UI Spec

## 2026-03-10 Implementation Alignment Addendum

- `Submit` on `/hackathons/:slug`
  - stays present on the public detail page
  - current product behavior is:
    - show guide copy
    - show a minimal submit draft panel
    - route the user to either scoped camp or the team war-room for authoritative submission management
  - file-style public submit requirements are note-only preparation fields, not uploads
  - invalid URL draft values do not advance readiness or create artifact links
- `Authoritative submission management`
  - remains team-local in `/war-room/:teamId`
  - public detail must not directly expose team-local notes, checklist, or stored artifact links
- `Teams`
  - public contact links are shown only when the bootstrap source yields a valid public URL
  - invalid placeholder links are intentionally rendered as `연락처 준비중`
  - ended hackathons keep team cards visible as archive information, but do not expose recruiting or war-room entry actions
- `Missing source detail`
  - the route still renders the required section shell
  - missing source-backed detail is labeled as limited/unavailable instead of being filled with invented content
  - missing source-backed start dates render as `미공개`
- `Ended hackathon submit state`
  - the submit section remains visible for archive context
  - ended hackathons do not expose new draft-saving actions from the public detail route

이 문서는 [docs/ref/hackathons/daker-handover-2026-03.md](/C:/Users/gmdqn/daykervibe/docs/ref/hackathons/daker-handover-2026-03.md)의 `Product Spec`을 구현 관점으로 재정렬한 파생 문서다.
값 충돌 시 SSOT가 우선한다.

## Required Screens
- `/`
- `/hackathons`
- `/hackathons/:slug`
- `/camp`
- `/rankings`
- `/war-room/:teamId`

## Required Global UI
- 상단바:
  - `메인`
  - `/hackathons`
  - `/camp`
  - `/rankings`
- 상태 UI 3종:
  - `로딩중...`
  - `데이터 없음`
  - `에러`

## Required Page Behavior
### `/`
- 큰 카드 또는 버튼 3개
- `/hackathons`, `/camp`, `/rankings` 진입
- Expedition Hub 한 줄 소개와 서비스 가치 표시

### `/hackathons`
- 제목, 상태, 태그, 시작일, 종료일, 참가자수 노출
- 카드 클릭 시 상세 이동

### `/hackathons/:slug`
- 필수 섹션:
  - 개요
  - 안내
  - 평가
  - 일정
  - 상금
  - 팀
  - 제출
  - 리더보드

### `/camp`
- 해커톤 연결 없이도 원정대 생성 가능
- `/camp?hackathon=:slug` 필터 지원
- 생성, 수정, 모집 마감 처리 지원

### `/rankings`
- `rank`, `닉네임`, `points`

### `/war-room/:teamId`
- 상단은 `베이스캠프` 역할의 상태 요약 영역
- 하단은 `작전실` 역할의 제출 준비 관리 영역
- 단계 스테퍼, 플랜 카드 보드, 체크리스트, 링크 관리, 팀 메모를 함께 제공

## Data Contracts
- `hackathons`
- `teams`
- `submissions`
- `leaderboards`
- `warRoomWorkflowCards`
- 저장 방식: `localStorage`

## Required Details
### Teams
- 팀명
- 소개
- 모집중 여부
- 모집 포지션
- 연락 링크

### Basecamp Summary
- 원정대명
- 연결된 해커톤
- 현재 제출 단계
- 다음 해야 할 일
- 멤버 참여 상태

### War Room Workflow
- 카드 기반 플랜 관리
- 카드 이동은 제출 준비 상태를 반영
- 권장 컬럼:
  - `기획서 준비`
  - `웹 제출 준비`
  - `PDF 준비`
  - `제출 완료`

### Submit
- 제출 가이드
- 최소 제출 폼
- `notes` optional
- 공식 제출 구조는 `기획서(text/url)`, `웹 URL + GitHub`, `PDF`

### Leaderboard
- 점수 기준 설명
- 제출 내역 없는 참가자는 `미제출`

## Optional Enhancements
- 상태 필터
- 태그 필터
- 기간 필터
- 원정대 초대/수락/거절
- 유의사항 팝업
- 디자인 고도화

## Privacy Guard
- 내부 유저 정보 비노출
- 비공개 정보 비노출
- 다른 팀 내부 정보 비노출
- 비공개 연락 수단 비노출
- 지원자 내부 메모 비노출

## Acceptance Checklist
- 모든 상단바 링크 동작
- 모든 주요 페이지에 상태 UI 3종 표시 가능
- 상세 페이지 필수 섹션 렌더링
- 캠프 생성/수정/마감 동작
- 작전실에서 카드 이동 후 상태 유지
- 제출 없는 참가자 `미제출` 표기
