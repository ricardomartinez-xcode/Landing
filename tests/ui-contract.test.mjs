import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const publicRoutes = ['/', '/install', '/FAQs', '/privacy', '/terms'];
const authEntry = 'https://auth.relead.com.mx/access';

test('public shell is mounted globally', () => {
  const layout = read('app/layout.tsx');
  assert.match(layout, /PublicShell/);
  assert.match(layout, /<PublicShell>/);
});

test('public navigation uses only the neutral Auth Gateway entry', () => {
  const shell = read('components/public/PublicShell.tsx');
  assert.match(shell, new RegExp(authEntry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(shell, /https:\/\/console\.relead\.com\.mx/);
  assert.doesNotMatch(shell, /builder\.relead\.com\.mx/i);
  assert.doesNotMatch(shell, />Builder</i);
});

test('home never exposes Builder and routes protected CTAs through Auth', () => {
  const home = read('app/page.tsx');
  assert.match(home, /https:\/\/auth\.relead\.com\.mx\/access/);
  assert.doesNotMatch(home, /https:\/\/builder\.relead\.com\.mx/i);
  assert.doesNotMatch(home, />Builder</i);
  assert.doesNotMatch(home, /href:\s*['"`]https:\/\/console\.relead\.com\.mx/i);
  assert.doesNotMatch(home, /RelNet\s+v90/i);
});

test('install flow starts authenticated surfaces at Auth Gateway', () => {
  const install = read('app/install/InstallExperience.tsx');
  assert.match(install, /https:\/\/auth\.relead\.com\.mx\/access/);
  assert.doesNotMatch(install, /https:\/\/console\.relead\.com\.mx/i);
  assert.doesNotMatch(install, /builder\.relead\.com\.mx/i);
  assert.doesNotMatch(install, /Instalación\s+v90/i);
  assert.doesNotMatch(install, /API_TOKEN|Bearer \[|Pega aquí/i);
});

test('landing does not advertise billing or ads as already active', () => {
  const home = read('app/page.tsx');
  assert.doesNotMatch(home, /NEXT_PUBLIC_AD_|adsbygoogle|googlesyndication|doubleclick|Publicidad activa|Anuncios activos/i);
});

test('responsive public shell and landing contracts exist', () => {
  const shellCss = read('components/public/PublicShell.module.css');
  const pageCss = read('app/page.module.css');
  assert.match(shellCss, /@media\(max-width:760px\)/);
  assert.match(pageCss, /@media\(max-width:980px\)/);
  assert.match(pageCss, /@media\(max-width:680px\)/);
});

test('canonical public routes still exist', () => {
  for (const route of publicRoutes) {
    const path = route === '/' ? 'app/page.tsx' : route === '/FAQs' ? 'app/FAQs/page.tsx' : `app${route}/page.tsx`;
    assert.equal(existsSync(join(root, path)), true, `${path} must exist`);
  }
});

test('lowercase /faqs compatibility remains an App Router redirect', () => {
  assert.equal(existsSync(join(root, 'app/[slug]/page.tsx')), true);
  const compat = read('app/[slug]/page.tsx');
  assert.match(compat, /next\/navigation/);
  assert.match(compat, /slug\s*===\s*['"]faqs['"]/);
  assert.match(compat, /redirect\(['"]\/FAQs['"]\)/);
});
