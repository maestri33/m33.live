import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  SEO_CONFIG,
  resolveAbsoluteSeoUrl,
  buildPersonJsonLd,
} from './seoMetadata';

test('SEO_CONFIG title and description stay within optimal search snippet lengths', () => {
  assert.ok(
    SEO_CONFIG.title.length >= 30 && SEO_CONFIG.title.length <= 60,
    `Title length ${SEO_CONFIG.title.length} should be between 30 and 60 chars`
  );
  assert.ok(
    SEO_CONFIG.description.length >= 120 && SEO_CONFIG.description.length <= 160,
    `Description length ${SEO_CONFIG.description.length} should be between 120 and 160 chars`
  );
});

test('resolveAbsoluteSeoUrl normalizes origin and path cleanly without double slashes', () => {
  assert.equal(
    resolveAbsoluteSeoUrl('https://maestrioficial.com.br/', '/'),
    'https://maestrioficial.com.br/'
  );
  assert.equal(
    resolveAbsoluteSeoUrl('https://maestrioficial.com.br', 'assets/optimized/portrait-studio-1200w.jpg'),
    'https://maestrioficial.com.br/assets/optimized/portrait-studio-1200w.jpg'
  );
  assert.equal(
    resolveAbsoluteSeoUrl('', '/assets/optimized/portrait-studio-1200w.jpg'),
    '/assets/optimized/portrait-studio-1200w.jpg'
  );
});

test('buildPersonJsonLd returns valid Schema.org Person structured data', () => {
  const schema = buildPersonJsonLd('https://maestrioficial.com.br', '/');
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'Person');
  assert.equal(schema.name, 'Maestri Oficial');
  assert.equal(schema.alternateName, '@maestri.oficial');
  assert.equal(schema.url, 'https://maestrioficial.com.br/');
  assert.equal(
    schema.image,
    'https://maestrioficial.com.br/assets/optimized/portrait-studio-1200w.jpg'
  );
  assert.ok(schema.sameAs.includes('https://www.instagram.com/maestri.oficial/'));
  assert.ok(schema.knowsAbout.includes('Evangelho da Graça'));
  assert.equal(schema.homeLocation.address.addressCountry, 'BR');
  assert.equal(schema.contactPoint.telephone, '+55-43-99664-8750');
});

test('index.html contains comprehensive OpenGraph, Twitter Cards, canonical, and valid Person JSON-LD', () => {
  const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');

  const requiredPatterns = [
    /<title>Maestri Oficial — Evangelho da Graça e Vida em Cristo<\/title>/,
    /<meta\s+name="description"/,
    /<meta\s+name="robots"/,
    /<meta\s+name="author"\s+content="Maestri Oficial"/,
    /<link\s+rel="canonical"/,
    /<meta\s+property="og:type"\s+content="website"/,
    /<meta\s+property="og:locale"\s+content="pt_BR"/,
    /<meta\s+property="og:site_name"\s+content="Maestri Oficial"/,
    /<meta\s+property="og:title"/,
    /<meta\s+property="og:description"/,
    /<meta\s+property="og:url"/,
    /<meta\s+property="og:image"/,
    /<meta\s+property="og:image:type"\s+content="image\/jpeg"/,
    /<meta\s+property="og:image:width"\s+content="1200"/,
    /<meta\s+property="og:image:height"\s+content="670"/,
    /<meta\s+property="og:image:alt"/,
    /<meta\s+name="twitter:card"\s+content="summary_large_image"/,
    /<meta\s+name="twitter:title"/,
    /<meta\s+name="twitter:description"/,
    /<meta\s+name="twitter:image"/,
    /<meta\s+name="twitter:image:alt"/,
  ];

  for (const pattern of requiredPatterns) {
    assert.match(html, pattern, `Expected index.html to match ${pattern}`);
  }

  const jsonLdMatch = html.match(
    /<script\s+type="application\/ld\+json"\s+id="schema-person">([\s\S]*?)<\/script>/
  );
  assert.ok(jsonLdMatch, 'Expected <script type="application/ld+json" id="schema-person"> in index.html');

  const parsed = JSON.parse(jsonLdMatch[1]);
  assert.equal(parsed['@context'], 'https://schema.org');
  assert.equal(parsed['@type'], 'Person');
  assert.equal(parsed.name, 'Maestri Oficial');
  assert.equal(parsed.alternateName, '@maestri.oficial');
  assert.ok(Array.isArray(parsed.sameAs) && parsed.sameAs.length >= 2);
  assert.ok(Array.isArray(parsed.knowsAbout) && parsed.knowsAbout.length >= 4);
  assert.equal(parsed.contactPoint['@type'], 'ContactPoint');
});
