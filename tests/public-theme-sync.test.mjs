import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('public layout resolves the active theme before public content renders', () => {
  const layout = read('app/layout.tsx');
  assert.match(layout, /localStorage\.getItem\('relnet-theme'\)/);
  assert.match(layout, /matchMedia\('\(prefers-color-scheme: dark\)'\)/);
  assert.match(layout, /dataset\.theme/);
  assert.match(layout, /suppressHydrationWarning/);
});

test('Install and FAQs consume the global surface tokens controlled by data-theme', () => {
  const globals = read('app/globals.css');
  const install = read('app/install/install.module.css');
  const faq = read('components/ui/FAQGroup.module.css');
  assert.match(globals, /:root\[data-theme='dark'\]/);
  assert.match(install, /var\(--surface\)/);
  assert.match(faq, /var\(--surface\)/);
});
