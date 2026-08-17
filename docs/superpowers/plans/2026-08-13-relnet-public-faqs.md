# RelNet Public FAQs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a server-rendered, searchable, unauthenticated RelNet help center at `https://relead.com.mx/FAQs` and link it from the public footer and `/console`.

**Architecture:** The Next.js public site owns all FAQ content and legal/footer navigation. Content is structured data rendered on the server; a small client component performs progressive filtering without hiding content from non-JavaScript users or search engines.

**Tech Stack:** Next.js 16.2.11 App Router, React 19.2.4, TypeScript 6.0.2, CSS Modules, Node 20+ built-in test runner, OpenNext Cloudflare Workers.

## Global Constraints

- `/FAQs` must return 200 without authentication or console cookies.
- `/faqs` permanently redirects to canonical `/FAQs`.
- Never include production node names, private addresses, tokens, or operational state.
- Use fictional documentation examples only.
- Footer links are exactly FAQs, Términos y Condiciones, and Política de Privacidad.
- Preserve existing public routes `/terms` and `/privacy`.
- Content covers what each feature is, what it is for, how it works, how to use it, how to configure it, risks, and reversal.
- The Policies section includes one complete example.
- Capabilities includes SSH connection, RelDrop, and RelShare subsections.
- Keep dependencies pinned and do not add a client-side documentation framework.

## File Structure

- `app/FAQs/faq-content.ts`: typed public documentation data with stable anchor IDs.
- `app/FAQs/FaqSearch.tsx`: progressive client-side search/filter only.
- `app/FAQs/page.tsx`: metadata, semantic layout, index, and server-rendered content.
- `app/FAQs/page.module.css`: responsive help-center presentation.
- `next.config.ts`: permanent lowercase canonical redirect.
- `app/layout.tsx`: global footer links.
- `scripts/test-public-routes.mjs`: real built-server route/footer/content checks.
- `package.json`: `test:public` command using Node only.

---

### Task 1: Public FAQ Content Model and Server Route

**Files:**
- Create: `app/FAQs/faq-content.ts`
- Create: `app/FAQs/page.tsx`
- Create: `app/FAQs/page.module.css`
- Create: `scripts/test-public-routes.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `FaqSection { id, title, summary, topics[] }`.
- Produces route `/FAQs` with stable anchors `relnet`, `policies`, `subredes`, `capacidades`, `ssh`, `reldrop`, `relshare`, `exit-nodes`, `vpn-movil`, and `diagnostico`.

- [ ] **Step 1: Write the failing built-server route test**

```javascript
import assert from "node:assert/strict";

const response = await fetch(`${baseUrl}/FAQs`, { redirect: "manual" });
assert.equal(response.status, 200);
assert.equal(response.headers.get("set-cookie"), null);
const html = await response.text();
for (const id of ["relnet", "policies", "subredes", "capacidades", "ssh", "reldrop", "relshare", "exit-nodes", "vpn-movil"]) {
  assert.match(html, new RegExp(`id=["']${id}["']`));
}
assert.match(html, /RelNet Policies/);
assert.match(html, /source_tag/);
assert.doesNotMatch(html, /10\.77\.|relnet_node_[a-f0-9]{8}|Bearer /i);
```

The script must start `next start` on `127.0.0.1:3107`, poll `/` for at most 30 seconds, run assertions, and terminate the exact child process in `finally`.

- [ ] **Step 2: Build and run the route test to verify `/FAQs` fails**

Run: `npm run build && node scripts/test-public-routes.mjs`

Expected: FAIL because `/FAQs` returns 404.

- [ ] **Step 3: Add typed content and semantic server-rendered page**

```typescript
export type FaqTopic = {
  id: string;
  title: string;
  what: string;
  purpose: string;
  operation: string[];
  configuration: string[];
  risks: string[];
  reversal: string[];
};

