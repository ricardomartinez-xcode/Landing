import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const primaryRoutes = ['/', '/install', '/FAQs', '/privacy', '/terms'];

test('exposes the canonical FAQs page', () => {
  assert.equal(existsSync(join(root, 'app/FAQs/page.tsx')), true, 'app/FAQs/page.tsx must exist');
});

test('redirects lowercase /faqs to canonical /FAQs', () => {
  const config = read('next.config.ts');
  assert.match(config, /source:\s*["']\/faqs["']/);
  assert.match(config, /destination:\s*["']\/FAQs["']/);
});

test('global app shell includes every primary route and accessible active navigation', () => {
  const shellPath = join(root, 'components/shell/AppShell.tsx');
  const navPath = join(root, 'components/shell/nav.ts');
  assert.equal(existsSync(shellPath), true, 'AppShell must exist');
  assert.equal(existsSync(navPath), true, 'primary navigation config must exist');
  const shell = read('components/shell/AppShell.tsx');
  const navigation = read('components/shell/nav.ts');
  for (const route of primaryRoutes) {
    assert.ok(navigation.includes(`'${route}'`) || navigation.includes(`"${route}"`), `primary navigation must reference ${route}`);
  }
  assert.match(shell, /primaryNav/);
  assert.match(shell, /aria-current/);
  assert.match(shell, /relnet-brand\.(?:webp|png)/);
});

test('theme control supports system, light and dark modes', () => {
  const themePath = join(root, 'components/theme/ThemeControl.tsx');
  assert.equal(existsSync(themePath), true, 'ThemeControl must exist');
  const theme = read('components/theme/ThemeControl.tsx');
  for (const mode of ['system', 'light', 'dark']) {
    assert.ok(theme.includes(`'${mode}'`) || theme.includes(`\"${mode}\"`), `ThemeControl must support ${mode}`);
  }
  assert.match(theme, /localStorage/);
});

test('FAQs use native accessible disclosure semantics', () => {
  const candidates = ['app/FAQs/page.tsx', 'components/ui/FAQGroup.tsx']
    .filter((path) => existsSync(join(root, path)))
    .map(read)
    .join('\n');
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
