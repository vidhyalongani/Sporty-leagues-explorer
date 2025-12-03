# Sporty-leagues-explorer

Single-page React/Vite app to explore sports leagues via TheSportsDB API. Search and filter leagues by sport, view badge imagery on selection, and cache responses for speed. Built with TypeScript and Node 22.19+.

## Getting started

- Install dependencies: `npm install`
- Run the dev server: `npm run dev`
- Lint: `npm run lint`
- Build for production: `npm run build`
- Run tests: `npm test` (Vitest + RTL, jsdom)

## Notes and decisions

- **API & caching:** League results are cached at module level to avoid re-fetching on remount. Badges use an in-flight guard plus cache; fallback badge is used on errors.
- **Validation:** Leagues and badge payloads are validated with `zod` before use; badge fetch defaults to fallback on invalid data.
- **Accessibility:** Badge modal autofocuses the close button, traps tab navigation, and closes on Escape/click outside.
- **Styling:** Palette is centralized in CSS variables (`:root` in `src/index.css`); `src/App.css` uses variables for colors and gradients.
- **Testing:** Vitest + React Testing Library integration tests cover loading, filters, error state, and badge refetch guard. Config lives in `vitest.config.ts` with `src/setupTests.ts` loading `@testing-library/jest-dom`.
- **Branding:** UI colors, logo, and favicon follow Sporty branding for continuity.

## Detailed decisions

- **Stack:** React + TypeScript + Vite for fast dev/build. ESLint + TS configs in place; Vitest + RTL for tests; jsdom for DOM env.
- **State & memoization:** `useMemo` for filtered lists/sports, `useDeferredValue` to debounce search, `useCallback` for handlers and badge fetch to keep memoized children stable.
- **Performance:** Module-level league cache to avoid repeat fetches; badge fetches guarded (in-flight set + cache) to prevent duplicate calls; zod validation keeps bad payloads from rendering.
- **UI/UX:** Component-based layout (filters, list, card, modal, loader). CSS variables drive consistent colors/spacings; responsive layout uses clamps and auto-fit grids.
- **Accessibility:** Modal focus management (initial focus + tab trap + Escape close); form controls have descriptive `aria-label`s; error and empty states announced via standard roles.
- **Testing focus:** Integration tests exercise loading, filtering, error handling, and badge-cache guard. (Add modal a11y tests as a next step if time permits.)

## How to use

- **Search:** Type in the search box to filter by league or alternate name (case-insensitive, deferred with `useDeferredValue`).
- **Filter by sport:** Choose a sport from the dropdown (`All` by default) to narrow results.
- **View badge:** Click a league to open its badge modal; badge requests are cached and use a fallback on error.
- **Counts & legend:** Footer bar shows how many filtered leagues are displayed and legend dots for sport/alternate name tags.

## Project layout

- `src/App.tsx` — main SPA: fetch/filter logic, cache guards, modal, loader, footer legend.
- `src/components/` — UI pieces (filters, list, cards, modal, loader).
- `src/constants/` — API URLs, UI strings.
- `src/App.css` / `src/index.css` — styling, CSS variables.
- `src/App.test.tsx` — integration tests.
- `vitest.config.ts`, `src/setupTests.ts` — test environment config.

## Known behaviors

- Module-level league cache persists across mounts; tests reset modules to avoid leakage.
- Badge fetch falls back silently to the bundled SVG if remote badge fails/invalid.
- Modal does not yet surface an explicit badge-error message; fallback image is shown instead.

## Tooling note

- AI assistance was used for scaffolding, planning (including UI/layout discussion), testing guidance, and checking health/edge cases; decisions were verified and adjusted manually.

## Conventions

- Lint: `npm run lint`; Test: `npm test`; Build: `npm run build`.
- Commit style: concise prefixes (e.g., `feat:`, `fix:`, `test:`) to describe intent.

## Time & QA

- Estimated 90 minutes; actual ~3 hours to cover caching/validation, responsive UI, additional UX (loader, results count, fallback badge, clear filter option), and test coverage.
- Manual checks: Lighthouse for perf/accessibility, React DevTools profiler for render hotspots/memo effectiveness, responsive verification across breakpoints.
