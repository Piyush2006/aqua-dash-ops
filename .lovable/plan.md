# Smart Utility Operations Platform — Build Plan

A clickable, mock-data-driven enterprise SaaS prototype. Light theme, deep-blue/cyan palette, Stripe/SAP Fiori-level polish. All data is in-memory (no backend) so every screen renders instantly and navigates end-to-end.

## Scope & approach

- **Prototype, not production**: all data lives in `src/mocks/` as typed TS fixtures. Buttons like "Generate Bill", "Approve Tariff", "Upload Reads" open dialogs and fire toasts — no persistence.
- **No auth gate**: Login/Forgot Password are reachable routes that visually mimic auth, but clicking "Sign in" just navigates to `/dashboard`. Keeps the prototype demo-friendly.
- **Light theme only** (per brief).
- **Charts**: Recharts (already idiomatic with shadcn/ui chart wrapper).
- **Tables**: TanStack Table for sort/filter/pagination/column visibility.
- **Icons**: lucide-react.
- **Routing**: TanStack Start file-based routes, one route per screen so every nav item deep-links.

## Design system (src/styles.css)

- Background `#FFFFFF`, surface `#F7F9FC`, border `#E5E9F0`
- Primary deep blue `oklch(0.42 0.15 255)`, primary-hover one step darker
- Cyan accent `oklch(0.72 0.13 215)` for highlights/links
- Success green, amber warning, red critical, neutral muted — all as semantic tokens
- Typography: Inter via `<link>` (display + body), tight tracking on KPI numbers
- Tokens: `--shadow-card`, `--shadow-elevated`, `--radius` 12px, gradient tokens for KPI cards
- All component colors via tokens — no hardcoded hex in components

## App shell

- `src/routes/_app.tsx` — authenticated layout (no real auth) with:
  - **Collapsible left sidebar** (`components/shell/Sidebar.tsx`) — icons + labels, nested submenus, active state, collapse toggle persisted in localStorage
  - **Sticky top bar** (`components/shell/Topbar.tsx`) — global search (Command palette via `cmdk`), tenant selector, township selector, date-range picker, notifications popover, alerts popover, quick-actions menu (Add Customer / Meter / Generate Bill / Create Tariff / Upload Reads — each opens a dialog), profile dropdown
  - **Breadcrumbs** derived from route matches
- Login / Forgot Password live outside `_app` with split-screen layout + utility illustration (SVG).

## Routes

```
/login
/forgot-password
/_app/
  dashboard                  (Executive)
  dashboard/mdm
  dashboard/billing
  dashboard/consumer
  dashboard/alerts
  customers/                 (list)
  customers/new              (multi-step onboarding)
  customers/$id              (tabbed detail)
  customers/utility-owners
  customers/admin-owners
  customers/connections
  customers/requests
  meters/                    (list)
  meters/$id                 (tabbed detail)
  meters/hierarchy           (topology tree)
  meters/read-cycles
  meters/read-exceptions
  meters/alerts
  meters/health
  billing/tariffs
  billing/tariffs/$id        (versioning + simulation)
  billing/bills              (queue)
  billing/bills/$id          (invoice detail)
  billing/payments
  billing/collections
  billing/schedules
  analytics/revenue
  analytics/consumption
  analytics/water-loss
  analytics/meters
  analytics/collections
  analytics/custom
  admin/users
  admin/approvals
  admin/audit-logs
  admin/notifications
  admin/holidays
  admin/settings
```

## Shared components (`src/components/`)

- `kpi/KpiCard.tsx` — gradient variant, trend delta, sparkline slot
- `charts/` — `LineChart`, `AreaChart`, `BarChart`, `DonutChart`, `Heatmap` wrappers around Recharts with shared tooltip/legend styling
- `data-table/DataTable.tsx` — TanStack Table: sort, filter, sticky header, column visibility, pagination, row selection, bulk action bar, export-to-CSV button
- `status/StatusBadge.tsx` — semantic variants (active/offline/faulty/critical/warning/success/draft/approved/generated/sent/paid)
- `forms/MultiStepForm.tsx` — stepper with validation states (react-hook-form + zod)
- `EmptyState.tsx`, `LoadingState.tsx` (skeletons), `ErrorState.tsx`, `ConfirmDialog.tsx`
- `topology/MeterTree.tsx` — recursive expand/collapse tree with status-colored nodes and flow lines

## Mock data (`src/mocks/`)

Realistic Indian-township flavor: townships (Prestige Lakeside, Sobha Dream Acres, DLF Phase 5…), blocks/floors/flats, meter serials, tariff slabs, 12-month revenue/consumption series, alert feeds, audit entries, defaulter lists. Seeded RNG so charts stay stable across reloads.

## Module-by-module deliverables

**Dashboards** — Executive (8 KPI cards, 6 charts, top townships/defaulters/alerts widgets), MDM (meter health donut, real-time ingestion line, live monitoring table, alert feed), Billing (funnel, payment trend, aging, top overdue), Consumer (single-customer view), Alerts (priority columns + workflow timeline).

**Customer Management** — list with advanced filters/bulk actions/export; 8-tab detail (Overview, Consumption, Billing, Payment, Meter, Documents, Notes, Audit); 4-step onboarding form with KYC chips.

**Meter Operations** — IoT-style list (live status dots, battery/connectivity icons); 7-tab detail with time-series readings; hierarchy tree (Township → Block → Cluster → Flat) with flow visualization; read-cycle scheduler; exception queue with retry/manual-correct/estimate actions.

**Billing & Payments** — tariff list + rule-builder dialog (slab/TOU/seasonal/holiday), versioning timeline, approval workflow, simulation panel; bill queue with workflow chips (Draft→Paid); invoice detail with preview pane; payments + reconciliation; collections heatmap + aging.

**Analytics** — 6 report pages, each with filter bar, drill-down charts, township/owner comparison, export buttons (toast-only).

**Administration** — Users table with role chips; role matrix (roles × permissions toggle grid); approvals queue; audit log timeline with diff modal + activity heatmap; notification settings; holiday calendar; system settings tabs.

## Global UX

Every list: search, filters, pagination, export, empty/loading/error states. Every destructive action: confirm dialog. Every mutation stub: success toast (sonner). Every form: inline zod validation.

## Technical details

- TanStack Start + TanStack Router file-based routes; `_app.tsx` layout route renders `<Outlet />`
- TanStack Query not needed (mock data is sync) — use plain React state/context where needed
- `TenantContext` + `DateRangeContext` for global topbar filters that re-derive widgets
- Recharts theming via CSS variables to honor the design tokens
- Inter font loaded in `__root.tsx` head
- All shadcn/ui primitives already available; no new packages besides `@tanstack/react-table`, `recharts`, `cmdk`, `react-hook-form`, `zod`, `date-fns` (verify; install missing ones)

## Build order (so preview is usable early)

1. Design tokens + fonts + shell (sidebar/topbar/breadcrumbs) + login/forgot routes
2. Mock data + shared components (KpiCard, charts, DataTable, StatusBadge)
3. Executive Dashboard (proves the visual bar)
4. Customer module (list + detail + onboarding)
5. Meter module (list + detail + hierarchy + read cycles + exceptions)
6. Billing module (tariffs + bills + payments + collections)
7. Remaining dashboards (MDM, Billing, Consumer, Alerts)
8. Analytics pages
9. Administration pages
10. Polish pass: empty/loading states, toasts, confirm dialogs, responsive checks

This is a large prototype (~50+ screens). I'll implement it in one continuous build, prioritizing visual quality and end-to-end navigation over feature depth on every leaf.
