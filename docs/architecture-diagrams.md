# Expedition Hub Architecture Diagrams

Expedition Hub 해커톤 실행 포털용 Mermaid 다이어그램 모음.

---

## 1. System Architecture

```mermaid
graph TB
  subgraph Client["Frontend (Next.js + TypeScript + Tailwind)"]
    App["App Router"]
    PublicPages["Public Portal Pages"]
    TeamPages["Basecamp + War Room"]
    Store["Local State + localStorage"]
  end

  subgraph Data["Seed Data"]
    Json["hackathonsjson/*.json"]
    Design["design_reference/*.png"]
    Docs["SSOT / PRD / Schema / Wireframe"]
  end

  subgraph Output["Submission Assets"]
    Web["Vercel Web URL"]
    Repo["GitHub Repo"]
    Pdf["PDF"]
  end

  App --> PublicPages
  App --> TeamPages
  PublicPages --> Store
  TeamPages --> Store
  Json --> Store
  Docs --> PublicPages
  Docs --> TeamPages
  Design --> PublicPages
  Design --> TeamPages
  PublicPages --> Web
  TeamPages --> Web
  Docs --> Pdf
  Docs --> Repo
```

---

## 2. Route Map

```mermaid
graph TD
  Home["/"]
  HList["/hackathons"]
  HDetail["/hackathons/:slug"]
  Camp["/camp"]
  Rank["/rankings"]
  War["/war-room/:teamId"]

  Home --> HList
  Home --> Camp
  Home --> Rank
  HList --> HDetail
  HDetail --> Camp
  Camp --> War
  HDetail --> War
```

---

## 3. User Journey

```mermaid
journey
  title Expedition Hub 사용자 여정
  section 발견
    메인 랜딩 진입: 5: 참가자
    모집중 해커톤 탐색: 5: 참가자
  section 탐색
    해커톤 목록 보기: 5: 참가자
    상세 페이지에서 평가/일정 확인: 5: 참가자
  section 원정대
    원정대 모집글 보기: 4: 참가자
    원정대 생성 또는 합류: 4: 원정대장, 원정대원
  section 베이스캠프
    현재 단계와 다음 액션 확인: 5: 원정대장, 원정대원
    멤버 상태 이해: 4: 원정대원
  section 작전실
    플랜 카드 이동: 5: 원정대장
    제출 링크와 체크리스트 관리: 5: 원정대장, 원정대원
  section 제출/이해
    제출 가이드 확인: 5: 원정대장
    리더보드와 평가 이해: 4: 참가자, 심사자
```

---

## 4. Local Data ERD

```mermaid
erDiagram
  Hackathon ||--o{ HackathonSection : has
  Hackathon ||--o{ Team : groups
  Hackathon ||--o{ Submission : tracks
  Hackathon ||--o{ LeaderboardEntry : ranks
  Team ||--o{ TeamMember : has
  Team ||--o{ TeamInvite : invites
  Team ||--|| WarRoom : owns
  WarRoom ||--o{ WarRoomWorkflowCard : organizes
  WarRoom ||--o{ WarRoomChecklistItem : includes
  Submission ||--o{ SubmissionArtifact : has

  Hackathon {
    string slug
    string title
    string status
    number teamCount
  }
  Team {
    string id
    string hackathonSlug
    string name
    boolean isOpen
  }
  WarRoom {
    string id
    string teamId
    string submissionStage
    string nextActionLabel
  }
  WarRoomWorkflowCard {
    string id
    string warRoomId
    string title
    string column
  }
  Submission {
    string id
    string hackathonSlug
    string teamId
    string planStatus
    string webStatus
    string pdfStatus
  }
```

---

## 5. Submission Flow

```mermaid
flowchart LR
  A["원정대 구성"] --> B["베이스캠프 상태 확인"]
  B --> C["작전실: 기획서 준비"]
  C --> D["작전실: 웹 제출 준비"]
  D --> E["작전실: PDF 준비"]
  E --> F["제출 상태 확인"]
  F --> G["리더보드/평가 이해"]
```

---

## 6. Privacy Boundaries

```mermaid
graph LR
  Public["Public Portal"]
  TeamLocal["Team-local Data"]
  Hidden["Never Expose"]

  Public -->|"hackathons, public teams, rankings, submission summary"| TeamLocal
  TeamLocal -->|"basecamp summary, workflow cards, checklist, notes, invite states"| Hidden
  Hidden["internal user info / private info / other team internals / private contacts / applicant memo"]
```

---

## 7. Automation & Evidence Flow

```mermaid
graph TD
  SSOT["SSOT"]
  PRD["PRD"]
  Schema["Schema"]
  Wire["Wireframe"]
  Arch["Architecture"]
  Brief["Submission 1 Draft"]
  Status["Status Docs"]
  Daily["Daily Logs"]
  PDF["Final PDF Evidence"]

  SSOT --> PRD
  SSOT --> Schema
  SSOT --> Wire
  SSOT --> Arch
  PRD --> Brief
  Schema --> Brief
  Wire --> Brief
  Arch --> Brief
  Brief --> Status
  Status --> PDF
  Daily --> PDF
```

---

## 8. Missing-Check Nodes
- [ ] 상단바 이동
- [ ] 상태 UI 3종
- [ ] 상세 섹션 8개
- [ ] 베이스캠프 요약
- [ ] 작전실 워크플로우 보드
- [ ] 제출 상태
- [ ] `미제출`
- [ ] GitHub + Vercel 연결
