# Expedition Hub Schema

## 2026-03-10 SSOT Strict Alignment Addendum

- `Team.contactUrl`
  - changed from effectively required public link to optional public link
  - invalid placeholder or dead demo links are normalized to `undefined`
  - public UI must render those cases as `연락처 준비중`, not as a broken external navigation
- `Hackathon.sections`
  - the detail route must keep the required 8-section shell even when the bootstrap source lacks a matching detail payload
  - missing detail is represented as `source-limited`, not as invented facts
- `PendingSubmitDraft`
  - visibility: browser-local only
  - purpose: store minimal submit-panel draft data from the public hackathon detail page
  - authoritative team submission data still lives in `war-room`, `submissions`, and `submissionArtifacts`
- `SubmissionArtifact`
  - remains team-local only
  - public detail may collect a handoff draft, but it must not directly expose or persist team-local artifact state to public routes
- `Display status`
  - when raw source status conflicts with the event end date, UI display status is allowed to resolve the conflict using the date

## 2026-03-10 Self-Review Follow-up Addendum

- `Hackathon.eventStartAt` / `Hackathon.registrationStartAt`
  - are source-backed optional fields
  - source-limited detail must never fabricate them from the current timestamp
  - missing start dates render as `미공개`
- `PendingSubmitDraft`
  - text fields advance readiness only when they map to a text stage and have non-empty content
  - URL fields advance readiness only when they are valid `http/https` values
  - file-style public submit fields are note-only and do not advance readiness by themselves
- `SubmissionArtifact`
  - only valid URL draft values may become team-local artifact links during war-room import

Last updated: 2026-03-10 (KST)
Source: `docs/ref/hackathons/daker-handover-2026-03.md`

## Storage Strategy
- Primary storage: `localStorage`
- Bootstrap sources:
  - `hackathonsjson/public_hackathons.json`
  - `hackathonsjson/public_hackathon_detail.json`
  - `hackathonsjson/public_teams.json`
  - `hackathonsjson/public_leaderboard.json`
- Data model goal: 멀티 해커톤 실행 포털 재사용성

## Core Entities

### 1) `Hackathon`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | public | internal unique id |
| `slug` | string | yes | public | route key |
| `title` | string | yes | public | |
| `status` | `'upcoming' \| 'ongoing' \| 'ended'` | yes | public | |
| `summary` | string | yes | public | |
| `tags` | string[] | yes | public | |
| `eventStartAt` | string | no | public | ISO 8601, source-backed only |
| `eventEndAt` | string | yes | public | ISO 8601 |
| `registrationStartAt` | string | no | public | ISO 8601, source-backed only |
| `registrationEndAt` | string | yes | public | ISO 8601 |
| `teamCount` | number | no | public | fallback 허용 |
| `viewCount` | number | no | public | fallback 허용 |
| `prizeTotalKRW` | number | yes | public | |
| `sections` | HackathonSection[] | yes | public | |

### 2) `HackathonSection`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | public | |
| `hackathonSlug` | string | yes | public | |
| `type` | `'overview' \| 'guide' \| 'eval' \| 'schedule' \| 'prize' \| 'teams' \| 'submit' \| 'leaderboard'` | yes | public | |
| `title` | string | yes | public | |
| `content` | string | yes | public | markdown/text |
| `displayOrder` | number | yes | public | |
| `isRequired` | boolean | yes | public | |

### 3) `Team`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | public | |
| `hackathonSlug` | string | no | public | null 허용 |
| `name` | string | yes | public | 원정대명 |
| `intro` | string | yes | public | |
| `isOpen` | boolean | yes | public | |
| `lookingFor` | string[] | yes | public | |
| `contactUrl` | string | no | public | 공개 가능한 링크만 |
| `memberCount` | number | yes | public | |
| `ownerLabel` | string | no | private-hidden | 비노출 원칙 |
| `createdAt` | string | yes | public | |
| `updatedAt` | string | no | team-local | |

### 4) `TeamMember`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | team-local | |
| `teamId` | string | yes | team-local | |
| `displayName` | string | yes | team-local | |
| `roleLabel` | string | no | team-local | |
| `status` | `'active' \| 'pending'` | yes | team-local | |
| `isPrivateProfile` | boolean | yes | private-hidden | |

### 5) `TeamInvite`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | team-local | |
| `teamId` | string | yes | team-local | |
| `inviteeLabel` | string | yes | team-local | |
| `status` | `'sent' \| 'accepted' \| 'rejected'` | yes | team-local | |
| `createdAt` | string | yes | team-local | |

