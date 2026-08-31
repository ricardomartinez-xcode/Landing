
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

test('public shell is mounted globally', () => {
  const layout = read('app/layout.tsx');
  assert.match(layout, /PublicShell/);
  assert.match(layout, /<PublicShell>/);
});

test('public navigation uses RelNets auth and never exposes internal restricted surfaces', () => {
  const shell = read('components/public/PublicShell.tsx');
  assert.match(shell, /https:\/\/auth\.relnets\.com/);
  assert.doesNotMatch(shell, /relead\.com\.mx/i);
  assert.doesNotMatch(shell, /builder/i);
});

test('home keeps internal infrastructure out of public copy', () => {
  const home = read('app/page.tsx');
  assert.doesNotMatch(home, /builder/i);
  assert.doesNotMatch(home, /dataplane/i);
  assert.doesNotMatch(home, /10\.250\.0\.6/);
});

test('install supports desktop, CLI and PWA mobile routes', () => {
  const install = read('app/install/InstallExperience.tsx');
  assert.match(install, /Windows/);
  assert.match(install, /Linux/);
  assert.match(install, /CLI/);
  assert.match(install, /PWA/);
  assert.match(install, /perfil VPN/);
});

test('responsive public shell and landing contracts exist', () => {
  const shellCss = read('components/public/PublicShell.module.css');
  const pageCss = read('app/page.module.css');
  assert.match(shellCss, /@media\(max-width:760px\)/);
  assert.match(pageCss, /@media\(max-width:980px\)/);
  assert.match(pageCss, /@media\(max-width:680px\)/);
});

test('canonical public routes still exist', () => {
  for (const path of ['app/page.tsx','app/install/page.tsx','app/FAQs/page.tsx','app/privacy/page.tsx','app/terms/page.tsx']) {
    assert.equal(existsSync(join(root, path)), true, `${path} must exist`);
  }
});
