# Hackerton Codex Agent Guide

이 파일은 `C:\Users\gmdqn\daykervibe\CLAUDE.md`를 Codex 작업 기준으로 옮긴 운영 지침이다.

## Repo Boundary
- Working repo: `C:\Users\gmdqn\daykervibe`

## Context Loading Order
1. `AGENTS.md`
2. `CLAUDE.md`
3. `ai-context/START-HERE.md`
4. `docs/ref/hackathons/daker-handover-2026-03.md`
5. `docs/Prd.md`
6. `docs/schema.md`
7. `docs/wireframe.md`
8. `docs/architecture-diagrams.md`
9. `docs/status/PROJECT-STATUS.md`

## Core Rules
1. SSOT보다 파생 문서가 우선할 수 없다.
2. 현재 제품 정의는 `재사용 가능한 해커톤 운영 포털`이다.
3. 구현 기준 라우트는 `/`, `/hackathons`, `/hackathons/:slug`, `/camp`, `/rankings`, `/war-room/:teamId`다.
4. 기본 저장 전략은 `localStorage` 우선이다.
5. 공개 포털과 팀 전용 로컬 접근을 분리한다.
6. 내부 유저 정보, 비공개 정보, 다른 팀 내부 정보는 노출 금지다.
7. 구현 전에 PRD, schema, wireframe, architecture를 먼저 읽는다.
8. 파괴적 git 조작은 명시 요청 없이는 금지다.
9. 작업 종료 시 `docs/status/PROJECT-STATUS.md`와 일일 로그 동기화 여부를 확인한다.

## Source Of Truth Docs
- `docs/ref/hackathons/daker-handover-2026-03.md`
- `docs/Prd.md`
- `docs/schema.md`
- `docs/wireframe.md`
- `docs/architecture-diagrams.md`
- `docs/status/PROJECT-STATUS.md`
- `docs/status/PAGE-UPGRADE-BOARD.md`

## Documentation Evidence Policy
- 문서는 내부 참고용이 아니라 심사 증빙 자산으로 유지한다.
- 중요한 결정에는 이유, 심사 기준 연결, 검증 결과를 남긴다.
- 일일 로그는 `docs/daily/`에 남긴다.
- 마일스톤 스냅샷은 `ai-context/archive/YYYY-MM-DD/`에 남긴다.

## Automation Index
- `.claude/automations/docs-nightly-organizer.prompt.md`
- `.claude/automations/code-doc-align.prompt.md`
- `.claude/automations/architecture-diagrams-sync.prompt.md`
- `.claude/automations/automation-health-monitor.prompt.md`
