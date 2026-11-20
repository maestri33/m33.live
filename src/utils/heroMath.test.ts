import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARC_CENTER,
  ARC_STATS,
  GRACE_SCRIPTURES,
  HIGHLIGHT_CLIP_SECONDS,
  MINISTRY_GALLERY_PHOTOS,
  MINISTRY_MESSAGES,
  MINISTRY_VIDEO_CLIPS,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER_BR,
  buildComputedArcs,
  buildOptimizedImageSources,
  buildWhatsAppUrl,
  computeActiveNavSection,
  computeArcLength,
  computeGridParallaxTarget,
  computeHighlightProgress,
  describeArcPath,
  filterMinistryMessages,
  formatSeconds,
  getMinistryPhotoById,
  getNextTabIndex,
  lerp,
  polarToCartesian,
  shouldLoopHighlightClip,
  validateInvitationForm,
  validateReservationEmail,
} from './heroMath';
import { computeAdaptivePhotoGrade } from './imagePipeline';

test('polarToCartesian computes expected SVG coordinates', () => {
  const p0 = polarToCartesian({ x: 0, y: 0 }, 100, 0);
  assert.deepEqual(p0, { x: 100, y: 0 });

  const p90 = polarToCartesian({ x: 10, y: 20 }, 100, 90);
  assert.deepEqual(p90, { x: 10, y: 120 });

  const pNeg90 = polarToCartesian({ x: 10, y: 20 }, 100, -90);
  assert.deepEqual(pNeg90, { x: 10, y: -80 });
});

test('computeArcLength computes r * deltaAngle in radians', () => {
  const quarterCircle = computeArcLength(100, 0, 90);
  assert.equal(quarterCircle, Number(((100 * Math.PI) / 2).toFixed(2)));
});

test('buildComputedArcs places all dots and accessible labels cleanly inside 380x700 viewBox', () => {
  const arcs = buildComputedArcs(ARC_STATS, ARC_CENTER);
  assert.equal(arcs.length, 3);

  for (const arc of arcs) {
    assert.ok(arc.dot.x > 0 && arc.dot.x < 340, `dot.x out of bounds for ${arc.id}: ${arc.dot.x}`);
    assert.ok(arc.dot.y > 0 && arc.dot.y < 680, `dot.y out of bounds for ${arc.id}: ${arc.dot.y}`);
    assert.ok(arc.accessibleLabel.length > 5);
    assert.ok(arc.arcLength > 0);
    assert.ok(arc.pathD.startsWith('M '));
    assert.ok(arc.pathD.includes(`A ${arc.radius} ${arc.radius} 0 0 1 `));
  }
});

test('describeArcPath produces valid SVG arc command', () => {
  const path = describeArcPath({ x: 0, y: 0 }, 100, 0, 90);
  assert.equal(path, 'M 100 0 A 100 100 0 0 1 0 100');
});

test('lerp and computeGridParallaxTarget work as specified', () => {
  assert.equal(lerp(0, 100, 0.1), 10);
  assert.equal(lerp(50, 50, 0.06), 50);

  assert.equal(computeGridParallaxTarget(0, 1000, 16), -8);
  assert.equal(computeGridParallaxTarget(500, 1000, 16), 0);
  assert.equal(computeGridParallaxTarget(1000, 1000, 16), 8);
  assert.equal(computeGridParallaxTarget(500, 0, 16), 0);
});

test('filterMinistryMessages filters by category and preserves all on Todas', () => {
  assert.equal(filterMinistryMessages(MINISTRY_MESSAGES, 'Todas').length, MINISTRY_MESSAGES.length);
  const gracaCruz = filterMinistryMessages(MINISTRY_MESSAGES, 'Graça & Cruz');
  assert.equal(gracaCruz.length, 2);
  assert.equal(gracaCruz[0].id, 'obra-consumada');
  const justica = filterMinistryMessages(MINISTRY_MESSAGES, 'Justiça pela Fé');
  assert.equal(justica.length, 1);
  assert.equal(justica[0].id, 'dom-da-justica');
  const vidaEmCristo = filterMinistryMessages(MINISTRY_MESSAGES, 'Vida em Cristo');
  assert.equal(vidaEmCristo.length, 2);
  for (const msg of MINISTRY_MESSAGES) {
    assert.ok(msg.scriptureRef.length > 0);
    assert.ok(msg.excerptQuote.length > 20);
    assert.equal(msg.keyPoints.length, 3);
  }
  assert.equal(GRACE_SCRIPTURES.length, 4);
  assert.ok(GRACE_SCRIPTURES.some((item) => item.reference === '2 Coríntios 12:9'));
});

