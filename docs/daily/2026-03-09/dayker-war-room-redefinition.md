# DAYKER War Room Redefinition

Date: 2026-03-09 (KST)

## Summary
- 서비스명을 `DAYKER`로 고정했다.
- `원정대`, `베이스캠프`, `작전실` 용어를 중심으로 제품 서사를 재정렬했다.
- 작전실을 단순 협업 공간이 아니라 제출 준비 관리 허브로 재정의했다.

## Changes
- `README.md`, `ai-context/*.md`에서 DAYKER 제품 정의로 통일
- `docs/Prd.md`에 베이스캠프/작전실 개념과 입력->동작->결과 기능 명세 추가
- `docs/schema.md`에 `WarRoomWorkflowCard` 엔티티와 `dayker.*` 저장 키 추가
- `docs/wireframe.md`, `docs/architecture-diagrams.md`에 베이스캠프 요약과 워크플로우 보드 구조 반영
- `docs/plans/frontend-implementation-plan.md`에 작전실 확장 범위와 컴포넌트 계획 반영
- `docs/plans/dayker-submission-1-draft.md` 초안 작성

## Reasoning
- DAKER에도 팀 공간과 작전실 개념이 이미 존재하므로, 단순한 협업 공간 자체는 차별점이 되기 어렵다.
- DAYKER의 차별점은 제출 준비 과정을 실제로 관리하고, 팀 전체가 실행 순서를 이해하게 만드는 정보 구조에 있다.
- 확장 범위를 카드 이동 기반 워크플로우 보드로 제한해 기본 구현 과투자 리스크를 줄였다.

## Follow-up
- 워크플로우 카드 시드 데이터 설계
- 기획서 문안 다듬기
- 실제 프론트엔드 앱 골격 생성
