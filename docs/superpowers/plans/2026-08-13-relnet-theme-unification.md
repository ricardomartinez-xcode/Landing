# RelNet Theme Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the current RelNet light/purple theme consistently to console, login, installation, public/legal/FAQ, and every host-admin/OAuth approval state.

**Architecture:** A small server-side branding module renders secure approval shells from structured content while preserving CSP and security headers. Public and console applications consume the same documented token contract in their own local assets; Playwright audits behavior and screenshots at desktop/mobile sizes.

**Tech Stack:** Python 3.12, FastAPI HTMLResponse, CSP nonces, CSS custom properties, Next.js CSS, Playwright 1.52.0, pytest.

## Global Constraints

- Preserve CSRF, secure cookies, single-use approvals, rate limits, PKCE, state, scopes, and refresh-token rotation.
- Keep `form-action 'self'`, `img-src 'self'`, `frame-ancestors 'none'`, and no remote fonts/assets on approval pages.
- Scripts require nonces; secrets and opaque tokens never enter screenshots or logs.
- Technical terminal, log, and code surfaces remain dark.
- Meet visible focus, mobile layout, contrast, and no-horizontal-overflow requirements.
- Cover pending, approved, denied, consumed, expired, unavailable, error, success, and cancellation pages.
- Do not weaken no-store/referrer/security headers.

## File Structure

- `core/ai_core/branding.py`: theme tokens, secure page renderer, brand mark, and state components.
- `auth-broker/app/main.py`: host-admin pages use structured renderer.
- `auth-broker/app/mcp_oauth.py`: OAuth form/result/unavailable pages use structured renderer.
- `auth-broker/tests/test_branding.py`: rendered HTML/header/security behavior.
- `admin/app/static/styles.css`: canonical console/admin token values.
- `admin/app/static/login.html`, `index.html`, `install.html`: semantic theme hooks and shared footer/help links.
- `ops/tests/visual-theme-audit.py`: authenticated/local fixture screenshot and overflow audit.
- Public project `app/globals.css`, `app/FAQs/page.module.css`, and `components/LegalPage.module.css`: public token parity.

---

### Task 1: Secure Shared Approval Page Renderer

**Files:**
- Create in v88 candidate: `core/ai_core/branding.py`
- Create in v88 candidate: `auth-broker/tests/test_branding.py`

**Interfaces:**
- Produces: `render_relnet_page(*, title, eyebrow, heading, body_html, actions_html="", tone="neutral", script="") -> HTMLResponse`.
- Produces: consistent no-store and CSP headers with an optional nonce.

- [ ] **Step 1: Write failing security and theme behavior tests**

```python
def test_branded_page_has_theme_focus_and_secure_headers() -> None:
    response = render_relnet_page(
        title="Autorización",
        eyebrow="RelNet Security",
        heading="Revisa la solicitud",
        body_html="<p>Contenido seguro</p>",
    )
    body = response.body.decode()
    assert 'class="relnet-page"' in body
    assert '--relnet-primary:#175CFF' in body
    assert ':focus-visible' in body
    assert response.headers["cache-control"] == "no-store"
    assert "form-action 'self'" in response.headers["content-security-policy"]
    assert "frame-ancestors 'none'" in response.headers["content-security-policy"]
    assert "https://" not in body.split("<style", 1)[1].split("</style>", 1)[0]
```

- [ ] **Step 2: Run the test and observe missing branding module**

Run: `sudo docker compose --env-file .env run --rm auth-broker pytest -q auth-broker/tests/test_branding.py`

Expected: FAIL with missing `ai_core.branding`.

- [ ] **Step 3: Implement the renderer with escaped structured inputs**

The renderer owns the document, meta tags, inline local CSS, brand asset path, content shell, states, buttons, fields, and footer. Callers pass only already escaped/allowlisted HTML fragments built by dedicated helpers. When a script is supplied, generate a random nonce and include exactly `script-src 'nonce-{generated_value}'`; otherwise omit `script-src`.

Use these canonical tokens: primary `#175CFF`, purple `#7C3AED`, cyan `#08BDEB`, canvas `#F7F8FF`, surface `#FFFFFF`, text `#14213D`, muted `#667085`, line `#DCE3FF`, danger `#B42318`, success `#067647`.

- [ ] **Step 4: Run branding and existing auth tests**

Run: `sudo docker compose --env-file .env run --rm auth-broker pytest -q auth-broker/tests/test_branding.py auth-broker/tests/test_crypto.py auth-broker/tests/test_mcp_oauth.py`

