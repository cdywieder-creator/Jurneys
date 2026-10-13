# JOURNEYS — THE TAKEOFF

A responsive website studio portfolio: warm ivory, charcoal, amber, a Kie.ai-generated sculptural plane, and a scroll-controlled six-scene journey. Built with Vite, vanilla JavaScript and CSS, and a small Node.js inquiry API.

## Run on your computer

Install **Node.js 22.12+ or Node.js 24+**, extract the project, and open a terminal in the `Jurneys` directory:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Changes in `src/main.js` and `src/style.css` update immediately. Stop the server with Ctrl+C. All fonts, screenshots and generated artwork are local; a Kie.ai key is not needed to view the website.

## View in Replit

Import `https://github.com/cdywieder-creator/Jurneys` into Replit, then press **Run**. The included `.replit` configuration installs dependencies, starts Vite on port 5173, and maps it to the web Preview. Use Node.js 22.12+ or 24+. The included visuals work without supplying a Kie.ai key. Add credentials only to Replit Secrets if you intentionally regenerate artwork.

## Production

```sh
npm run build
npm start
```

The production server and Kie.ai scripts require Node.js 24+. The production server defaults to port 3000. Deploy the Node server to retain inquiry delivery. A static-only deployment can display the website but requires a separate `/api/inquiry` implementation to send inquiries.

## Kie.ai visuals

The amber plane was actually generated using `nano-banana-pro`; its background was removed with `recraft/remove-background`. The optimized transparent WebP is included in `public/assets/generated/`, with a provenance manifest. A vector plane remains as the local fallback. Kie.ai is only called server-side; API credentials are never included in the browser bundle.

To intentionally regenerate the artwork, set `KIE_API_KEY` securely in your environment, or in an ignored local `.env` file based on `.env.example`:

```sh
npm run visuals:generate -- --new
npm run visuals:cutout
```

These commands consume Kie.ai credits. Without `--new`, existing artwork is reused. Incomplete tasks are recorded in ignored `.cache` files and resumed rather than submitted again. `KIE_TASK_ID` can also resume a specific generation. Keep `.cache` until pending jobs complete. The scripts preserve TLS verification and support the cloud HTTPS proxy through Node 24's `--use-env-proxy` flag. Never share your `.env` or include it in source control.

Generation uses the official Jobs API at `https://api.kie.ai/api/v1/jobs/createTask` and `/recordInfo`. If an output CDN is blocked, allow its hostname in the environment settings and resume the existing task. The included WebP files are optimized for the website; newly generated PNG files may be optimized before launch.

API references:
- https://docs.kie.ai/market/google/pro-image-to-image
- https://docs.kie.ai/market/recraft/remove-background

## Actual portfolio work

Both showcases use screenshots captured from the supplied live websites:
- FillPack: https://fillpackusa.com/
- MRBL: https://mrbl-management-website.replit.app

Click a large showcase to interact with the live site in an accessible modal. Each project also has a direct link. Third-party sites must remain available and permit embedding; the external link remains an alternative if embedding is later disabled.

## Inquiry delivery — still needs configuration

Set `CONTACT_WEBHOOK_URL` to your verified **HTTPS** inquiry destination. It must accept POSTed JSON containing `source`, `name`, `email`, `business`, `message`, and `submittedAt`. In the cloud, allow that destination hostname in environment network settings. No inquiry is logged or stored locally. The API validates fields, limits request size and rate, and only reports success after the destination accepts the request.

Until a destination is configured, the form honestly reports that the inquiry was not sent and offers a text download. No direct email or team names have been invented. Supply verified studio team details and a public contact address before launch.

## Validation

```sh
npm test
npm run test:browser
npm run build
```

Five API tests verify validation, origin checks, secure webhook requirements, missing delivery configuration, and accepted webhook delivery. Seven Chromium tests cover all scenes, generated artwork, anchor navigation, live project links and modal keyboard behavior, form success and fallback states, responsive overflow at 320/390/768/1440px, and reduced motion. Delivery success is tested against a controlled fixture; a real destination remains unconfigured.

In a fresh local checkout, install the browser for Playwright first:

```sh
npx playwright install chromium
```

The cloud uses its installed `/usr/bin/chromium`; set `PLAYWRIGHT_CHROMIUM_PATH` to use another installed browser.

## Environment startup

Use the existing checkout at `/workspace/Jurneys`. Cloud tasks are already isolated; no Git worktree is needed. Run `npm ci --cache /workspace/.npm` to restore dependencies, then `npm run dev -- --port 5173`. Restart processes after snapshot restoration. Kie.ai generation is optional and should never run automatically during installation or startup.
