# ZSMS — Zulfiqarabad Scouts Management System

Full React front-end for ZSMS, built from the core architecture handoff doc.
Ships running on in-memory/localStorage demo data so you can explore every
role and workflow immediately — including the new **Activity Proposal
System** (SSL/SL/RL → GS → GSL). Wiring in your real Appwrite backend is a
single flag flip; no component code needs to change.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL. On the login screen, pick any role button
(GSL, GS, SSL, ASSL, SL, ASL, RL, ARL, FS, OS) to explore that role's
dashboard — this is demo-mode auth, not real accounts.

## Project shape

```
src/
  context/        AuthContext, ThemeContext
  layouts/         AppLayout (sidebar + navbar + routed content)
  components/
    layout/         Sidebar, Navbar
    common/          Badge, Card/StatCard/SectionTitle/EmptyState, Toast
  pages/
    auth/            Login
    dashboard/       Dashboard.jsx (role router) + one file per role
    scouts/          List, Form (create/edit), Detail (review actions), Promotions
    proposals/       List, New, Detail (GS forward / GSL accept-reject)
    finance/         Hub, NewExpense, ExpenseDetail, NewEvent, EventDetail
    reports/         Reports
    settings/        Settings (theme, backend mode, demo data reset)
    profile/         Profile
  routes/          ProtectedRoute
  services/        authService, scoutService, proposalService,
                    financeService, notificationService, storageService,
                    appwrite/appwrite.js (client + table/bucket IDs)
  utils/           ageUtils, idUtils, dateUtils, permissionUtils, printUtils
  data/            mockDb.js (localStorage-backed mock store), mockData.js (seed data)
```

## Wiring up your real Appwrite backend

1. Create your Appwrite project, database, tables and storage buckets to
   match the IDs described in `ZSMS_Core_Architecture_Developer_Handoff.md`
   (or use your own IDs and just update `.env`).
2. Copy `.env.example` to `.env` and fill in your endpoint, project ID,
   database ID, and every table/bucket ID.
3. Set `VITE_USE_APPWRITE=true`.
4. Restart the dev server.

That's it — every function in `src/services/*.js` already contains the real
Appwrite `tablesDB` / `storage` / `account` call, written and commented in
right next to the mock implementation it replaces. The mock and real code
paths are switched by the single `USE_APPWRITE` constant exported from
`services/appwrite/appwrite.js`, so no page or component needs to change.

Two things called out in the spec that still need real backend logic
(mock-only stand-ins exist for both, clearly commented):

- **Sequential Scout ID generation** (`IDBS-ZG-<section>-0000`) needs to
  happen in an Appwrite Function with an atomic counter so concurrent
  submissions never collide — see the note in `utils/idUtils.js` and
  `services/scoutService.js`.
- **The 3-day pre-execution alert** for accepted activity proposals is
  computed client-side in this scaffold (fine for demo/dev). For
  production, add a scheduled Appwrite Function that queries accepted
  proposals within 3 days of execution and writes `notifications` rows
  server-side — see the note at the bottom of `services/proposalService.js`.

## Demo data / resetting

While `VITE_USE_APPWRITE=false`, all data lives in `localStorage` under the
key `zsms_mock_db_v1`. Reset it anytime from **Settings → Reset Demo Data**,
or by clearing that key manually.

## Notes

- Age and Scout ID are always derived — never manually entered — matching
  the "never trust a manually entered age" rule in the spec.
- Print views use `.no-print` / `@media print` rules already set up in
  `src/index.css`; the Print buttons on Scout, Expense, Event and Proposal
  detail pages just call `window.print()`.
- Light/dark theme persists via `localStorage` and is fully token-driven —
  see `src/styles/tokens.css`.
