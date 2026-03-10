# SSOT Strict Alignment Evidence

- Date: 2026-03-10 KST
- Scope:
  - public contact link guard
  - source-limited hackathon detail shell
  - public submit draft handoff flow
  - war-room draft import and white-card readability

## Why

- The product had several gaps between the canonical docs and the shipped behavior:
  - placeholder contact links could navigate to dead external pages
  - a hackathon present in the public list but missing from the public detail source fell back to a generic empty section message
  - the public submit CTA on hackathon detail was effectively a self-anchor instead of a real action
  - war-room white-card summary values still used low-contrast accent text on light surfaces

## What Changed

1. Public contact links
- Raw team contact URLs are now normalized through a validity guard.
- Invalid placeholder/demo links are removed from public rendering.
- Public team cards and detail team cards now show `연락처 준비중` instead of opening dead external pages.

2. Source-limited hackathon detail
- `/hackathons/:slug` now keeps the required 8-section shell even when a matching raw detail payload is missing.
- Missing sections render as intentional limited-state panels, not invented facts and not a generic blank fallback.
- `monthly-vibe-coding-2026-02` now follows this source-limited path.

3. Public submit handoff flow
- The public submit section remains visible on hackathon detail.
- It now stores a browser-local pending draft and sends the user to:
  - `/war-room/:teamId` when exactly one local team matches the hackathon
  - `/camp?hackathon=:slug` when the team context is missing or ambiguous

4. War-room import behavior
- `/war-room/:teamId` imports pending submit drafts into team-local state on load.
- Imported draft data is reflected through notes and submission artifact state, then cleared from the browser-local pending store.
- Basecamp summary values now use dark readable text with tinted pill styling on white cards.

## Follow-up Fixes

- Self-review found 3 gaps in the first strict-alignment pass:
  - source-limited start dates were falling back to the current timestamp
  - invalid URL draft values could still move submit readiness to `draft`
  - file-style public submit requirements looked like real uploads while only storing a filename
- Follow-up corrections:
  - missing `eventStartAt` / `registrationStartAt` now remain source-limited and render as `미공개`
  - war-room import promotes readiness only from:
    - non-empty text fields with a mapped text stage
    - valid `http/https` URL fields with a mapped URL stage
  - file-style public submit requirements are now note-only prep fields and never create fake upload state
  - only valid URL fields can become team-local `SubmissionArtifact` entries
  - ended hackathons now keep public `Teams` / `Submit` visible as archive context only, without recruiting or draft-start actions

## Validation

- `npm run lint`
- `npm run build`

## SSOT Alignment Notes

- Team-local authority still lives in `war-room`, `submissions`, and `submissionArtifacts`.
- Public detail may collect a draft, but it must not directly expose team-local notes, checklist state, or artifact links.
- Missing bootstrap detail is treated as `source-limited`, not as an invitation to generate new factual content.
