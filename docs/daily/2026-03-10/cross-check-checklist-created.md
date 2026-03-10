# 2026-03-10 Cross-Check Checklist Created

- Date: 2026-03-10 KST
- Scope:
  - Convert the latest document-to-product cross-check into an execution checklist
  - Lock the decision on whether war-room card drag should be added
- Decision:
  - README will be upgraded with stronger visual guidance, including Mermaid diagrams
  - War-room card drag will be implemented as a scoped Phase 2 enhancement
- Why:
  - README is still stale in path references and too weak as a visual repo entry point
  - Workflow-card movement is the clearest remaining gap between product docs and current behavior
- Output:
  - Added `docs/status/CROSS-CHECK-CHECKLIST.md`
- Next:
  1. Fix README integrity and diagram quality first
  2. Implement scoped war-room drag-and-drop

## README Visual Refresh

- Scope:
  - Replace stale workspace-specific README links with repo-relative links
  - Turn README into a visual repo entry point with Mermaid diagrams
  - Add a concise current build snapshot so the repo can be understood at a glance
- Output:
  - Rebuilt `README.md`
  - Added Mermaid route map, user-flow map, and document/evidence map
  - Added current build status, key docs, evidence docs, and design references with valid relative links
- Why:
  - README was still pointing at an old workspace path and was too weak as an onboarding and judging entry document
  - The next implementation phases need a reliable single-page overview before product changes continue
- Next:
  1. Plan the scoped war-room card drag-and-drop enhancement
  2. Plan the privacy boundary verification pass
