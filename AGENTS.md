# AGENTS.md

## Scope and intent
- This repo is a **static presentation app**: one HTML deck (`index.html`), one behavior script (`script.js`), one global stylesheet (`style.css`), plus poll pages in `poll/`.
- There is no build step or package manager in-repo; work is direct file edits and browser validation.
- Existing agent guidance in `AGENT.md` emphasizes reusing the slide class vocabulary and `.fragment` mechanics.

## Architecture and runtime contracts
- Slides are `<section class="slide">` under `#deck` in `index.html`; exactly one slide has `.active` at runtime.
- Navigation state lives in `script.js` (`currentSlide`, `goToSlide`, `next`, `prev`) and depends on per-slide `data-current-fragment` / `data-total-fragments`.
- Progressive reveal contract: any element with `.fragment` starts hidden and is revealed by adding `.visible` (CSS in `style.css`).
- Global controls are outside the deck in `index.html`: `#btn-prev`, `#btn-next`, `#slide-counter`, `#dots-container`.
- Two canvas effects are JS-driven: `#particle-canvas` (slide 1) and `#discussion-canvas` (discussion slide).

## Poll subsystem (Firebase Realtime Database)
- Presenter view is embedded in `index.html` (QR + live bars); admin lives in `poll/admin.html`; voter UI lives in `poll/vote.html`.
- Shared DB contract:
  - `active_poll` => `{ id, active, question, subtitle, options[] }`
  - `polls/{id}/results/{optionIndex}` => vote counts
  - `polls/{id}/voters/{voterId}` => vote record (double-vote prevention)
- `poll/admin.html` creates polls by multi-path `db.ref().update(updates)` and can `stopPoll()` / `resetAll()`.
- `poll/vote.html` stores `unige-poll-voter-id` in `localStorage` and blocks repeat votes per poll.

## Editing conventions that matter
- Prefer editing slide content by copying an existing `<section class="slide">` and reusing existing classes (`.content`, `.two-cols`, `.glass-card`, `.file-card`, `.tag`, `.fragment`).
- Do not rename/remove `.slide`, `.active`, `.fragment`, `.visible`, `.dot-btn`, or control IDs unless you also update `script.js` selectors.
- Keep assets referenced with relative paths (examples: `UNIGE_tout_blanc.gif`, `images/*.png|svg`).
- Preserve French presentation text style and section comment banners (`PÉRIODE ...`) when adding slides.
- Keep visual changes aligned with theme tokens in `:root` (`--unige-pink`, `--bg-dark`) in `style.css`.

## Developer workflow
- Quick local run (from repo root):
  - `python3 -m http.server 8000`
  - Open `http://localhost:8000/index.html` (and `poll/admin.html`, `poll/vote.html` when testing polls).
- Manual regression checks after edits:
  - Keyboard nav: Right/Space/PageDown/Enter next; Left/PageUp/Backspace previous.
  - Click-on-slide advance should still work except on `.nav-btn`.
  - Fragment slides should reset fragments when jumping via dots.
  - Poll flow: launch from admin -> vote once on mobile page -> live bars update on slide 3.

## External dependencies and integration points
- CDN dependencies loaded directly in HTML:
  - Google Fonts (`Inter`), Firebase compat SDK (`firebase-app-compat`, `firebase-database-compat`), QRCode.js.
- `index.html` contains hardcoded `VOTE_URL`; update this when deployment URL changes or QR voting will point to the wrong host.
- Firebase config is duplicated in `index.html`, `poll/admin.html`, and `poll/vote.html`; keep them synchronized when rotating projects.