test('getNextTabIndex cycles tabs properly for ArrowLeft, ArrowRight, Home, and End', () => {
  assert.equal(getNextTabIndex(0, 'ArrowRight', 4), 1);
  assert.equal(getNextTabIndex(3, 'ArrowRight', 4), 0);
  assert.equal(getNextTabIndex(0, 'ArrowLeft', 4), 3);
  assert.equal(getNextTabIndex(2, 'Home', 4), 0);
  assert.equal(getNextTabIndex(1, 'End', 4), 3);
  assert.equal(getNextTabIndex(1, 'Enter', 4), null);
});

test('formatSeconds formats audio excerpt timestamps', () => {
  assert.equal(formatSeconds(0), '0:00');
  assert.equal(formatSeconds(68), '1:08');
  assert.equal(formatSeconds(125), '2:05');
});

test('validateInvitationForm returns structured field errors and accepts valid submissions', () => {
  assert.ok(validateReservationEmail('') !== null);
  assert.equal(validateReservationEmail('contato@igreja.com.br'), null);

  const missingOrg = validateInvitationForm({ organizer: '', city: 'SP', email: 'a@b.com' });
  assert.equal(missingOrg?.field, 'organizer');

  const missingCity = validateInvitationForm({ organizer: 'Igreja Vida', city: '   ', email: 'a@b.com' });
  assert.equal(missingCity?.field, 'city');

  const badEmail = validateInvitationForm({ organizer: 'Igreja Vida', city: 'Curitiba', email: 'nope' });
  assert.equal(badEmail?.field, 'email');

  assert.equal(
    validateInvitationForm({
      organizer: 'Igreja Vida',
      city: 'Curitiba - PR',
      email: 'agenda@igrejavida.org',
    }),
    null
  );
});

test('shouldLoopHighlightClip and computeHighlightProgress enforce 30-second loop window', () => {
  assert.equal(HIGHLIGHT_CLIP_SECONDS, 30);
  assert.equal(shouldLoopHighlightClip(0), false);
  assert.equal(shouldLoopHighlightClip(29.9), false);
  assert.equal(shouldLoopHighlightClip(30), true);
  assert.equal(shouldLoopHighlightClip(42), true);

  assert.equal(computeHighlightProgress(15, 30), 50);
  assert.equal(computeHighlightProgress(15, 180), 50);
  assert.equal(computeHighlightProgress(30, 180), 100);
  assert.equal(computeHighlightProgress(-2, 30), 0);
});

test('buildWhatsAppUrl formats Brazilian phone 43996648750 and encodes message text', () => {
  assert.equal(WHATSAPP_NUMBER_BR, '5543996648750');
  assert.equal(WHATSAPP_DISPLAY, '(43) 99664-8750');
  assert.equal(buildWhatsAppUrl(), 'https://wa.me/5543996648750');
  assert.equal(buildWhatsAppUrl(undefined, '(43) 99664-8750'), 'https://wa.me/5543996648750');
  assert.equal(
    buildWhatsAppUrl('Olá Maestri!'),
    'https://wa.me/5543996648750?text=Ol%C3%A1%20Maestri!'
  );
});

