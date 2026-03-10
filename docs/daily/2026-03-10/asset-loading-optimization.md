# 2026-03-10 - Asset Loading Optimization

## Summary

- Implemented runtime asset delivery optimization without changing the visible font families or requesting new external assets.
- Kept original PNG and TTF files in place, then added lighter web-delivery derivatives for the heaviest runtime assets.

## Changes

- Generated new image derivatives for runtime use:
  - `public/og-image-hero.webp`
  - `public/Aimers.webp`
  - `public/monthly.webp`
  - `public/ranking3.webp`
- Generated font derivatives:
  - `public/fonts/press-start-2p/PressStart2P.woff2`
  - `public/fonts/DungGeunMo/DungGeunMo.woff2`
- Replaced the home hero with a purpose-sized `og-image-hero.webp`, preserving `priority` and matching the actual display width.
- Updated list/detail/rankings `next/image` usage to provide explicit `sizes`.
- Refined the card and banner `sizes` values to match the actual grid widths.
- Updated seeded hackathon thumbnails to use the optimized `.webp` assets.
- Updated Next image config to prefer `avif` and `webp`.
- Updated `DungGeunMo` loading to `preload: false` while keeping `Press Start 2P` preloaded.
- Removed `priority` from decorative detail and ranking banners.

## Follow-up: Detail Banner Policy Change

- `/hackathons/:slug` no longer uses a hardcoded common banner (`/banner.webp`).
- Detail hero image now uses each hackathon's `thumbnailUrl` field dynamically.
- If `thumbnailUrl` is absent, the image block is hidden and the page renders as a text header.

## Follow-up: Unused Asset Cleanup

- Deleted unused files after full reference audit:
  - `link.svg`, `banner.png`, `banner.webp`, `og-image.png`, `Aimers.png`, `monthly.png`, `ranking3.png`
  - `design_reference/` directory (8 design PNG files, no code references)
- Removed ghost `war-room.svg` background reference from `/war-room/:teamId` (file never existed).

## Current Active Public Assets

- Images: `og-image-hero.webp`, `Aimers.webp`, `monthly.webp`, `ranking3.webp`, `hacker.png`
- SVGs: `logo.svg`, `favicon.svg`, `checklist.svg`, `rocket.svg`, `search.svg`, `team.svg`, `trophy.svg`
- Fonts: `fonts/press-start-2p/PressStart2P.woff2`, `fonts/DungGeunMo/DungGeunMo.woff2`

## Verification

- `npm run lint` passed
- `npm run build` passed

## Notes

- This change optimized delivery only; it did not change the visible typeface choices.
- Original heavy PNG source files were removed after webp derivatives replaced all runtime references.
