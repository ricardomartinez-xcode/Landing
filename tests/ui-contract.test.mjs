import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const pngHasDirectAlpha = (path) => {
  const bytes = readFileSync(join(root, path));
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  return bytes[25] === 4 || bytes[25] === 6;
};
const primaryRoutes = ['/', '/install', '/FAQs', '/privacy', '/terms'];

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

test('exposes the canonical FAQs page', () => {
  assert.equal(existsSync(join(root, 'app/FAQs/page.tsx')), true, 'app/FAQs/page.tsx must exist');
});

test('redirects exact lowercase /faqs with an App Router compatibility route', () => {
  const config = read('next.config.ts');
  assert.doesNotMatch(config, /source:\s*["']\/faqs["']/);
  assert.equal(existsSync(join(root, 'app/[slug]/page.tsx')), true, 'app/[slug]/page.tsx must exist');
  const compat = read('app/[slug]/page.tsx');
  assert.match(compat, /from\s+["']next\/navigation["']/);
  assert.match(compat, /slug\s*===\s*["']faqs["']/);
  assert.match(compat, /redirect\(["']\/FAQs["']\)/);
  assert.match(compat, /notFound\(\)/);
  assert.equal(existsSync(join(root, 'proxy.ts')), false, 'FAQ compatibility must not rely on Node proxy');
});

test('global app shell includes every primary route and accessible active navigation', () => {
  const shellPath = join(root, 'components/shell/AppShell.tsx');
  const navPath = join(root, 'components/shell/nav.ts');
  assert.equal(existsSync(shellPath), true, 'AppShell must exist');
  assert.equal(existsSync(navPath), true, 'primary navigation config must exist');
  const shell = read('components/shell/AppShell.tsx');
  const navigation = read('components/shell/nav.ts');
  for (const route of primaryRoutes) assert.ok(navigation.includes(`'${route}'`) || navigation.includes(`"${route}"`), `primary navigation must reference ${route}`);
  assert.match(shell, /primaryNav/);
  assert.match(shell, /aria-current/);
  assert.match(shell, /relnet-brand(?:-transparent)?\.(?:webp|png)/);
});

test('primary navigation uses semantic SVG icons instead of text abbreviations', () => {
  const shell = read('components/shell/AppShell.tsx');
  const navigation = read('components/shell/nav.ts');
  assert.equal(existsSync(join(root, 'components/shell/NavIcon.tsx')), true, 'NavIcon must exist');
  const icons = read('components/shell/NavIcon.tsx');
  for (const icon of ['home', 'install', 'help', 'privacy', 'terms']) {
    assert.ok(navigation.includes(`icon: '${icon}'`) || navigation.includes(`icon: \"${icon}\"`), `navigation must map ${icon}`);
  }
  assert.doesNotMatch(navigation, /short:\s*['"]/);
  assert.match(shell, /<NavIcon/);
  assert.match(icons, /<svg/);
  assert.match(icons, /aria-hidden/);
});

test('theme control supports system, light and dark modes', () => {
  const themePath = join(root, 'components/theme/ThemeControl.tsx');
  assert.equal(existsSync(themePath), true, 'ThemeControl must exist');
  const theme = read('components/theme/ThemeControl.tsx');
  for (const mode of ['system', 'light', 'dark']) assert.ok(theme.includes(`'${mode}'`) || theme.includes(`\"${mode}\"`), `ThemeControl must support ${mode}`);
  assert.match(theme, /localStorage/);
});

test('FAQs use native accessible disclosure semantics', () => {
  const candidates = ['app/FAQs/page.tsx', 'components/ui/FAQGroup.tsx'].filter((path) => existsSync(join(root, path))).map(read).join('\n');
  assert.match(candidates, /<details/);
  assert.match(candidates, /<summary/);
});

test('root layout mounts the shared AppShell', () => {
  const layout = read('app/layout.tsx');
  assert.match(layout, /AppShell/);
  assert.match(layout, /<AppShell[^>]*>/);
});

test('home offers installation and FAQs plus a real responsive table', () => {
  const home = read('app/page.tsx');
  assert.match(home, /href=[{]?['"]\/install['"]/);
  assert.match(home, /href=[{]?['"]\/FAQs['"]/);
  assert.match(home, /<table/);
  assert.match(home, /<thead/);
  assert.match(home, /<tbody/);
});

test('installation workspace has a platform selector and preserves operational destinations', () => {
  const install = read('app/install/InstallExperience.tsx');
  assert.match(install, /<select/);
  assert.match(install, /https:\/\/api\.relead\.com\.mx\/console/);
  assert.match(install, /https:\/\/api\.relead\.com\.mx\/admin/);
  assert.match(install, /\/shortcuts\/RelNet-iOS-Instrucciones-v2\.zip/);
});

test('legal layout relies on the shared shell instead of duplicate standalone navigation or decorative glow', () => {
  const legal = read('components/LegalPage.tsx');
  assert.doesNotMatch(legal, /Volver a RelNet/);
  assert.doesNotMatch(legal, /styles\.glow/);
  assert.match(legal, /<article/);
});
