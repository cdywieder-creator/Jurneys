# Flight redesign review

Original Three.js aircraft and seeded procedural cloud texture; no reference artwork or generated paid assets were used. Existing FillPack and MRBL screenshots remain the actual project previews. The previous film assets remain archived in the repository but are no longer requested by the website.

Screenshots: opening, bank, climb/camera turn, work, inquiry, mobile, reduced motion. Recreate with `npm run dev` and `node scripts/review.mjs` using system Chromium.

Verified in Chromium: actual wheel scrolling forward and backward, settling when scrolling stops, native anchor navigation, project destinations, 320/390/768/1440 layouts without horizontal overflow, reduced-motion static aircraft, and unsent inquiry with downloadable text. Five Playwright checks pass, along with the existing eight unit/API checks. The GitHub Pages production build uses `/Jurneys/` and static inquiry mode.

Network limitation: the environment denies journeysagency.com, cdywieder-creator.github.io and api.github.com. Reference browsing and public Pages verification could not be completed. The supported network configuration update returned draft_not_editable. Git fetch/push and github.com web pages are available.
