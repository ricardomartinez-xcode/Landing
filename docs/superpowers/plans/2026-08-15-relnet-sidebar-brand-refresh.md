# RelNet Sidebar & Brand Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar el rectángulo blanco del logo RelNet y refinar el sidebar para desktop, tablet y móvil sin cambiar rutas ni lógica funcional.

**Architecture:** `AppShell` sigue siendo el shell compartido y `primaryNav` la fuente de verdad de navegación. Se generan dos PNG optimizados con alpha desde el PNG fuente, se añade un `NavIcon` local con SVG tipados y los cambios de layout quedan confinados al CSS Module.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, `node:test`; Sharp se usa solo localmente para generar activos ya versionados.

## Global Constraints
- Mantener `/`, `/install`, `/FAQs`, `/privacy`, `/terms` exactamente.
- Sin cambios a páginas, APIs, auth, instalación o despliegue.
- Sin nuevas librerías UI/iconos.
- Transparencia real del logo; no ocultar el defecto con fondos CSS.
- Desktop fijo compacto; tablet rail con isotipo; móvil drawer.
- Mantener `aria-label`, `aria-current`, foco visible y `prefers-reduced-motion`.
- No desplegar ni promover producción.

## File Structure
- `tests/ui-contract.test.mjs`: contratos de activos, rutas, iconos y responsive.
- `public/relnet-brand-transparent.png`: wordmark transparente optimizado.
- `public/relnet-mark-transparent.png`: isotipo transparente para tablet.
- `components/shell/NavIcon.tsx`: SVG decorativos tipados.
- `components/shell/nav.ts`: rutas, labels e identificadores de icono.
- `components/shell/AppShell.tsx`: composición accesible del shell.
- `components/shell/AppShell.module.css`: jerarquía, estados y breakpoints.

---

### Task 1: Transparent RelNet brand assets

**Files:** Modify `tests/ui-contract.test.mjs`, `components/shell/AppShell.tsx:23-28`; create `public/relnet-brand-transparent.png`, `public/relnet-mark-transparent.png`.

**Interfaces:** Consumes `public/relnet-brand.png`; produces the two transparent assets used by `AppShell`.

- [ ] **Step 1: Write the failing test**

Add:
```js
const pngHasDirectAlpha = (path) => {
  const bytes = readFileSync(join(root, path));
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  return bytes[25] === 4 || bytes[25] === 6;
};

test('sidebar uses optimized RelNet brand assets with real alpha transparency', () => {
  const shell = read('components/shell/AppShell.tsx');
  for (const asset of ['public/relnet-brand-transparent.png', 'public/relnet-mark-transparent.png']) {
    assert.equal(existsSync(join(root, asset)), true, `${asset} must exist`);
    assert.equal(pngHasDirectAlpha(asset), true, `${asset} must preserve alpha`);
  }
  assert.match(shell, /\/relnet-brand-transparent\.png/);
  assert.match(shell, /\/relnet-mark-transparent\.png/);
  assert.doesNotMatch(shell, /\/relnet-brand\.webp/);
});
```

- [ ] **Step 2: Verify RED**
```bash
npm test -- --test-name-pattern="sidebar uses optimized RelNet brand assets"
```
Expected: FAIL because assets do not exist and shell still references `.webp`.

- [ ] **Step 3: Generate the assets**
```bash
node - <<'NODE'
const sharp=require('sharp');
(async()=>{
 const {data,info}=await sharp('public/relnet-brand.png').trim({background:{r:0,g:0,b:0,alpha:0}}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 if(info.width!==1893||info.height!==832) throw new Error(`Unexpected trim ${info.width}x${info.height}`);
 await sharp(data,{raw:info}).resize({width:420}).png({compressionLevel:9,adaptiveFiltering:true}).toFile('public/relnet-brand-transparent.png');
 await sharp(data,{raw:info}).extract({left:0,top:0,width:752,height:832}).resize({width:192}).png({compressionLevel:9,adaptiveFiltering:true}).toFile('public/relnet-mark-transparent.png');
})();
NODE
```
Verified source split: icon `x=1..751`, gap `752..823`, text begins `x=824`. Stop if trim dimensions differ.

- [ ] **Step 4: Minimal shell implementation**
```tsx
<Link href="/" className={styles.brand} onClick={() => setMobileOpen(false)} aria-label="RelNet, inicio">
  <Image className={styles.brandWordmark} src="/relnet-brand-transparent.png" alt="RelNet" width={420} height={185} priority />
  <Image className={styles.brandMark} src="/relnet-mark-transparent.png" alt="" aria-hidden="true" width={192} height={212} priority />
</Link>
```