test('buildOptimizedImageSources generates sorted AVIF, WebP, and JPEG responsive srcsets', () => {
  const sources = buildOptimizedImageSources('beige-pulpit', [1200, 640]);
  assert.equal(
    sources.avifSrcSet,
    '/assets/optimized/beige-pulpit-640w.avif 640w, /assets/optimized/beige-pulpit-1200w.avif 1200w'
  );
  assert.equal(
    sources.webpSrcSet,
    '/assets/optimized/beige-pulpit-640w.webp 640w, /assets/optimized/beige-pulpit-1200w.webp 1200w'
  );
  assert.equal(sources.fallbackSrc, '/assets/optimized/beige-pulpit-1200w.jpg');
  assert.equal(sources.primaryWebpSrc, '/assets/optimized/beige-pulpit-1200w.webp');
});

test('gallery photo and video manifests are complete and well-formed', () => {
  assert.equal(MINISTRY_GALLERY_PHOTOS.length, 6);
  for (const photo of MINISTRY_GALLERY_PHOTOS) {
    assert.ok(photo.slug.length > 0);
    assert.ok(photo.alt.length > 10);
    assert.ok(photo.widths.length >= 2);
  }
  assert.equal(getMinistryPhotoById('beige-pulpit').slug, 'beige-pulpit');
  assert.equal(getMinistryPhotoById('unknown-id').id, 'stage-live');

  assert.equal(MINISTRY_VIDEO_CLIPS.length, 4);
  for (const clip of MINISTRY_VIDEO_CLIPS) {
    assert.ok(clip.videoSrc.startsWith('/assets/videos/'));
    assert.ok(clip.videoSrc.endsWith('.mp4'));
    assert.ok(clip.posterSlug.startsWith('poster-'));
  }
});

test('computeAdaptivePhotoGrade lifts dim photos conservatively and clamps bounds', () => {
  const dimPhoto = computeAdaptivePhotoGrade([
    { mean: 70, stdev: 40 },
    { mean: 72, stdev: 42 },
    { mean: 68, stdev: 38 },
  ]);
  assert.ok(dimPhoto.brightness > 1.04 && dimPhoto.brightness <= 1.09);
  assert.equal(dimPhoto.contrastSlope, 1.08);
  assert.ok(dimPhoto.sharpenSigma >= 0.8);

  const brightPhoto = computeAdaptivePhotoGrade([
    { mean: 190, stdev: 72 },
    { mean: 185, stdev: 70 },
    { mean: 180, stdev: 68 },
  ]);
  assert.ok(brightPhoto.brightness >= 0.98 && brightPhoto.brightness <= 1.02);
  assert.equal(brightPhoto.contrastSlope, 1.04);

  const poster = computeAdaptivePhotoGrade([{ mean: 90, stdev: 30 }], 'poster');
  assert.equal(poster.sharpenSigma, 0.7);
});

test('computeActiveNavSection highlights exact visible section including tall sections and page bottom', () => {
  const sections = [
    { navId: 'inicio', top: 0 },
    { navId: 'ministerio', top: 1800 },
    { navId: 'galeria', top: 2700 },
    { navId: 'mensagens', top: 3600 },
    { navId: 'escrituras', top: 6400 }, // very tall 2800px mensagens section
    { navId: 'agenda', top: 7300 },
  ];
  const docHeight = 8200;
  const vpHeight = 900;

  assert.equal(computeActiveNavSection(sections, 0, vpHeight, docHeight), 'inicio');
  assert.equal(computeActiveNavSection(sections, 1100, vpHeight, docHeight), 'inicio');
  assert.equal(computeActiveNavSection(sections, 1600, vpHeight, docHeight), 'ministerio');
  assert.equal(computeActiveNavSection(sections, 2500, vpHeight, docHeight), 'galeria');
  assert.equal(computeActiveNavSection(sections, 3500, vpHeight, docHeight), 'mensagens');
  // Middle of very tall mensagens section stays locked on mensagens
  assert.equal(computeActiveNavSection(sections, 5000, vpHeight, docHeight), 'mensagens');
  assert.equal(computeActiveNavSection(sections, 6200, vpHeight, docHeight), 'escrituras');
  // At very bottom of page, guarantees last nav section highlights
  assert.equal(computeActiveNavSection(sections, 7300, vpHeight, docHeight), 'agenda');
});
