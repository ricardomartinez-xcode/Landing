import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import ts from 'typescript';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');

async function loadTs(relativePath) {
  const source = read(relativePath);
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
    fileName: relativePath,
  }).outputText;
  const dir = mkdtempSync(join(tmpdir(), 'relnets-test-'));
  const file = join(dir, relativePath.split('/').pop().replace(/\.ts$/, '.mjs'));
  writeFileSync(file, output, 'utf8');
  return import(pathToFileURL(file).href + `?v=${Date.now()}-${Math.random()}`);
}

const { evaluateMonetization, canLoadProvider, monetizationEnabled } = await loadTs('lib/monetization/policy.ts');
const { advertisingConsent } = await loadTs('lib/monetization/consent.ts');
const { resolveContextualProvider } = await loadTs('lib/monetization/providers.ts');

test('public landing and docs allow only explicitly authorized public monetization', () => {
  for (const surface of ['public_landing', 'public_docs']) {
    assert.equal(evaluateMonetization({ surface, format: 'direct_sponsor' }).allowed, true);
    assert.equal(evaluateMonetization({ surface, format: 'contextual_ad' }).allowed, true);
  }
});

test('forbidden and unknown surfaces fail closed', () => {
  for (const surface of ['ssh_terminal','auth','pairing','recovery','internal_console','remote_chrome_extension','private_chat','email_message','unknown_surface']) {
    assert.equal(evaluateMonetization({ surface, format: 'direct_sponsor' }).allowed, false, surface);
    assert.equal(evaluateMonetization({ surface, format: 'contextual_ad' }).allowed, false, surface);
  }
});

test('third-party provider loading requires public surface plus explicit advertising consent', () => {
  assert.equal(canLoadProvider({ surface: 'public_landing', provider: 'direct', consent: 'not_required' }), true);
  assert.equal(canLoadProvider({ surface: 'public_landing', provider: 'third_party', consent: 'granted' }), true);
  assert.equal(canLoadProvider({ surface: 'public_landing', provider: 'third_party', consent: 'unknown' }), false);
  assert.equal(canLoadProvider({ surface: 'auth', provider: 'third_party', consent: 'granted' }), false);
});

test('monetization feature flag is off unless explicitly enabled', () => {
  assert.equal(monetizationEnabled({}), false);
  assert.equal(monetizationEnabled({ RELEAD_MONETIZATION_ENABLED: 'false' }), false);
  assert.equal(monetizationEnabled({ RELEAD_MONETIZATION_ENABLED: 'true' }), true);
});

test('landing uses explicit reusable slots and removes ad-hoc active NEXT_PUBLIC_AD inventory', () => {
  const home = read('app/page.tsx');
  const faqs = read('app/FAQs/page.tsx');
  assert.match(home, /PublicAdSlot/);
  assert.match(home, /surface="public_landing"/);
  assert.match(faqs, /PublicAdSlot/);
  assert.match(faqs, /surface="public_docs"/);
  assert.doesNotMatch(home, /NEXT_PUBLIC_AD_[12]_/);
});

test('privacy distinguishes direct sponsorship from external advertising technology', () => {
  const privacy = read('app/privacy/page.tsx');
  assert.match(privacy, /patrocin/i);
  assert.match(privacy, /proveedor(?:es)? externo/i);
  assert.match(privacy, /consentimiento/i);
});

test('consent hook defaults closed and contextual provider is lazy with blocker-safe fallback', async () => {
  assert.equal(advertisingConsent(), 'unknown');
  assert.equal(advertisingConsent({ advertising: false }), 'denied');
  assert.equal(advertisingConsent({ advertising: true }), 'granted');
  let loads = 0;
  const adapter = {
    id: 'fake-contextual', kind: 'third_party', requiresConsent: true, origins: ['https://ads.example.test'],
    async load() { loads += 1; throw new Error('blocked'); },
    async resolve() { return { id: 'never', title: 'x', body: 'x', href: 'https://example.test' }; },
  };
  const base = { surface: 'public_landing', placement: 'test', format: 'contextual_ad' };
  assert.equal(await resolveContextualProvider(adapter, { ...base, consent: 'unknown' }), null);
  assert.equal(loads, 0);
  assert.equal(await resolveContextualProvider(adapter, { ...base, consent: 'granted' }), null);
  assert.equal(loads, 1);
});

test('public CSP blocks unapproved third-party advertising origins', () => {
  const config = read('next.config.ts');
  assert.match(config, /Content-Security-Policy/);
  assert.match(config, /script-src 'self'/);
  assert.match(config, /connect-src 'self'/);
  assert.doesNotMatch(config, /googleads|doubleclick|googlesyndication|adservice/i);
});
