# Page Upgrade Board

Source of truth for route-level execution status.

| route | label | group | priority | status | must_read_docs | note |
|---|---|---|---|---|---|---|
| `/` | Home Landing | Marketing | P0 | Ready | `docs/Prd.md`, `docs/wireframe.md` | 8비트 랜딩 + 포털 진입 |
| `/hackathons` | Hackathon List | Portal | P0 | Ready | `docs/Prd.md`, `docs/schema.md` | 멀티 해커톤 구조 |
| `/hackathons/:slug` | Hackathon Detail | Portal | P0 | Ready | `docs/ref/hackathons/daker-handover-2026-03.md`, `docs/wireframe.md` | 핵심 상세 |
| `/camp` | Team Camp | Collaboration | P0 | Ready | `docs/schema.md`, `docs/wireframe.md` | 팀 모집 허브 |
| `/rankings` | Rankings | Portal | P1 | Ready | `docs/schema.md` | 글로벌 랭킹 |
| `/war-room/:teamId` | War Room | Collaboration | P0 | Ready | `docs/Prd.md`, `docs/architecture-diagrams.md` | 베이스캠프 + 제출 준비 관리 허브 |

## Status Flow
`Ready -> InProgress -> QA -> Done` (`Hold` for blocked work)
