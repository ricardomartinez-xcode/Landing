# RelNet App Shell + FAQs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the RelNet public site into the approved full app-shell UI, add `/FAQs` as a first-class route, preserve existing brand/functional links, and verify responsive/theme/routing behavior.

**Architecture:** Keep Next.js App Router and CSS Modules/global CSS. Introduce a shared client `AppShell` with route-aware navigation, theme bootstrap/control, and mobile drawer; route pages remain server components except where interactive behavior is required. Use native semantic HTML (`details/summary`, `select`) where it improves accessibility and avoids unnecessary UI dependencies.

**Tech Stack:** Next.js 16.2.11, React 19.2.4, TypeScript 6, CSS Modules, OpenNext/Cloudflare, Node built-in test runner.

## Global Constraints

- Preserve existing RelNet logo, favicon and icon files unchanged.
- Canonical FAQ route is `/FAQs`; lowercase `/faqs` redirects to it.
- Primary routes: `/`, `/install`, `/FAQs`, `/privacy`, `/terms`.
- Theme modes: `system`, `light`, `dark`, persisted locally.
- Do not change backend/API behavior or production deployment.
- Preserve existing Admin and iOS shortcut/download destinations.
- No new UI framework dependency unless unavoidable.
- Avoid AI-template visual tropes: ornamental gradients/glows, repetitive generic cards and excessive rounded surfaces.

---

### Task 1: Add UI/routing contract tests

**Files:**
- Create: `tests/ui-contract.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: current repository filesystem.
- Produces: `npm test` contract covering route files, navigation, theme modes, shell integration and FAQ accessibility semantics.

- [ ] **Step 1: Write failing tests**

Create Node tests that assert:
1. `app/FAQs/page.tsx` exists.
2. `next.config.ts` contains a redirect from `/faqs` to `/FAQs`.
3. `components/shell/AppShell.tsx` references all five primary routes.
4. `components/theme/ThemeControl.tsx` exposes `system`, `light`, `dark`.
5. `app/FAQs/page.tsx` or its imported FAQ component uses native `details`/`summary` semantics.
6. `app/layout.tsx` mounts `AppShell`.

Add `"test": "node --test tests/*.test.mjs"`.

- [ ] **Step 2: Run RED test**

Run: `npm test`
Expected: FAIL because the new shell/FAQ/theme files do not exist yet.

- [ ] **Step 3: Commit test contract**

Commit: `test: define app shell and FAQs contracts`

### Task 2: Build theme and global shell

**Files:**
- Create: `components/shell/AppShell.tsx`
- Create: `components/shell/AppShell.module.css`
- Create: `components/shell/nav.ts`
- Create: `components/theme/ThemeControl.tsx`
- Create: `components/theme/ThemeControl.module.css`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `AppShell({children})`, primary nav configuration, `ThemeControl` with system/light/dark persistence.
- Consumes: Next `usePathname`, existing `/relnet-brand.webp` asset.

- [ ] **Step 1: Implement minimal shell/theme to satisfy contracts**
- [ ] **Step 2: Run `npm test` and `npm run lint`**
- [ ] **Step 3: Refine CSS tokens/responsive behavior while keeping tests green**
- [ ] **Step 4: Commit `feat: add responsive app shell and themes`**

### Task 3: Implement canonical FAQs and redirect

**Files:**
- Create: `app/FAQs/page.tsx`
- Create: `app/FAQs/faqs.module.css`
- Create: `components/ui/FAQGroup.tsx`
- Create: `components/ui/FAQGroup.module.css`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: accessible grouped FAQ content using native `details/summary`; redirect `/faqs` -> `/FAQs`.
- Consumes: `/install`, `/`, and existing external Admin URL only where useful.

- [ ] **Step 1: Implement FAQ route from verified site capabilities only**
- [ ] **Step 2: Add permanent compatibility redirect**
- [ ] **Step 3: Run `npm test`, `npm run lint`, `npm run build`**
- [ ] **Step 4: Commit `feat: add canonical FAQs route`**

### Task 4: Redesign home into app-style product overview

**Files:**
- Modify: `app/page.tsx`
- Replace/refactor: `app/page.module.css`
- Create as needed: focused presentational components under `components/ui/`

**Interfaces:**
- Consumes: existing factual product/capability copy and links.
- Produces: concise product overview aligned with shell; explicit paths to `/install` and `/FAQs`.

- [ ] **Step 1: Reorganize content without inventing capabilities**
- [ ] **Step 2: Apply responsive non-template visual hierarchy**
- [ ] **Step 3: Run tests/lint/build**
- [ ] **Step 4: Commit `feat: redesign RelNet product overview`**

### Task 5: Redesign installation workspace

**Files:**
- Modify: `app/install/InstallExperience.tsx`
- Replace/refactor: `app/install/install.module.css`

**Interfaces:**
- Preserves: platform detection, existing Admin URL, `/shortcuts/RelNet-iOS-Instrucciones-v2.zip`, shortcut metadata/content.
- Produces: platform selector/status, progressive steps and responsive help surfaces.

- [ ] **Step 1: Refactor layout while preserving functional destinations**
- [ ] **Step 2: Ensure mobile controls cannot clip/overflow**
- [ ] **Step 3: Run tests/lint/build**
- [ ] **Step 4: Commit `feat: redesign installation workspace`**

### Task 6: Integrate legal routes into shell

**Files:**
- Modify: `components/LegalPage.tsx`
- Modify: `components/LegalPage.module.css`
- Verify: `app/privacy/page.tsx`, `app/terms/page.tsx`

**Interfaces:**
- Preserves: legal copy.
- Produces: editorial reading layout consistent with global shell/theme.

- [ ] **Step 1: Remove redundant standalone navigation and restyle legal content**
- [ ] **Step 2: Run tests/lint/build**
- [ ] **Step 3: Commit `feat: align legal pages with app shell`**

### Task 7: Route/link/build and responsive verification

**Files:**
- Modify only if a failing verification requires a fix.

**Interfaces:**
- Verifies all previous tasks together.

- [ ] **Step 1: Run `npm test` and `npm run lint`**
- [ ] **Step 2: Run `npm run build` and `npm run cf:build`**
- [ ] **Step 3: Start local Next server and smoke HTTP `/`, `/install`, `/FAQs`, `/privacy`, `/terms`, `/faqs`; require 200 for primary routes and redirect for lowercase FAQs**
- [ ] **Step 4: Crawl internal hrefs and confirm every local destination exists**
- [ ] **Step 5: Inspect representative 390px, 768px, 1366px and wide desktop rendering through an available browser; verify drawer/sidebar, overflow and theme control**
- [ ] **Step 6: Verify no tracked logo/favicon/icon binary changed using `git diff --name-only`**
- [ ] **Step 7: Commit any verification fixes and leave branch clean**
