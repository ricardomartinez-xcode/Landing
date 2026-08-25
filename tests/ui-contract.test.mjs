import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const publicRoutes = ['/', '/install', '/FAQs', '/privacy', '/terms'];

test('public v90 shell is mounted globally', () => {
  const layout = read('app/layout.tsx');
  assert.match(layout, /PublicShell/);
  assert.match(layout, /<PublicShell>/);
  assert.match(layout, /ReLead \| RelNet y My RelNet/);
});

test('public shell routes users to the canonical Console and keeps Builder out of primary CTAs', () => {
  const shell = read('components/public/PublicShell.tsx');
  assert.match(shell, /https:\/\/console\.relead\.com\.mx/);
  assert.match(shell, />Abrir My RelNet</);
  assert.match(shell, /href="\/install"/);
  assert.match(shell, /href="\/FAQs"/);
  assert.doesNotMatch(shell, /api\.relead\.com\.mx\/(?:console|admin)/);
  assert.doesNotMatch(shell, /control\.relead\.com\.mx/);
  assert.doesNotMatch(shell, />Abrir (?:Console|Admin)</);
});

test('home uses canonical console host and does not revive legacy application hosts', () => {
  const home = read('app/page.tsx');
  assert.match(home, /https:\/\/console\.relead\.com\.mx/);
  assert.doesNotMatch(home, /https:\/\/app\.relead\.com\.mx/);
  assert.doesNotMatch(home, /api\.relead\.com\.mx\/(?:console|admin)/);
  assert.doesNotMatch(home, /control\.relead\.com\.mx/);
});

test('home exposes canonical account, billing and developer destinations', () => {
  const home = read('app/page.tsx');
  assert.match(home, /https:\/\/console\.relead\.com\.mx\/register/);
  assert.match(home, /https:\/\/console\.relead\.com\.mx\/billing/);
  assert.match(home, /https:\/\/console\.relead\.com\.mx\/developers/);
  assert.match(home, /https:\/\/console\.relead\.com\.mx\/auth\/login/);
  assert.match(home, /https:\/\/builder\.relead\.com\.mx/);
});

test('install flow is aligned to My RelNet and contains no legacy public admin routes or pasted API-token recipe', () => {
  const install = read('app/install/InstallExperience.tsx');
  assert.match(install, /https:\/\/console\.relead\.com\.mx\//);
  assert.match(install, /https:\/\/console\.relead\.com\.mx\/developers/);
  assert.match(install, /enrolamiento/i);
  assert.doesNotMatch(install, /api\.relead\.com\.mx\/(?:console|admin)/);
  assert.doesNotMatch(install, /control\.relead\.com\.mx/);
  assert.doesNotMatch(install, /API_TOKEN|Bearer \[|Pega aqu/i);
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

test('FAQs keep native accessible disclosure semantics', () => {
  const candidates = ['app/FAQs/page.tsx', 'components/ui/FAQGroup.tsx'].filter((path) => existsSync(join(root, path))).map(read).join('\n');
  assert.match(candidates, /<details/);
  assert.match(candidates, /<summary/);
});

test('legal pages remain first-class routes', () => {
  for (const path of ['app/privacy/page.tsx', 'app/terms/page.tsx']) assert.equal(existsSync(join(root, path)), true);
});
