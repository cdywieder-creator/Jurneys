# JOURNEYS — THE TAKEOFF

A cinematic, scroll-controlled website studio portfolio. The page is a full-screen architectural flight sequence: scrolling advances or reverses the camera through an amber-lit gallery, and actual FillPack and MRBL websites enter the foreground as the work takes center stage.

This rebuild replaces the earlier conventional portfolio layout and decorative paper-plane animation. The visual reference is https://sebastien-lempens.com/. JOURNEYS uses original Kie.ai-generated footage and its own compositions; none of the reference site's code, models, imagery, or audio is reused.

## Public browser preview

The GitHub Pages preview is published from `main` by `.github/workflows/pages.yml`:

https://cdywieder-creator.github.io/Jurneys/

The workflow runs the API/timeline checks, builds with the `/Jurneys/` asset prefix, and deploys the static output. The preview includes the complete scrolling film and portfolio interaction. Inquiry delivery is deliberately disabled in this static preview; visitors are told that their message was not sent and can download it instead. No Kie.ai key or server credential is needed to view it.

To reproduce the Pages build locally:

```sh
VITE_STATIC_PREVIEW=true npm run build -- --base=/Jurneys/
```

## View in Replit

Import `https://github.com/cdywieder-creator/Jurneys`, then press **Run** and open **Preview**. The included `.replit` file installs dependencies and starts Vite on port 5173. Node.js 22.12+ or 24+ is required to view the website. All film frames, fonts, and project screenshots are included; viewing needs no Kie.ai key.

If you imported the previous version, pull the latest `main` branch through Replit's Git panel (or run `git pull origin main` in its Shell), then stop and restart **Run**.

## Run on your computer

Open a terminal in the directory containing `package.json`:

```sh
npm ci
npm run dev
```

Open the address printed by Vite. Changes update automatically. Stop with Ctrl+C.

## The cinematic experience

The original 8-second Kie.ai film is served as 192 optimized WebP frames. A Canvas renderer maps native scroll progress to the footage, with brief camera easing. It does not intercept wheel/touch input, autoplay the footage, loop the plane, or play audio. Scrolling backwards reverses the scene; stopping holds the frame. The first real project arrives within roughly two viewport lengths.

The six chapters hold their messages through most of each scroll interval. Large, perspective-transformed screens show the actual portfolio work. Work navigation seeks directly to FillPack. A clear inquiry link remains available in the fixed navigation. Clicking a showcase opens the live website in an accessible dialog, with a direct external link as an alternative.

The renderer limits decoded-frame memory, loads neighboring frames on demand, and retains a static opening poster while frames load. Phone layouts simplify the screen composition and reduce prefetching. With reduced motion, the same story becomes a clear sequence of static cinematic scenes. The **Less motion** control also allows visitors to choose that sequence manually.

## Actual portfolio sources

- FillPack: https://fillpackusa.com/
- MRBL: https://mrbl-management-website.replit.app

The included screenshots were captured from these supplied live sites. External websites must remain available and permit iframe embedding for the optional interactive dialog.

## Kie.ai visuals

The cinematic film was generated through the official Jobs API with `veo-3-1` / `veo3_fast`, then extracted into a scroll sequence with ffmpeg. The original text prompt and resumable pipeline are in `scripts/generate-film.mjs`.

To intentionally generate a new film, securely configure `KIE_API_KEY`, install ffmpeg with WebP encoding support, and use Node.js 24+:

```sh
npm run visuals:film -- --new
```

This consumes Kie.ai credits. Without `--new`, a complete existing sequence is reused. Pending tasks are recorded in ignored `.cache` files and resumed. The command downloads the film without forwarding authorization to the output CDN. TLS verification remains enabled. Node's environment-proxy support handles the cloud proxy.

The script uses `https://api.kie.ai/api/v1/jobs/createTask` and `/recordInfo`. Documentation: https://docs.kie.ai/veo3-api/generate-veo-3-video

The older still-art generators remain in the repository, but the website no longer displays the decorative paper-plane artwork. None of the generation commands runs automatically during installation or startup. Never commit credentials or `.env` files.

## Inquiry delivery — not connected yet

Set `CONTACT_WEBHOOK_URL` to a verified HTTPS destination that accepts POSTed JSON containing `source`, `name`, `email`, `business`, `message`, and `submittedAt`. In the cloud, allow that destination in network settings. The Node API validates fields, limits requests, and reports success only after the destination accepts the message.

Until configured, the form clearly says the inquiry was not sent and offers a local text download. No inquiries are logged or stored locally. Supply verified team details and a public contact option before launch; none has been invented.

## Production

With Node.js 24+:

```sh
npm run build
npm start
```

The Node server defaults to port 3000. Deploy this server to retain inquiry delivery. Static hosting needs its own `/api/inquiry` implementation.

## Validation

```sh
npm test
npm run test:browser
npm run build
```

Eight API/timeline tests verify form validation, secure delivery requirements, honest missing-destination responses, message holds, scroll/frame mapping, and all 192 distinct film assets. Nine Chromium tests check the complete opening, forward/pause/reverse film behavior, direct work navigation, live-site dialog and keyboard focus, reduced motion, manual motion switching, responsive layouts, and form fallback/success states. Successful delivery is tested with a controlled fixture; no real destination has been supplied.

On a fresh local machine, run `npx playwright install chromium` before browser tests. The cloud uses `/usr/bin/chromium`; set `PLAYWRIGHT_CHROMIUM_PATH` for another installed browser.

## Cloud startup

Use the existing `/workspace/Jurneys` checkout; cloud tasks are already isolated, so no Git worktree is needed. Restore dependencies with `npm ci --cache /workspace/.npm`, then run `npm run dev -- --port 5173`. Restart processes after snapshot restoration. No paid generation is needed to start the site.
