# Hackerton Orchestration Index

재사용 가능한 해커톤 운영 포털 프로젝트용 문서 우선 오케스트레이션 인덱스.

## Repo Boundary
- Write Repo: `C:\Users\ezen601\Desktop\Jason\hackerton`

## Context Loading Order
1. `CLAUDE.md`
2. `ai-context/START-HERE.md`
3. `docs/ref/hackathons/daker-handover-2026-03.md`
4. `docs/Prd.md`
5. `docs/schema.md`
6. `docs/wireframe.md`
7. `docs/architecture-diagrams.md`
8. `docs/status/PROJECT-STATUS.md`

## Execution Rules
1. SSOT보다 파생 문서가 우선할 수 없다.
2. 현재 프로젝트의 제품 정의는 `재사용 가능한 해커톤 운영 포털`이다.
3. 구현 기준 라우트는 `/`, `/hackathons`, `/hackathons/:slug`, `/camp`, `/rankings`, `/war-room/:teamId`다.
4. 필수 저장 전략은 `localStorage` 우선이다.
5. 공개 포털과 팀 전용 로컬 접근을 분리한다.
6. 내부 유저 정보, 비공개 정보, 다른 팀 내부 정보는 노출 금지다.
7. 구현 전 PRD, schema, wireframe, architecture를 먼저 읽는다.
8. 파괴적 git 조작은 명시 요청 없이는 금지다.
9. 작업 종료 시 `docs/status/PROJECT-STATUS.md`와 일일 로그를 동기화한다.

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
- 개발 과정 증빙(PPT 소재)은 `docs/evidence/`에 Phase별로 남긴다.

## Automation Index
- `.claude/automations/docs-nightly-organizer.prompt.md`
- `.claude/automations/code-doc-align.prompt.md`
- `.claude/automations/architecture-diagrams-sync.prompt.md`
- `.claude/automations/automation-health-monitor.prompt.md`
- `.claude/automations/code-quality-guard.prompt.md`
- `.claude/automations/security-boundary-check.prompt.md`
