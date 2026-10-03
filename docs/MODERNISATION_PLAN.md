# Whist scorepad – modernisation & UI/UX plan

## Where the app is today

A single-screen score pad for Knock-out / Contract Whist (7→1→7 cards, 13 rounds),
built in 2020 with Create React App and deployed by running `npm run deploy`
locally, which pushes `build/` to the `gh-pages` branch (served at
`whist.alanseymour.dev`).

### Tooling

| Area | Current | Status |
|---|---|---|
| Build | `react-scripts` 3.4.1 (webpack 4) | CRA is deprecated. Webpack 4 fails on Node ≥17 (`ERR_OSSL_EVP_UNSUPPORTED`), so the app does not build on current Node LTS without a legacy-OpenSSL flag |
| React | 16.13 (`ReactDOM.render`) | Two major versions behind (19) |
| TypeScript | 3.7 | Current is 5.x |
| Styling | styled-components 5 | Runtime CSS-in-JS. Fine, but adds weight to a tiny app |
| Tests | Jest via CRA, **no tests** | — |
| Lint/format | CRA eslint, Prettier 2 | No CI enforcement |
| Deploy | `gh-pages` npm package, run by hand | No CI. Dependabot PR #1 (gh-pages 5.0.0) is still open. The `gh-pages` branch has several manual "Create CNAME" commits because earlier deploys wiped the custom domain |
| PWA | CRA service worker, `unregister()`ed | Manifest, title and theme are still the CRA defaults ("React App") |

### Bugs and UX problems in the code

