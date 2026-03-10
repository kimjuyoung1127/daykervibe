# Responsive QA Report - Phase 2 Playwright Pass

- Date: 2026-03-10 KST
- Tooling: Playwright headed browser QA
- Targets:
  - `/camp`
  - `/camp?hackathon=daker-handover-2026-03`
  - `/hackathons/daker-handover-2026-03`
  - `/war-room/T-HANDOVER-01`
- Viewports:
  - `360x800`
  - `393x852`
  - `768x1024`
  - `1280x800`
- Artifacts:
  - `output/playwright/camp-*.png`
  - `output/playwright/detail-*.png`
  - `output/playwright/detail-teams-*.png`
  - `output/playwright/war-room-*.png`

## Summary

- Result: `initial blocking issue found, then resolved in same-day follow-up fix pass`
- Initial blocking route: `/war-room/T-HANDOVER-01` on `360x800`, `393x852`
- Query-scoped camp flow is working as intended
- Tablet (`768x1024`) and desktop (`1280x800`) did not show blocking overflow on the inspected routes
- Follow-up rerun after responsive fixes cleared document-level overflow on `/war-room/T-HANDOVER-01` and kept `/camp` stable on `360x800`

## Initial Findings

### Blocking

1. `/war-room/:teamId` has true horizontal overflow on narrow mobile
- Severity: `blocking`
- Viewports: `360x800`, `393x852`
- Evidence:
  - `output/playwright/war-room-360x800.png`
  - `output/playwright/war-room-393x852.png`
- Details:
  - Document width expands to `450px` on narrow mobile while viewport is `360px` or `393px`
  - Overflow is not limited to the allowed stage stepper; it propagates into the workflow add-card row and the links input row
  - The add button and URL input are pushed outside the intended single-column mobile layout
- Impact:
  - This breaks the core war-room flow on mobile and creates a horizontal-scroll trap in a route that should stack vertically

### Minor

1. `/camp` filter row hides the result count when chips overflow
- Severity: `minor`
- Viewports: `360x800`, `393x852`
- Evidence:
  - `output/playwright/camp-360x800.png`
  - `output/playwright/camp-filtered-360x800-reference.png`
- Details:
  - Horizontal chip scrolling itself is acceptable
  - The `N개 원정대` count is pushed effectively off-screen because it lives in the same overflow row as the chips

2. Mobile touch targets are consistently under the 40px comfort threshold
- Severity: `minor`
- Routes:
  - `/camp`
  - `/hackathons/daker-handover-2026-03`
  - `/war-room/T-HANDOVER-01`
- Viewports: strongest on `360x800`, `393x852`
- Details:
  - Top nav links render at roughly `28-30px` height
  - Tab buttons on detail render at roughly `33px`
  - `작전실 열기`, `작전실 이동`, form submit buttons, and stage buttons are mostly `31-36px`
  - Secondary text links like `연락하기` are especially small (`32x12`)

3. `/hackathons/:slug` tab row remains usable but feels cramped on narrow mobile
- Severity: `minor`
- Viewport: `360x800`
- Evidence:
  - `output/playwright/detail-360x800.png`
  - `output/playwright/detail-teams-360x800.png`
- Details:
  - Horizontal overflow is intentional here, but the visible scrollbar and `33px` tab height make the section switcher feel tight
  - The `리더보드` tab edge reaches beyond the immediate visible area on the narrowest viewport

4. `/camp` card action pairing is readable but crowded on narrow mobile
- Severity: `minor`
- Viewports: `360x800`, `393x852`
- Details:
  - Primary internal CTA is visible
  - The secondary contact link is visually weak and hard to tap

## Follow-up Fix Verification

- Revalidated after layout fixes in:
  - `src/app/war-room/[teamId]/page.tsx`
  - `src/app/camp/page.tsx`
  - `src/components/hackathon/SectionTabs.tsx`
  - `src/components/hackathon/sections/TeamsSection.tsx`
  - `src/components/layout/TopNav.tsx`
  - `src/components/ui/PixelButton.tsx`
- Updated reference artifacts:
  - `output/playwright/war-room-360x800-fixed.png`
  - `output/playwright/camp-360x800-fixed.png`
  - `output/playwright/detail-teams-360x800-fixed.png`
  - `output/playwright/war-room-mobile-controls-360.png`
- Follow-up results:
  - `/war-room/T-HANDOVER-01` no longer creates document-level horizontal overflow on `360x800`
  - `/war-room/T-HANDOVER-01` measured `bodyScrollWidth=345`, `documentScrollWidth=345` at `360x800`
  - Intentional horizontal scrolling remains limited to the submission stage stepper
  - `/camp` keeps the result count visible because the filter area now wraps instead of hiding the count in an overflow row
  - Camp/detail CTA and nav targets were raised to a safer baseline via shared `PixelButton`, nav, and tab sizing updates
  - Mobile fallback workflow controls now render inside each card on `360x800` without reintroducing horizontal overflow
- Remaining minor notes after the rerun:
  - Real mobile soft-keyboard compression is still not fully simulated by desktop Playwright
  - The compact mobile logo link remains narrow in width, though its height now meets the touch target baseline

## Passes

- `/camp?hackathon=daker-handover-2026-03` preserved the intended scoped state during direct navigation and detail-page deep-link entry
- `/hackathons/:slug` summary area, tag cluster, and summary bar did not create document-level overflow on the tested viewports
- `/war-room/:teamId` stacks cleanly on `768x1024` and `1280x800` without document-level overflow
- Follow-up rerun confirmed `/war-room/:teamId` stacks without document overflow on `360x800`
- Follow-up rerun confirmed `/camp` count visibility and CTA spacing on `360x800`

## Manual Follow-up Still Needed

- Soft-keyboard compression on real mobile devices was not fully simulated by desktop Playwright
- Contrast and fatigue checks were reviewed visually in browser screenshots, but should still get one manual phone pass before submission freeze

## Recommended Next Fix Order

1. Run the planned privacy verification for `private-hidden` and other non-public fields
2. Do one manual phone pass for keyboard compression, contrast, and fatigue before submission freeze
3. Prepare Submission 1 copy and deployment checklist based on the stabilized responsive baseline
