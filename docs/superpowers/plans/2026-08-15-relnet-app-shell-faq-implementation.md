# RelNet App Shell + FAQs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the RelNet public site into the approved full app-shell UI, add `/FAQs` as a first-class route, preserve existing brand/functional links, and verify responsive/theme/routing behavior.

**Architecture:** Keep Next.js App Router and CSS Modules/global CSS. Introduce a shared client `AppShell` with route-aware navigation, theme bootstrap/control, and mobile drawer; route pages remain server components except where interaction is required. Prefer semantic HTML (`details/summary`, `select`) to unnecessary dependencies.

**Tech Stack:** Next.js 16.2.11, React 19.2.4, TypeScript 6, CSS Modules, OpenNext/Cloudflare, Node built-in test runner.

## Global Constraints
- Preserve existing RelNet logo, favicon and icon files unchanged.
- Canonical FAQ route is `/FAQs`; lowercase `/faqs` redirects to it.
- Primary routes: `/`, `/install`, `/FAQs`, `/privacy`, `/terms`.
- Theme modes: `system`, `light`, `dark`, persisted locally.
- Do not change backend/API behavior or deploy production.
- Preserve existing Admin and iOS shortcut/download destinations.
- No new UI framework dependency.
- Avoid ornamental gradients/glows, repetitive generic cards and excessive rounded surfaces.

---

### Task 1: UI/routing contract tests
**Files:** Create `tests/ui-contract.test.mjs`; modify `package.json`.
**Produces:** `npm test` contract for route files, navigation, theme modes, shell integration and FAQ semantics.
- [ ] Write tests asserting `app/FAQs/page.tsx`, redirect `/faqs`→`/FAQs`, `components/shell/AppShell.tsx` with all five primary routes, `components/theme/ThemeControl.tsx` with system/light/dark, FAQ `details/summary`, and `app/layout.tsx` mounting AppShell.
- [ ] Add `"test": "node --test tests/*.test.mjs"`.
- [ ] Run `npm test`; expected RED because features do not exist.
- [ ] Commit `test: define app shell and FAQs contracts`.

### Task 2: Theme and global shell
**Files:** Create `components/shell/AppShell.tsx`, `AppShell.module.css`, `nav.ts`, `components/theme/ThemeControl.tsx`, `ThemeControl.module.css`; modify `app/layout.tsx`, `app/globals.css`.
**Produces:** responsive route-aware shell and persisted system/light/dark theme.
- [ ] Implement minimal shell/theme satisfying contracts.
- [ ] Run `npm test` and `npm run lint`.
- [ ] Refine semantic CSS tokens, desktop sidebar, compact medium layout, mobile drawer, focus/reduced-motion behavior.
- [ ] Commit `feat: add responsive app shell and themes`.

### Task 3: Canonical FAQs and redirect
**Files:** Create `app/FAQs/page.tsx`, `app/FAQs/faqs.module.css`, `components/ui/FAQGroup.tsx`, `FAQGroup.module.css`; modify `next.config.ts`.
**Produces:** accessible grouped FAQs based only on verified product capabilities and compatibility redirect.
- [ ] Implement categories General, Instalación/plataformas, Red/acceso remoto, Seguridad/identidad, Móvil/iPhone, Administración/solución de problemas using `details/summary`.
- [ ] Add permanent `/faqs`→`/FAQs` redirect.
- [ ] Run tests/lint/build.
- [ ] Commit `feat: add canonical FAQs route`.

### Task 4: Home product overview
**Files:** Modify `app/page.tsx`, `app/page.module.css`; create focused presentation components only if useful.
**Produces:** concise app-style overview retaining factual existing capabilities and links to install/FAQs.
- [ ] Reorganize existing factual content without inventing capabilities.
- [ ] Apply responsive hierarchy aligned with shell.
- [ ] Run tests/lint/build.
- [ ] Commit `feat: redesign RelNet product overview`.

### Task 5: Installation workspace
**Files:** Modify `app/install/InstallExperience.tsx`, `app/install/install.module.css`.
**Preserves:** platform detection, Admin URL, `/shortcuts/RelNet-iOS-Instrucciones-v2.zip`, shortcut metadata/content.
- [ ] Refactor into platform selector/status, progressive steps and help/advanced disclosures.
- [ ] Ensure mobile controls do not clip/overflow.
- [ ] Run tests/lint/build.
- [ ] Commit `feat: redesign installation workspace`.

### Task 6: Legal routes in shell
**Files:** Modify `components/LegalPage.tsx`, `components/LegalPage.module.css`; verify privacy/terms pages.
**Preserves:** legal copy.
- [ ] Remove redundant standalone navigation and apply editorial reading layout.
- [ ] Run tests/lint/build.
- [ ] Commit `feat: align legal pages with app shell`.

### Task 7: Final verification
- [ ] Run `npm test`, `npm run lint`, `npm run build`, `npm run cf:build`.
- [ ] Start local Next server and smoke `/`, `/install`, `/FAQs`, `/privacy`, `/terms`, `/faqs`; require 200 for primary routes and redirect for lowercase FAQs.
- [ ] Crawl internal hrefs and confirm local destinations exist.
- [ ] Inspect 390px, 768px, 1366px and wide desktop rendering with an available browser; verify drawer/sidebar, overflow and theme control.
- [ ] Verify no tracked logo/favicon/icon binary changed with `git diff --name-only`.
- [ ] Commit any verification fixes and leave branch clean.
