# Whist scorepad – modernisation & UI/UX plan

## Where the app is today

A single-screen score pad for Knock-out / Contract Whist (7→1→7 cards, 13 rounds),
built in 2020 with Create React App and deployed by running `npm run deploy`
locally, which pushes `build/` to the `gh-pages` branch (served at
`whist.alanseymour.dev`).

### Tooling

| Area        | Current                              | Status                                                                                                                                                                  |
| ----------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build       | `react-scripts` 3.4.1 (webpack 4)    | CRA is deprecated. **Confirmed:** `npm run build` fails on Node 22 with `ERR_OSSL_EVP_UNSUPPORTED`                                                                      |
| React       | 16.13 (`ReactDOM.render`)            | Two major versions behind (19)                                                                                                                                          |
| TypeScript  | 3.7                                  | Current is 5.x                                                                                                                                                          |
| Styling     | styled-components 5                  | Runtime CSS-in-JS. Fine, but adds weight to a tiny app                                                                                                                  |
| Tests       | Jest via CRA, **no tests**           | —                                                                                                                                                                       |
| Lint/format | CRA eslint, Prettier 2               | No CI enforcement                                                                                                                                                       |
| Deploy      | `gh-pages` npm package, run by hand  | No CI. Dependabot PR #1 (gh-pages 5.0.0) is still open. The `gh-pages` branch has several manual "Create CNAME" commits because earlier deploys wiped the custom domain |
| PWA         | CRA service worker, `unregister()`ed | Manifest, title and theme are still the CRA defaults ("React App")                                                                                                      |

### Bugs and UX problems in the code

1. **You can't clear an input.** `parseInput` returns `0` for NaN (`src/components/PlayerRound.tsx:17`), so deleting a bid records a bid of 0 and the round gets scored.
2. **Scores are stored when they should be computed.** Each `PlayerRound` calculates its score in a `useEffect` and pushes it up through a callback. `PlayerRow` passes a new inline arrow on every render (`PlayerRow.tsx:36`), so the fix in `58b902a` has no effect and every render causes an extra render. Scores should be computed from bids and tricks.
3. **State is scattered.** Names live in `PlayerNames`, bids/tricks in each `PlayerRound`, and scores in each `PlayerRow`. Nothing sees the whole game, so there are no totals, no leader, no validation and no persistence. **Refreshing the page or swiping the tab away loses the whole game.**
4. **No validation.** Negative numbers, bids above the round's card count, and trick totals that don't add up to the card count are all accepted.
5. **Player names use `react-contenteditable` with `html=`.** Pasted content goes in as raw HTML, the caret jumps, and there is no label.
6. **Players can be added but not removed** (there's no UI for it), and the player count can't be changed once scores exist.
7. **Advancing rounds is fiddly.** The "next round" control is a bare SVG with `onClick`: it isn't a button, has no label, is about 16px, and is keyboard-inaccessible. There's no way to go back. The first 3 rounds are visible from the start for no clear reason.
8. **The layout is fragile.** The names column and the score grid are separate flex trees that line up only because both are hard-coded to 50px + 3px borders. Any font or zoom change breaks the alignment.
9. **Nothing tells you what's happening.** There's no round number, current leader, or end-of-game result.
10. **Accessibility.** Inputs have no labels, white on `#5c6bc0` is borderline for contrast, the font is a render-blocking `@import`, and there's no dark mode.

### Rules the app implements (and nothing more)

The app only knows **bids, tricks, the 7→1→7 schedule, and one scoring formula**:
exact bid = `5 + bid`, miss = `-(5 + |bid - got|)` (`PlayerRound.tsx:28-34`).
Bidding is simultaneous, so there is no bidding order, no dealer tracking, no
"hook" rule and no trump tracking. The plan adds no rules beyond these.

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
  - `types.ts`: `Game { players: Player[]; rounds: Round[]; currentRound: number }`, `Round { cards; bids: (number|null)[]; tricks: (number|null)[] }`
  - `scoring.ts`: `scoreRound`, `runningTotals`, `standings`
  - `rounds.ts`: the 7→1→7 schedule
  - `validation.ts`: `0 ≤ bid ≤ cards`, `0 ≤ tricks ≤ cards`, tricks sum to cards. Validation **flags** problems; it never blocks entry.
- **Unit-test all of it.** This is the logic that matters.
- A single `useReducer` with actions: `addPlayer`, `removePlayer`, `renamePlayer`, `movePlayer`, `setBid`, `setTricks`, `completeRound`, `goToRound`, `newGame`.
- **Persist to `localStorage`** with a versioned schema, and auto-restore on load with a "Resume game?" prompt.
- This fixes bugs 1–4 and 6. Bug 5 goes with the setup screen in Phase 3.

### Phase 3 – UI/UX redesign (≈ 2 days)

The app is used on a phone lying on a card table, so design for that: **mobile-first, one-handed, big targets, screen stays on.**

1. **Setup screen**
   - Add, remove, rename (plain `<input>`) and reorder players with up/down buttons (2–7).
   - "Start game".
2. **Round screen** (the main screen, and the only one needed during play)
   - Header: _Round 4 of 13 · 4 cards_.
   - **One card per player, all editable at once, in any order.** Each shows the name, a **bid** stepper (−/+, 0…cards), a **tricks** stepper, and the player's **running total** going into this round. Once bid and tricks are both set, the card shows this round's result (✓ +7 / ✗ −6) and the total updates live.
   - A footer line with **Bids: 3 / 4 cards** and **Tricks: 4 / 4 cards**. Tricks not adding up is highlighted, not blocked.
   - "Next round" button, enabled once every player has a bid and tricks. Previous round is a tap away (← / →) so a mistake two rounds ago can be fixed in place; the current round always comes back on load.
   - Current leader marked on their card.
3. **History view** (secondary, swipe or tab)
   - Past rounds are less important during play, so they live off the main screen: a real `<table>` with a sticky name column, one column per completed round, and a totals column. Made/missed shown by icon and colour.
4. **Game over** (after round 13): ranked standings, "Play again with same players".
5. **Visual design**
   - CSS custom-property design tokens with light and dark themes (`prefers-color-scheme` plus a manual toggle). Keep the existing indigo as the accent, checked for AA contrast.
   - System font stack (drop the render-blocking Google `@import`).
   - **CSS Modules + tokens** (zero runtime), replacing styled-components.
   - Icons: `lucide-react`.
6. **Accessibility**: real buttons, labelled inputs, visible focus, 44px targets, `aria-live` for round results, `prefers-reduced-motion` respected.
7. **PWA / table ergonomics**
   - `vite-plugin-pwa` for offline use and installing to the home screen.
   - A proper manifest, name, icons and theme colour. Fix `<title>` and the description.
   - **Screen Wake Lock API** while a game is in progress.

### Phase 4 – Polish (optional)

- Share the final scores as text (Web Share API).
- Playwright smoke test of a full 13-round game in CI (Chromium is already available).
- README rewrite covering rules, local dev and deploy.

---

## Suggested PR sequence

1. `chore: migrate CRA → Vite, React 19, TS 5, Vitest, ESLint 9` (no UI change)
2. `ci: GitHub Actions Pages deploy + PR checks + dependabot` (then switch the Pages source)
3. `feat: game model, scoring tests, reducer, localStorage persistence` (existing UI rewired)
4. `feat: setup screen + round screen`
5. `feat: history table, game-over screen, dark mode`
6. `feat: PWA, wake lock, manifest/branding`
