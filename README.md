# Expedition Hub

Expedition Hub는 원정대 구성부터 제출 준비 워크플로우 관리, 결과 확인까지 이어지는 재사용형 해커톤 실행 포털을 설계하고 구현하기 위한 문서-우선 워크스페이스입니다.

이번 프로젝트는 `daker-handover-2026-03` 해커톤을 첫 사례로 사용하지만, 단건 이벤트 페이지가 아니라 다음 대회에도 재사용 가능한 운영 포털 구조를 목표로 합니다.

## Core Product Definition

- 모집 -> 원정대 구성 -> 제출 준비 -> 평가 이해까지 이어지는 해커톤 실행 포털
- 8비트 게이머 감성 랜딩 + 운영 가독성 중심 포털 UI
- `Next.js + TypeScript + Tailwind + localStorage + Vercel` 기준 설계
- `원정대`, `베이스캠프`, `작전실` 용어를 계승하되, 작전실을 제출 준비 관리 허브로 재정의

## Source Of Truth

- Canonical SSOT:
  - [docs/ref/hackathons/daker-handover-2026-03.md](/C:/Users/gmdqn/daykervibe/docs/ref/hackathons/daker-handover-2026-03.md)

## Key Documents

- PRD:
  - [docs/Prd.md](/C:/Users/gmdqn/daykervibe/docs/Prd.md)
- Schema:
  - [docs/schema.md](/C:/Users/gmdqn/daykervibe/docs/schema.md)
- Wireframe:
  - [docs/wireframe.md](/C:/Users/gmdqn/daykervibe/docs/wireframe.md)
- Architecture:
  - [docs/architecture-diagrams.md](/C:/Users/gmdqn/daykervibe/docs/architecture-diagrams.md)
- Master plan:
  - [ai-context/master-plan.md](/C:/Users/gmdqn/daykervibe/ai-context/master-plan.md)
- Project status:
  - [docs/status/PROJECT-STATUS.md](/C:/Users/gmdqn/daykervibe/docs/status/PROJECT-STATUS.md)
- Submission 1 draft:
  - [docs/plans/expedition-hub-submission-1-draft.md](/C:/Users/gmdqn/daykervibe/docs/plans/expedition-hub-submission-1-draft.md)

## Evidence Assets

- Daily logs:
  - [docs/daily/2026-03-09/portal-doc-system-bootstrap.md](/C:/Users/gmdqn/daykervibe/docs/daily/2026-03-09/portal-doc-system-bootstrap.md)
  - [docs/daily/2026-03-09/dayker-war-room-redefinition.md](/C:/Users/gmdqn/daykervibe/docs/daily/2026-03-09/dayker-war-room-redefinition.md)
- Integrity report:
  - [docs/status/INTEGRITY-REPORT.md](/C:/Users/gmdqn/daykervibe/docs/status/INTEGRITY-REPORT.md)
- Automation health:
  - [docs/status/AUTOMATION-HEALTH.md](/C:/Users/gmdqn/daykervibe/docs/status/AUTOMATION-HEALTH.md)

## Planned Routes

- `/`
- `/hackathons`
- `/hackathons/:slug`
- `/camp`
- `/rankings`
- `/war-room/:teamId`

## Design Reference

- 8비트 레퍼런스:
  - [public/design_reference/1.png](/C:/Users/gmdqn/daykervibe/public/design_reference/1.png)

## Notes

- NotebookLM 기반 리서치는 프로젝트 문서에 흡수된 상태로 간주합니다.
- 자동화 프롬프트는 제품 기능이 아니라 문서 정합성과 개발 운영 증빙을 위한 자산입니다.