1. **You can't clear an input.** `parseInput` returns `0` for NaN (`src/components/PlayerRound.tsx:17`), so deleting a bid records a bid of 0 and the round gets scored.
2. **Scores are stored when they should be computed.** Each `PlayerRound` calculates its score in a `useEffect` and pushes it up through a callback. `PlayerRow` passes a new inline arrow on every render (`PlayerRow.tsx:36`), so the fix in `58b902a` has no effect and every render causes an extra render. Scores should be computed from bids and tricks.
3. **State is scattered.** Names live in `PlayerNames`, bids/tricks in each `PlayerRound`, and scores in each `PlayerRow`. Nothing sees the whole game, so there are no totals, no leader, no validation and no persistence. **Refreshing the page or swiping the tab away loses the whole game.**
4. **No validation.** Negative numbers, bids above the round's card count, and trick totals that don't add up to the card count are all accepted.
5. **Player names use `react-contenteditable` with `html=`.** Pasted content goes in as raw HTML, the caret jumps, and there is no label.
6. **Players can be added but not removed** (there's no UI for it), and the player count can't be changed once scores exist.
7. **Advancing rounds is fiddly.** The "next round" control is a bare SVG with `onClick`: it isn't a button, has no label, is about 16px, and is keyboard-inaccessible. There's no way to go back. The first 3 rounds are visible from the start for no clear reason.
8. **The layout is fragile.** The names column and the score grid are separate flex trees that line up only because both are hard-coded to 50px + 3px borders. Any font or zoom change breaks the alignment.
9. **Nothing tells you what's happening.** There's no dealer, round number, current leader, or end-of-game result.
10. **Accessibility.** Inputs have no labels, white on `#5c6bc0` is borderline for contrast, the font is a render-blocking `@import`, and there's no dark mode.

> **Scoring rule** (`PlayerRound.tsx:28-34`): exact bid = `5 + bid`, miss = `-(5 + |bid - got|)`.
> This looks like a house rule. Keep it as the default and make it configurable, not "fixed".

---

## Plan

Each phase can ship on its own. Phases 1–2 are the foundation, and Phase 3 is where the user-visible gains are.

### Phase 1 – Toolchain & deploy (≈ half a day)

- Replace CRA with **Vite + React 19 + TypeScript 5**. Use `base: '/'` because of the custom domain.
- Replace `ReactDOM.render` with `createRoot`. Delete `serviceWorker.ts` and the CRA boilerplate.
- **Vitest + Testing Library** (jsdom), **ESLint 9 flat config** (typescript-eslint, react-hooks) and **Prettier 3**. Keep the existing Prettier settings.
- Pin Node with `.nvmrc` / `engines` (Node 22 LTS).
- **Deploy with GitHub Actions** (`.github/workflows/deploy.yml`): on push to `master`, run `npm ci`, lint, test and build, then `actions/upload-pages-artifact` and `actions/deploy-pages`.
  - In repo Settings → Pages, change the source from "branch: gh-pages" to "GitHub Actions". Keep `public/CNAME` so the domain survives.
  - Remove the `gh-pages` dependency and the `predeploy`/`deploy` scripts, and close Dependabot PR #1.
  - Keep the `gh-pages` branch for one release as a rollback, then delete it.
- Add a `ci.yml` that runs lint, typecheck and test on PRs, plus a `.github/dependabot.yml` with grouped weekly npm and actions updates.

### Phase 2 – Game model & state (≈ 1 day)

- Add a pure, framework-free module `src/game/`:
  - `types.ts`: `Game { players: Player[]; rounds: Round[]; settings }`, `Round { cards; dealer; bids: (number|null)[]; tricks: (number|null)[] }`
  - `scoring.ts`: `scoreRound`, `runningTotals`, `standings`, with the rule chosen through `settings`
  - `rounds.ts`: builds the schedule (7→1→7 by default, or max cards = `floor(52 / players)`) and dealer rotation
  - `validation.ts`: bids ≤ cards, tricks sum to cards, optional dealer "hook" rule (bids may not sum to cards)
- **Unit-test all of it.** This is the logic that matters.
- Use a single `useReducer` (or a small Zustand store) with actions: `addPlayer`, `removePlayer`, `renamePlayer`, `reorderPlayers`, `setBid`, `setTricks`, `nextRound`, `undo`, `newGame`.
- **Persist to `localStorage`** with a versioned schema, and auto-restore on load with a "Resume game?" prompt.
- This fixes bugs 1–6 above.

### Phase 3 – UI/UX redesign (≈ 2–3 days)

The app is used on a phone lying on a card table, so design for that: **mobile-first, one-handed, big targets, screen stays on.**

1. **Setup screen**
   - Add, remove, rename (plain `<input>`) and drag-to-reorder players (2–7).
   - Pick the first dealer, rounds pattern and scoring rule, then press "Start game".
2. **Round screen** (the main screen)
   - Header: *Round 4 of 13 · 4 cards · Alice deals*.
   - **Bids step:** one row per player in bidding order (left of dealer first), with −/+ steppers or a number chip row (0…cards). A live "Bids: 3 / 4 cards" counter warns about the hook rule on the dealer.
   - **Tricks step:** the same layout. "Confirm round" is disabled until tricks total the number of cards.
   - After confirming, show a short round summary (✓ made / ✗ missed, ±points), then move to the next round automatically.
   - Undo / edit previous round.
3. **Scoreboard view** (tab or swipe)
   - A real `<table>` with a **sticky name column and sticky header** (this fixes the alignment bug), rounds as columns and a totals column.
   - Made/missed shown by colour and icon, not colour alone. Current leader highlighted.
   - Portrait: a compact standings list with sparkline or rank change. Landscape: the full grid.
4. **Game over**: ranked podium, per-player stats (bids made %, best round), "Play again with same players".
5. **Visual design**
   - CSS custom-property design tokens with light and dark themes (`prefers-color-scheme` plus a manual toggle). Card-table green or the existing indigo as the accent, checked for AA contrast.
   - A system font stack, or a self-hosted variable font via `@fontsource` (no render-blocking Google `@import`).
   - Styling: **CSS Modules + tokens** (zero runtime) is recommended. Upgrading to styled-components 6 is a fine alternative if you prefer to keep it.
   - Icons: `lucide-react` or `react-icons` v5.
6. **Accessibility**: real buttons, labelled inputs (`inputMode="numeric"`), visible focus, 44px targets, `aria-live` for the round result, and `prefers-reduced-motion` respected.
7. **PWA / table ergonomics**
   - `vite-plugin-pwa` for offline use and installing to the home screen.
   - A proper manifest, name, icons and theme colour. Fix `<title>` and the description.
   - **Screen Wake Lock API** while a game is in progress.
   - Optional haptics (`navigator.vibrate`) on confirm.

### Phase 4 – Polish (optional)

- Share the final scores as an image or text (Web Share API).
- Game history in `localStorage`.
- Playwright smoke test of a full 13-round game in CI (Chromium is already available).
- README rewrite covering rules, local dev and deploy.

---

## Suggested PR sequence

1. `chore: migrate CRA → Vite, React 19, TS 5, Vitest, ESLint 9` (no UI change)
2. `ci: GitHub Actions Pages deploy + PR checks + dependabot` (then switch the Pages source)
3. `feat: game model, scoring tests, reducer, localStorage persistence` (existing UI rewired)
4. `feat: setup + round-entry flow`
5. `feat: scoreboard table, game-over screen, dark mode`
6. `feat: PWA, wake lock, manifest/branding`