- [ ] **Step 5: Verify GREEN** with the same targeted test.
- [ ] **Step 6: Commit**
```bash
git add tests/ui-contract.test.mjs public/relnet-*-transparent.png components/shell/AppShell.tsx
git commit -m "fix: preserve transparent RelNet branding"
```

---

### Task 2: Semantic SVG navigation icons

**Files:** Modify `tests/ui-contract.test.mjs`, `components/shell/nav.ts`, `components/shell/AppShell.tsx`; create `components/shell/NavIcon.tsx`.

**Interfaces:** `primaryNav` produces `{href,label,icon}`; `NavIcon` consumes `name: 'home'|'install'|'help'|'privacy'|'terms'`.

- [ ] **Step 1: Write the failing test**
```js
test('primary navigation uses semantic SVG icons instead of text abbreviations', () => {
  const shell=read('components/shell/AppShell.tsx');
  const navigation=read('components/shell/nav.ts');
  assert.equal(existsSync(join(root,'components/shell/NavIcon.tsx')),true);
  const icons=read('components/shell/NavIcon.tsx');
  for (const icon of ['home','install','help','privacy','terms']) assert.ok(navigation.includes(`icon: '${icon}'`));
  assert.doesNotMatch(navigation,/short:\s*['"]/);
  assert.match(shell,/<NavIcon/);
  assert.match(icons,/<svg/);
  assert.match(icons,/aria-hidden/);
});
```

- [ ] **Step 2: Verify RED**
```bash
npm test -- --test-name-pattern="primary navigation uses semantic SVG icons"
```
Expected: FAIL because `NavIcon.tsx` does not exist and `short` is still present.

- [ ] **Step 3: Create `NavIcon.tsx`**
```tsx
import type { ReactNode } from 'react';
export type NavIconName='home'|'install'|'help'|'privacy'|'terms';
const paths:Record<NavIconName,ReactNode>={
 home:<><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-7h5v7"/></>,
 install:<><path d="M12 3v11"/><path d="m8 10 4 4 4-4"/><path d="M5 19h14"/></>,
 help:<><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 0 1 4.65.85c0 1.7-2.45 2.05-2.45 3.65"/><path d="M12 17h.01"/></>,
 privacy:<><path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7 3.6-3.9"/></>,
 terms:<><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h4"/><path d="M10 12h5M10 16h5"/></>,
};
export function NavIcon({name,className}:{name:NavIconName;className?:string}){
 return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
```

- [ ] **Step 4: Replace nav config** with icons `home`, `install`, `help`, `privacy`, `terms`, preserving all existing href/labels. Import `NavIcon` and render `<span className={styles.navGlyph} aria-hidden="true"><NavIcon name={item.icon}/></span>`.
- [ ] **Step 5: Verify GREEN**
```bash
npm test -- --test-name-pattern="semantic SVG icons|global app shell"
```
- [ ] **Step 6: Commit**
```bash
git add tests/ui-contract.test.mjs components/shell/NavIcon.tsx components/shell/nav.ts components/shell/AppShell.tsx
git commit -m "feat: add semantic RelNet navigation icons"
```

---

### Task 3: Compact responsive sidebar and accessible interaction states

**Files:** Modify `tests/ui-contract.test.mjs`, `components/shell/AppShell.tsx:50-54`, `components/shell/AppShell.module.css:2-80`.

**Interfaces:** Consumes `.brandWordmark`, `.brandMark`, `.navGlyph`, `.externalLabel`; produces a `232px` desktop sidebar, `76px` tablet rail and drawer at `max-width: 840px`.

- [ ] **Step 1: Write the failing CSS/accessibility contract**
```js
test('sidebar CSS defines compact desktop, tablet rail and keyboard focus contracts', () => {
  const css=read('components/shell/AppShell.module.css');
  const shell=read('components/shell/AppShell.tsx');
  assert.match(css,/\.sidebar\s*\{[^}]*width:\s*232px/s);
  assert.match(css,/\.workspace\s*\{[^}]*margin-left:\s*232px/s);
  assert.match(css,/max-width:\s*1080px[^}]*min-width:\s*841px/s);
  assert.match(css,/width:\s*76px/);
  assert.match(css,/margin-left:\s*76px/);
  assert.match(css,/\.brandMark\s*\{[^}]*display:\s*none/s);
  assert.match(css,/focus-visible/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(shell,/aria-label="Abrir Console"/);
  assert.match(shell,/aria-label="Abrir Admin"/);
});
```