export type FaqSection = {
  id: string;
  title: string;
  summary: string;
  topics: FaqTopic[];
};
```

Use the approved section set. The Policies example must use tags `engineering` and `files`, TCP port `445`, action `allow`, priority `100`, and explain that a lower numeric priority is evaluated first. Explain that announcements are global but routes are opt-in; explain fail-closed and optional local fallback without promising unsupported availability.

- [ ] **Step 4: Build and run the real route test**

Run: `npm run build && npm run test:public`

Expected: PASS with `/FAQs` 200, no `Set-Cookie`, all anchors, and no production identifiers.

- [ ] **Step 5: Commit the public content route**

```bash
git add app/FAQs package.json scripts/test-public-routes.mjs
git commit -m "feat: add public RelNet FAQs"
```

### Task 2: Progressive Search, Index, and Accessible Navigation

**Files:**
- Create: `app/FAQs/FaqSearch.tsx`
- Modify: `app/FAQs/page.tsx`
- Modify: `app/FAQs/page.module.css`
- Modify: `scripts/test-public-routes.mjs`

**Interfaces:**
- Consumes: typed sections from Task 1.
- Produces: accessible search with an announced result count and clear button.

- [ ] **Step 1: Add a failing browser-visible markup contract to the route test**

```javascript
assert.match(html, /type=["']search["']/);
assert.match(html, /aria-controls=["']faq-results["']/);
assert.match(html, /id=["']faq-results["']/);
assert.match(html, /href=["']#exit-nodes["']/);
```

- [ ] **Step 2: Run the public route test and observe missing search/index markup**

Run: `npm run build && npm run test:public`

Expected: FAIL on the first missing search assertion.

- [ ] **Step 3: Implement progressive filtering**

`FaqSearch` receives the full typed sections, normalizes Spanish accents for matching, and displays all sections when the query is empty. Keep headings and content in server HTML by rendering the complete content in the initial tree. Search input has an explicit label, `aria-controls="faq-results"`, and a live result count; a zero-result state links back to the full index.

- [ ] **Step 4: Build, lint, and run the route test**

Run: `npm run lint && npm run build && npm run test:public`

Expected: all commands PASS.

- [ ] **Step 5: Commit search and navigation**

```bash
git add app/FAQs scripts/test-public-routes.mjs
git commit -m "feat: add searchable FAQ navigation"
```

### Task 3: Canonical Redirect and Global Footer

**Files:**
- Modify: `next.config.ts`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `scripts/test-public-routes.mjs`

**Interfaces:**
- Produces permanent `/faqs` → `/FAQs` redirect.
- Produces footer links on home, FAQs, terms, and privacy.

- [ ] **Step 1: Add failing redirect and footer tests**

```javascript
const redirect = await fetch(`${baseUrl}/faqs`, { redirect: "manual" });
assert.ok([301, 308].includes(redirect.status));
assert.equal(new URL(redirect.headers.get("location"), baseUrl).pathname, "/FAQs");

for (const path of ["/", "/FAQs", "/terms", "/privacy"]) {
  const page = await (await fetch(`${baseUrl}${path}`)).text();
  assert.match(page, /href=["']\/FAQs["'][^>]*>FAQs</);
  assert.match(page, /href=["']\/terms["'][^>]*>Términos y Condiciones</);
  assert.match(page, /href=["']\/privacy["'][^>]*>Política de Privacidad</);
}
```

- [ ] **Step 2: Run the public test and observe lowercase 404/footer copy mismatch**

Run: `npm run build && npm run test:public`

Expected: FAIL for `/faqs` and the current shorter footer labels.

- [ ] **Step 3: Implement redirect and exact footer links**

Add a Next.js permanent redirect from `/faqs` to `/FAQs`. In `RootLayout`, order links as FAQs, Términos y Condiciones, Política de Privacidad. Preserve the current RelNet/ReLead brand and responsive footer behavior.

- [ ] **Step 4: Run lint, build, and public tests**

Run: `npm run lint && npm run build && npm run test:public`

Expected: PASS.

- [ ] **Step 5: Commit canonical routing and footer**

```bash
git add next.config.ts app/layout.tsx app/globals.css scripts/test-public-routes.mjs
git commit -m "feat: link FAQs from the public footer"
```

### Task 4: Console Contextual Documentation Links

**Files:**
- Modify in v88 candidate: `admin/app/static/app.js`
- Modify in v88 candidate: `admin/app/static/relnet-routing.js`
- Modify in v88 candidate: `admin/app/static/styles.css`
- Create in v88 candidate: `admin/tests/faq-links.test.mjs`

**Interfaces:**
- Produces fixed public links with no operational query parameters.

- [ ] **Step 1: Write failing URL-construction tests**

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { faqUrlFor } from "../app/static/relnet-routing.js";

test("FAQ links are fixed public anchors", () => {
  assert.equal(faqUrlFor("policies"), "https://relead.com.mx/FAQs#policies");
  assert.equal(faqUrlFor("subnets", { node_id: "secret-node" }), "https://relead.com.mx/FAQs#subredes");
  assert.equal(faqUrlFor("vpn"), "https://relead.com.mx/FAQs#vpn-movil");
});
```

- [ ] **Step 2: Run the test and observe missing export**

Run from the v88 candidate: `node --test admin/tests/faq-links.test.mjs`

Expected: FAIL because `faqUrlFor` is missing.

- [ ] **Step 3: Add links to every agreed console context**

Add `Conocer más` links for RelNet, Policies, Subredes, Capacidades, SSH, RelDrop, RelShare, Exit nodes, and VPN móvil. Each anchor uses `target="_blank" rel="noreferrer"`; the function accepts only a fixed enum and ignores runtime objects.

- [ ] **Step 4: Run Node and admin tests**

Run: `node --test admin/tests/faq-links.test.mjs admin/tests/relnet-routing-ui.test.mjs`

Expected: PASS.

Run: `sudo docker compose --env-file .env run --rm admin pytest -q admin/tests`

Expected: PASS.

- [ ] **Step 5: Record the cross-project checkpoint**

Run: `sha256sum admin/app/static/app.js admin/app/static/relnet-routing.js > ops/checkpoints/v88-faq-links.sha256`

Expected: two checksums.
