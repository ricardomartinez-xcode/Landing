import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

test('public pricing is generated from one reviewed plan contract snapshot', () => {
  const path = join(root, 'data/public-plans.json');
  assert.equal(existsSync(path), true);
  const contract = JSON.parse(readFileSync(path, 'utf8'));
  assert.equal(contract.currency, 'MXN');
  const bySlug = Object.fromEntries(contract.plans.map((plan) => [plan.slug, plan]));
  assert.deepEqual([bySlug.free.monthly_price, bySlug.free.yearly_price], [0, 0]);
  assert.deepEqual([bySlug.pro.monthly_price, bySlug.pro.yearly_price], [199, 1990]);
  assert.deepEqual([bySlug.team.monthly_price, bySlug.team.yearly_price], [499, 4990]);
  assert.equal(bySlug.business.monthly_price, null);
  assert.equal(bySlug.business.yearly_price, null);
  assert.deepEqual(bySlug.free.ai, { enabled: false, monthly_credits: 0, pooled: false, quota: 'none' });
  assert.deepEqual(bySlug.pro.ai, { enabled: true, monthly_credits: 100, pooled: false, quota: 'monthly' });
  assert.deepEqual(bySlug.team.ai, { enabled: true, monthly_credits: 500, pooled: true, quota: 'monthly' });
  assert.deepEqual(bySlug.business.ai, { enabled: true, monthly_credits: null, pooled: true, quota: 'contractual_configurable' });
});

test('/pricing renders approved AI and RelNet messaging without provider internals', () => {
  const pricing = read('app/pricing/page.tsx');
  for (const phrase of ['RelNet AI','100 AI Credits','500 AI Credits','cuota contractual','direct P2P','Relay','SSH','RDP','RelDrop','RelShare','Exit Node','Subnet Router']) assert.match(pricing, new RegExp(phrase, 'i'));
  assert.doesNotMatch(pricing, /RunPod|GGUF|tokens?\b|horas?\b|ilimitad|unlimited/i);
});

test('pricing states ad rules without third-party dashboard scripts', () => {
  const pricing = read('app/pricing/page.tsx');
  assert.match(pricing, /Free[^]*patrocinio nativo directo/i);
  assert.match(pricing, /terceros/i);
  assert.match(pricing, /planes? de pago[^]*sin anuncios/i);
  assert.doesNotMatch(pricing, /doubleclick|googlesyndication|adsbygoogle/i);
});

test('home and shell expose Pricing from the same contract', () => {
  const home = read('app/page.tsx');
  const shell = read('components/public/PublicShell.tsx');
  assert.match(home, /publicPlans/);
  assert.match(home, /href="\/pricing"/);
  assert.match(shell, /href="\/pricing"/);
  assert.doesNotMatch(home, /\$149|1,490|\$399|3,990/);
});

test('owned public surfaces contain no obsolete price or app domain', () => {
  const owned = ['app/page.tsx','app/pricing/page.tsx','components/public/PublicShell.tsx'].map(read).join('\n');
  assert.doesNotMatch(owned, /\$149|1490|1,490|\$399|3990|3,990/);
  assert.doesNotMatch(owned, /app\.relead\.com\.mx/);
});