Expected: PASS.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum core/ai_core/branding.py auth-broker/tests/test_branding.py > ops/checkpoints/v88-theme-task1.sha256`

Expected: two checksums.

### Task 2: Host-Admin and OAuth State Coverage

**Files:**
- Modify in v88 candidate: `auth-broker/app/main.py`
- Modify in v88 candidate: `auth-broker/app/mcp_oauth.py`
- Modify in v88 candidate: `auth-broker/tests/test_branding.py`
- Modify in v88 candidate: `auth-broker/tests/test_mcp_oauth.py`

**Interfaces:**
- Consumes: `render_relnet_page` from Task 1.
- Produces consistent pages for every host-admin and OAuth state.

- [ ] **Step 1: Add failing parametrized state coverage**

```python
@pytest.mark.parametrize("status,tone", [
    ("pending", "warning"),
    ("approved", "success"),
    ("denied", "danger"),
    ("consumed", "neutral"),
    ("expired", "danger"),
])
def test_admin_status_pages_use_current_theme(status: str, tone: str) -> None:
    response = admin_status_page(status)
    body = response.body.decode()
    assert 'class="relnet-page"' in body
    assert f'data-tone="{tone}"' in body
    assert response.headers["cache-control"] == "no-store"
```

Add equivalent observable tests for OAuth approval form, approved redirect, cancelled redirect, and unavailable/410. Keep assertions on rendered behavior and headers, not source text.

- [ ] **Step 2: Run focused tests and observe legacy page mismatches**

Run: `sudo docker compose --env-file .env run --rm auth-broker pytest -q auth-broker/tests/test_branding.py auth-broker/tests/test_mcp_oauth.py`

Expected: FAIL because legacy HTML does not expose the shared shell/tone.

- [ ] **Step 3: Replace duplicate HTML shells without altering flow logic**

Move status copy into small pure helpers. Keep exact POST actions, hidden CSRF fields, credential autocomplete attributes, decision values, redirect metadata, signed cookies, and nonce behavior. Remove the two duplicated `BRAND_ASSET_HEAD`/`brandify_html` implementations only after every call site uses the shared renderer.

- [ ] **Step 4: Run the complete auth-broker suite and compile**

Run: `sudo docker compose --env-file .env run --rm auth-broker pytest -q auth-broker/tests`

Expected: PASS.

Run: `python3 -m compileall -q core/ai_core auth-broker/app`

Expected: exit 0.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum auth-broker/app/main.py auth-broker/app/mcp_oauth.py > ops/checkpoints/v88-theme-task2.sha256`

Expected: two checksums.

### Task 3: Console, Login, and Installation Theme Contract

**Files:**
- Modify in v88 candidate: `admin/app/static/styles.css`
- Modify in v88 candidate: `admin/app/static/index.html`
- Modify in v88 candidate: `admin/app/static/login.html`
- Modify in v88 candidate: `admin/app/static/install.html`
- Create in v88 candidate: `admin/tests/test_theme_pages.py`

**Interfaces:**
- Produces the same token values and footer/help presentation on all static pages.

- [ ] **Step 1: Write failing rendered-file behavior tests**

```python
from html.parser import HTMLParser
from pathlib import Path

STATIC_ROOT = Path(__file__).parents[1] / "app" / "static"


class LinkAndBrandParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: set[str] = set()
        self.has_brand = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "a" and values.get("href"):
            self.links.add(str(values["href"]))
        if tag == "img" and values.get("alt") == "RelNet":
            self.has_brand = True


@pytest.mark.parametrize("name", ["index.html", "login.html", "install.html"])
def test_static_page_has_brand_landmarks_and_footer_links(name: str) -> None:
    html = (STATIC_ROOT / name).read_text(encoding="utf-8")
    page = LinkAndBrandParser()
    page.feed(html)
    assert page.has_brand is True
    assert "https://relead.com.mx/FAQs" in page.links
    assert "https://relead.com.mx/terms" in page.links
    assert "https://relead.com.mx/privacy" in page.links
```

- [ ] **Step 2: Run the test and observe missing footer links**

Run: `sudo docker compose --env-file .env run --rm admin pytest -q admin/tests/test_theme_pages.py`

Expected: FAIL for missing links/landmarks on at least index and login.

- [ ] **Step 3: Consolidate token overrides and add semantic footer/help landmarks**

Collapse the accumulated v61/light-theme override blocks into one final token section while preserving terminal dark surfaces and mobile PWA rules. Add the three public links without placing them inside authenticated action forms. Keep `theme-color` `#175CFF` and the existing PWA assets.

