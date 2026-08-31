
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

test('commercial pricing and AI credits match approved catalog', () => {
  const home = read('app/page.tsx');
  assert.match(home, /\$199 MXN/);
  assert.match(home, /\$1,990/);
  assert.match(home, /\$499 MXN/);
  assert.match(home, /\$4,990/);
  assert.match(home, /1,200 créditos de IA/i);
  assert.match(home, /5,000 créditos de IA/i);
  assert.match(home, /Consultar con ventas/i);
});

test('public URLs use relnets.com and Console-owned identity only', () => {
  const home = read('app/page.tsx');
  const shell = read('components/public/PublicShell.tsx');
  const install = read('app/install/InstallExperience.tsx');
  for (const source of [home, shell, install]) {
    assert.doesNotMatch(source, /relead\.com\.mx/i);
    assert.doesNotMatch(source, /builder/i);
  }
  const publicSources = home + shell + install;
  assert.match(publicSources, /console\.relnets\.com/i);
  assert.match(publicSources, /relnets\.com/i);
  assert.doesNotMatch(publicSources, /auth\.relnets\.com\/access/i);
});

test('mobile install is PWA-first with VPN profile', () => {
  const install = read('app/install/InstallExperience.tsx');
  assert.match(install, /PWA/i);
  assert.match(install, /pantalla de inicio/i);
  assert.match(install, /perfil VPN/i);
  assert.match(install, /install\.relnets\.com/i);
});

test('landing describes sponsored monetization without paid-plan ads', () => {
  const home = read('app/page.tsx');
  assert.match(home, /Patrocinado|Publicidad/i);
  assert.match(home, /Free/i);
  assert.match(home, /Sin anuncios/i);
  assert.match(home, /Pro/i);
  assert.match(home, /Team/i);
});

test('AI section exposes Agent RelNets only as MCP API integration', () => {
  const home = read('app/page.tsx');
  assert.match(home, /Agent RelNets/i);
  assert.match(home, /MCP/i);
  assert.match(home, /API/i);
  assert.match(home, /ChatGPT/i);
});

test('PWA manifest is present', () => {
  assert.equal(existsSync(join(root, 'public/manifest.webmanifest')), true);
  const manifest = JSON.parse(read('public/manifest.webmanifest'));
  assert.equal(manifest.name, 'RelNets');
  assert.equal(manifest.display, 'standalone');
});
