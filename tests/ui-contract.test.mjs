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
  assert.equal(existsSync(shellPath), true, 'AppShell must exist');
  const shell = read('components/shell/AppShell.tsx');
  for (const route of primaryRoutes) {
    assert.ok(shell.includes(route), `AppShell must reference ${route}`);
  }
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