- [ ] **Step 4: Run admin tests and asset verification**

Run: `sudo docker compose --env-file .env run --rm admin pytest -q admin/tests`

Expected: PASS.

Run: `bash ops/tests/test-relnet-brand-assets.sh`

Expected: PASS.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum admin/app/static/styles.css admin/app/static/index.html admin/app/static/login.html admin/app/static/install.html > ops/checkpoints/v88-theme-task3.sha256`

Expected: four checksums.

### Task 4: Public Theme Token Parity

**Files:**
- Modify in public repo: `app/globals.css`
- Modify in public repo: `app/FAQs/page.module.css`
- Modify in public repo: `components/LegalPage.module.css`
- Create in public repo: `scripts/test-theme-contract.mjs`
- Modify in public repo: `package.json`

**Interfaces:**
- Produces the approved public token values and responsive focus behavior.

- [ ] **Step 1: Write failing computed-style tests against the built site**

Use Playwright from the platform browser image to open a locally served public build and evaluate:

```javascript
const result = await page.evaluate(() => {
  const root = getComputedStyle(document.documentElement);
  const firstLink = document.querySelector('a');
  return {
    primary: root.getPropertyValue('--primary').trim(),
    canvas: root.getPropertyValue('--canvas').trim(),
    overflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    hasLink: Boolean(firstLink),
  };
});
assert.deepEqual(result, { primary: '#175CFF', canvas: '#F7F8FF', overflow: true, hasLink: true });
```

- [ ] **Step 2: Run the theme contract and observe token/overflow mismatch**

Run the built server, then execute `scripts/test-theme-contract.mjs` through the existing Playwright-capable browser container.

Expected: FAIL on any noncanonical token or mobile overflow.

- [ ] **Step 3: Align globals, FAQ, and legal pages**

Define canonical tokens once in `app/globals.css`; CSS Modules consume variables rather than new literal brand colors. Preserve the existing page structure and legal copy. Add `:focus-visible` treatment with at least a 2px outline and 2px offset.

- [ ] **Step 4: Run lint, build, public routes, and theme contract**

Run: `npm run lint && npm run build && npm run test:public && npm run test:theme`

Expected: PASS.

- [ ] **Step 5: Commit public theme parity**

```bash
git add app components scripts/test-theme-contract.mjs package.json
git commit -m "style: unify RelNet public theme"
```

### Task 5: Full Visual State Audit

**Files:**
- Create in v88 candidate: `ops/tests/visual-theme-audit.py`
- Modify in v88 candidate: `scripts/verify.sh`
- Create at runtime: `/opt/ai-platform/artifacts/v88-theme-audit/` screenshots and JSON report.

**Interfaces:**
- Consumes staging URLs and synthetic one-time approval fixtures.
- Produces screenshot artifacts and `report.json` with route, viewport, status, overflow, focus visibility, and screenshot path.

- [ ] **Step 1: Write the failing route matrix test**

The audit matrix must include console login/index, install, host-admin pending/approved/denied/consumed/expired, OAuth authorize/success/cancelled/unavailable, public home/FAQs/terms/privacy, and viewports `1440x1000` and `390x844`. The first run must fail when any route lacks `.relnet-page` or the public RelNet landmark, has horizontal overflow, or returns an unexpected status.

- [ ] **Step 2: Run the audit against current staging and capture failing routes**

Run inside the Playwright browser image with only synthetic staging approvals and redact opaque path components in `report.json`.

Expected: FAIL on legacy approval states before Task 2 images are deployed.

- [ ] **Step 3: Fix only visual/state defects found by the matrix**

Adjust shared renderer or CSS tokens; do not bypass CSP, auth, or approval status behavior. Regenerate synthetic approvals rather than reusing consumed URLs.

- [ ] **Step 4: Run the complete audit and inspect every screenshot**

Run: `python3 ops/tests/visual-theme-audit.py --output /opt/ai-platform/artifacts/v88-theme-audit`

Expected: PASS and one screenshot per route/viewport state.

Manually inspect the contact sheet for clipped controls, unreadable contrast, stale dark page shells, missing logo, and footer inconsistencies.

- [ ] **Step 5: Add the non-secret audit to verification and record checkpoint**

Add a staging-only visual gate to `verify.sh` behind `RELNET_RUN_VISUAL_AUDIT=1`; never run it with production approval URLs.

Run: `sha256sum ops/tests/visual-theme-audit.py scripts/verify.sh > ops/checkpoints/v88-theme-task5.sha256`

Expected: two checksums.