- [ ] **Step 2: Verify RED**
```bash
npm test -- --test-name-pattern="sidebar CSS defines compact desktop"
```
Expected: FAIL because current desktop is `248px`, tablet is `82px`, and external links lack explicit labels.

- [ ] **Step 3: Make footer links rail-safe**
```tsx
<a href={consoleUrl} className={styles.externalLink} aria-label="Abrir Console">
  <span className={styles.externalLabel}>Console</span><span className={styles.externalGlyph} aria-hidden="true">↗</span>
</a>
<a href={adminUrl} className={styles.externalLink} aria-label="Abrir Admin">
  <span className={styles.externalLabel}>Admin</span><span className={styles.externalGlyph} aria-hidden="true">↗</span>
</a>
```

- [ ] **Step 4: Apply compact desktop rules**
```css
.sidebar { width: 232px; padding: 16px 12px; }
.brandRow { min-height: 54px; padding: 0 10px 10px; }
.brand { display: inline-flex; align-items: center; width: 142px; }
.brandWordmark { display: block; width: 100%; height: auto; }
.brandMark { display: none; }
.environment { gap: 9px; margin: 0 4px 14px; padding: 9px 10px; border-radius: 10px; background: transparent; }
.nav { gap: 3px; }
.navItem { min-height: 40px; gap: 10px; padding: 0 9px; border-radius: 9px; }
.navGlyph { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 8px; color: var(--text-faint); }
.navGlyph svg { width: 17px; height: 17px; }
.navItemActive .navGlyph { background: var(--accent-soft); color: var(--accent-strong); }
.workspace { margin-left: 232px; }
```
Retain theme variables; do not add hard-coded brand colors.

- [ ] **Step 5: Apply tablet rail + mobile drawer rules**
```css
@media (max-width: 1080px) and (min-width: 841px) {
  .sidebar { width: 76px; padding-inline: 9px; }
  .brandRow { justify-content: center; padding-inline: 0; }
  .brand { width: 40px; justify-content: center; }
  .brandWordmark { display: none; }
  .brandMark { display: block; width: 38px; height: auto; }
  .environment { justify-content: center; margin-inline: 4px; padding-inline: 8px; }
  .environment div, .navItem > span:last-child, .sidebarCaption, .externalLabel { display: none; }
  .navItem { justify-content: center; padding-inline: 0; }
  .sidebarFooter { align-items: center; }
  .externalLink { justify-content: center; padding-inline: 0; }
  .workspace { margin-left: 76px; }
}
@media (max-width: 840px) {
  .sidebar { width: min(288px, 88vw); }
  .brandWordmark { display: block; }
  .brandMark { display: none; }
  .workspace { margin-left: 0; }
}
```
Preserve the existing transform/backdrop and reduced-motion behavior.

- [ ] **Step 6: Add visible keyboard focus**
```css
.brand:focus-visible,
.navItem:focus-visible,
.externalLink:focus-visible,
.mobileClose:focus-visible,
.menuButton:focus-visible {
  outline: 2px solid var(--accent-strong);
  outline-offset: 2px;
}
```

- [ ] **Step 7: Verify GREEN**
```bash
npm test
npm run lint
npm run build
```
Expected: all exit 0.

- [ ] **Step 8: Visual responsive verification**
Run `npm run dev`; inspect `/`, `/install`, `/FAQs` at `1440x900`, `960x900`, `390x844`. Confirm no white rectangle, tablet isotipo only, no text abbreviations, clear active state, working mobile drawer/backdrop, no horizontal overflow, visible keyboard focus.

- [ ] **Step 9: Commit**
```bash
git add tests/ui-contract.test.mjs components/shell/AppShell.tsx components/shell/AppShell.module.css
git commit -m "feat: refine responsive RelNet sidebar"
```

---

### Task 4: Final regression and repository state verification

**Files:** No production changes expected. Inspect `components/shell/*`, `public/relnet-*-transparent.png`, `tests/ui-contract.test.mjs`.

**Interfaces:** Consumes Tasks 1-3; produces a verified implementation ready for review, without deployment.

- [ ] **Step 1: Run full verification**
```bash
npm test && npm run lint && npm run build
```
Expected: exit 0.

- [ ] **Step 2: Inspect scope**
```bash
git diff HEAD~3..HEAD -- components/shell tests/ui-contract.test.mjs public/relnet-brand-transparent.png public/relnet-mark-transparent.png
git status --short
```
Expected: only approved shell/tests/assets; no secrets, env files, build output or unrelated pages.

- [ ] **Step 3: Keep production untouched**
Do not run `npm run deploy`, `npm run upload`, Wrangler deploy/upload or any production promotion command. Report commit hashes and verification results only.
