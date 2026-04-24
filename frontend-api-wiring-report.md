# HYD Traffic Intel — Frontend Change Handoff (Pre-Push)

## Scope
This handoff summarizes the current working-tree changes for UI responsiveness, API wiring, and interaction polish before pushing.

## Files Changed

### `src/main.tsx`
- Added React Query setup:
  - `QueryClient`
  - `QueryClientProvider`
- Wrapped app router with `QueryClientProvider` so pages can consume server data via `useQuery`.

### `src/api/incidents.ts` (new)
- Added frontend API client layer with shared types and fetch helpers.
- Endpoint base URL:
  - `VITE_API_URL` fallback to `http://localhost:3001`
- Added typed helpers:
  - `fetchIncidents(params)`
  - `fetchIncident(id)`
  - `fetchIntelligence(days)`
- Added response/type contracts for:
  - incidents rows + pagination
  - intelligence summary/hourly/by_type/hotspots/heatmap

### `src/pages/LiveMapPage.tsx`
- Replaced mock incident data with React Query API data.
- Added transform function from API row shape to UI shape.
- Added query behavior:
  - key: `['incidents', 'live']`
  - filter params: `status=active,expiring&today=true`
  - refresh every 30s, stale time 20s
- Added incident filters (all / accidents / congestion) with chip state.
- Updated marker/list/popup selection model to ID-based state (`selectedIncidentId`).
- Added loading/error/empty states in incident rail.
- Popup now uses API-backed text/image fields (`raw_message`, `photo_url`, delay mins).
- Mobile responsiveness updates:
  - map + overlays changed to mobile-first flow under `md`
  - filter chips become horizontal scrollable on small widths
  - incident rail moves in-flow on mobile, desktop rail preserved
  - stats cards stack/wrap on mobile and keep desktop strip behavior
  - increased mobile stats card vertical padding

### `src/pages/IntelligencePage.tsx`
- Replaced static mock dashboard data with API-driven data (`fetchIntelligence(365)`).
- Added derived UI computations:
  - normalized hourly bars
  - type distribution + donut stops
  - hotspot severity labels/classes
  - day/hour heatmap matrix normalization
- KPI cards now bind to API summary values:
  - total today
  - active now
  - average duration
  - focus junction
- Improved overflow behavior for hotspot and heatmap panels with internal scrolling.

### `src/pages/HistoryPage.tsx`
- Replaced static archive data with paginated API data.
- Added filter/query state:
  - page
  - type filter
  - date from/to
  - text search
- Added client-side search over current page results.
- Added details panel binding to selected incident row.
- Added pagination controls (Prev/Next + page indicator).
- Added custom date picker integration with `react-day-picker`:
  - month and year dropdowns
  - year range 2025–2030
  - hidden default navigation
  - custom `CalendarGlassDropdown`
- Date filter UX fixes:
  - removed duplicate month label effect
  - stabilized month/arrow alignment in custom dropdown trigger
  - constrained dropdown popup inside local filter context anchor (`absolute left-0 top-full`)
  - improved mobile sizing and table/day-cell density
- Search bar mobile fixes:
  - `min-w-0` and `flex-1` behavior
  - input `h-10`, `appearance-none`
  - mobile-safe `text-[16px]`
  - `items-stretch` on mobile + `md:items-center` desktop

### `src/components/navigation/TopNav.tsx`
- Replaced text title with `HydLogo`.
- Added mobile hamburger menu with route links:
  - `/live-map`
  - `/intelligence`
  - `/history`
- Added a11y attributes (`aria-expanded`, `aria-controls`, dynamic labels).
- Preserved profile button visibility on all breakpoints.
- Desktop nav updated to segmented-control style with active pill.
- Fixed inactive desktop tab contrast (readable non-white text).

### `src/components/HydLogo.tsx` (new)
- Added reusable Telugu logo component used by TopNav.
- Added `width` prop for controlled sizing (removed hardcoded 1000px wrapper behavior).
- Adjusted internal alignment/transform origin to start-align within width block.
- Subtitle row intentionally commented out.

### `src/index.css`
- Added calendar dropdown glass styles:
  - `.calendar-glass-dropdown-root`
  - `.calendar-glass-options`
  - `.calendar-glass-option`
  - `.calendar-glass-option-active`
- Dropdown background set to fully opaque white for month/year menu readability.
- Existing live/intelligence style primitives retained.

### `package.json` / `package-lock.json`
- Added dependencies:
  - `@tanstack/react-query`
  - `react-day-picker`
  - `date-fns`
- Lockfile updated accordingly.

### `public/fonts/` (new)
- Added custom font asset(s) used by HydLogo (`CineFonts-Taruni.ttf`).

## Validation Status

### Build
- `npm run build` ✅ passes.
- Vite reports large chunk warning (Mapbox-heavy build), but build completes successfully.

### Lint
- `npm run lint` ❌ fails on one existing issue in `src/components/HydLogo.tsx`:
  - `@typescript-eslint/ban-ts-comment` for `@ts-ignore` at paintOrder line.

## Known Issues / Caveats
- Lint gate currently blocked by single `@ts-ignore` usage in `HydLogo`.
- Calendar popup positioning has been iteratively tuned for mobile context behavior; current implementation anchors popups to each date control container instead of runtime width math.
- API-dependent pages require backend availability at `VITE_API_URL` (or `http://localhost:3001` fallback).

## Pre-Push Checklist
- [ ] Replace `@ts-ignore` with lint-compliant typing approach in `HydLogo` and rerun lint.
- [ ] Quick visual smoke test at mobile + desktop breakpoints:
  - TopNav hamburger + segmented desktop nav
  - Live Map chip rail / panel / stats responsiveness
  - History date dropdown behavior inside filter context
- [ ] Ensure `.env.local` has required values (`VITE_MAPBOX_TOKEN`, optional `VITE_API_URL`).
- [ ] Re-run:
  - `npm run lint`
  - `npm run build`

## Current Working Tree Snapshot
- Modified:
  - `package-lock.json`
  - `package.json`
  - `src/components/navigation/TopNav.tsx`
  - `src/index.css`
  - `src/main.tsx`
  - `src/pages/HistoryPage.tsx`
  - `src/pages/IntelligencePage.tsx`
  - `src/pages/LiveMapPage.tsx`
- Untracked:
  - `public/fonts/`
  - `src/api/`
  - `src/components/HydLogo.tsx`