### 6) `WarRoom`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | team-local | |
| `teamId` | string | yes | team-local | |
| `title` | string | yes | team-local | 작전실 제목 |
| `summary` | string | yes | team-local | |
| `submissionStage` | `'teaming' \| 'plan' \| 'web' \| 'pdf' \| 'done'` | yes | team-local | |
| `nextActionLabel` | string | no | team-local | 베이스캠프 요약용 |
| `lastUpdated` | string | yes | team-local | |
| `notes` | string | no | team-local | 팀 메모 |

### 7) `WarRoomWorkflowCard`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | team-local | |
| `warRoomId` | string | yes | team-local | |
| `title` | string | yes | team-local | |
| `column` | `'plan' \| 'web' \| 'pdf' \| 'submitted'` | yes | team-local | |
| `order` | number | yes | team-local | 컬럼 내 정렬 |
| `ownerLabel` | string | no | team-local | |
| `dueLabel` | string | no | team-local | 날짜 문자열 허용 |
| `notes` | string | no | team-local | |
| `isBlocked` | boolean | yes | team-local | |

### 8) `WarRoomChecklistItem`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | team-local | |
| `warRoomId` | string | yes | team-local | |
| `label` | string | yes | team-local | |
| `status` | `'todo' \| 'doing' \| 'done'` | yes | team-local | |
| `assigneeLabel` | string | no | team-local | |
| `dueAt` | string | no | team-local | |

### 9) `Submission`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | team-local | |
| `hackathonSlug` | string | yes | public | 상태 요약은 공개 가능 |
| `teamId` | string | no | public | |
| `planStatus` | `'empty' \| 'draft' \| 'submitted'` | yes | public | |
| `webStatus` | `'empty' \| 'draft' \| 'submitted'` | yes | public | |
| `pdfStatus` | `'empty' \| 'draft' \| 'submitted'` | yes | public | |
| `notes` | string | no | team-local | |
| `submittedAt` | string | no | public | |

### 10) `SubmissionArtifact`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | team-local | |
| `submissionId` | string | yes | team-local | |
| `kind` | `'plan_url' \| 'web_url' \| 'github_url' \| 'pdf_url'` | yes | team-local | |
| `url` | string | yes | team-local | |
| `label` | string | no | team-local | |

### 11) `LeaderboardEntry`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | public | |
| `hackathonSlug` | string | yes | public | |
| `subjectType` | `'team' \| 'user'` | yes | public | |
| `subjectId` | string | yes | public | |
| `name` | string | yes | public | |
| `rank` | number | no | public | 미제출이면 null |
| `score` | number | yes | public | |
| `status` | `'ranked' \| 'not_submitted'` | yes | public | |
| `scoreBreakdown` | Record<string, number> | no | public | |

### 12) `RankingProfile`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | public | |
| `nickname` | string | yes | public | |
| `points` | number | yes | public | 서비스 내부 점수 |
| `period` | `'7d' \| '30d' \| 'all'` | yes | public | |
| `activitySummary` | string | no | public | |

### 13) `SystemNotice`
| field | type | required | visibility | note |
|---|---|---|---|---|
| `id` | string | yes | public | |
| `scope` | `'global' \| 'hackathon' \| 'team'` | yes | public | |
| `hackathonSlug` | string | no | public | |
| `message` | string | yes | public | |
| `level` | `'info' \| 'warning' \| 'error'` | yes | public | |

## Privacy Model
- `public`: 누구나 볼 수 있는 정보
- `team-local`: 같은 브라우저/팀 상태에서만 보이는 정보
- `private-hidden`: UI 렌더링 금지

## Local Storage Keys
- `expeditionHub.hackathons`
- `expeditionHub.teams`
- `expeditionHub.teamMembers`
- `expeditionHub.teamInvites`
- `expeditionHub.warRooms`
- `expeditionHub.warRoomWorkflowCards`
- `expeditionHub.warRoomChecklist`
- `expeditionHub.submissions`
- `expeditionHub.submissionArtifacts`
- `expeditionHub.leaderboards`
- `expeditionHub.rankings`
- `expeditionHub.systemNotices`

## Acceptance
- 멀티 해커톤 구조를 설명할 수 있어야 한다.
- 베이스캠프 요약, 작전실 워크플로우, 제출, 리더보드, 글로벌 랭킹이 모두 데이터 모델에 반영되어야 한다.
- 비공개 정보는 필드 수준에서 분리되어야 한다.
