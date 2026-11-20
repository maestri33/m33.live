import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public/assets/optimized');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const PIPELINE_VERSION = '2.0.0';
const FORCE = process.argv.includes('--force');

const PHOTO_JOBS = [
  {
    slug: 'portrait-studio',
    input: 'src/assets/images/maestri_portrait_retouch_1795116608812.jpg',
    widths: [640, 1200, 1920],
    preset: 'photo',
  },
  {
    slug: 'stage-live',
    input: 'src/assets/images/maestri_stage_retouch_1795116611555.jpg',
    widths: [640, 1200],
    preset: 'photo',
  },
  {
    slug: 'beige-pulpit',
    input: 'src/assets/images/maestri_beige_pulpit_1795128542937.jpg',
    widths: [640, 1200],
    preset: 'photo',
  },
  {
    slug: 'blazer-preach',
    input: 'src/assets/images/maestri_blazer_preach_1795128542522.jpg',
    widths: [640, 1200],
    preset: 'photo',
  },
  {
    slug: 'couple-blessing',
    input: 'src/assets/images/maestri_couple_blessing_1795128543242.jpg',
    widths: [640, 1200],
    preset: 'photo',
  },
  {
    slug: 'baby-dedication',
    input: 'src/assets/images/maestri_baby_dedication_1795128544036.jpg',
    widths: [640, 1200],
    preset: 'photo',
  },
  {
    slug: 'youth-pulpit',
    input: 'src/assets/images/youth_pulpit_source.png',
    widths: [640, 1024],
    preset: 'photo',
  },
  {
    slug: 'poster-highlight',
    input: '/tmp/ministry-posters/poster-highlight.jpg',
    widths: [640, 1280],
    preset: 'poster',
    optional: true,
  },
  {
    slug: 'poster-nova-natureza',
    input: '/tmp/ministry-posters/poster-nova-natureza.jpg',
    widths: [540],
    preset: 'poster',
    optional: true,
  },
  {
    slug: 'poster-guiado-pelo-espirito',
    input: '/tmp/ministry-posters/poster-guiado-pelo-espirito.jpg',
    widths: [540],
    preset: 'poster',
    optional: true,
  },
  {
    slug: 'poster-ceia-do-senhor',
    input: '/tmp/ministry-posters/poster-ceia-do-senhor.jpg',
    widths: [540],
    preset: 'poster',
    optional: true,
  },
  {
    slug: 'poster-adoracao-igreja',
    input: '/tmp/ministry-posters/poster-adoracao-igreja.jpg',
    widths: [540],
    preset: 'poster',
    optional: true,
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round3(value) {
  return Number(value.toFixed(3));
}

function computeAdaptiveGrade(channels, preset = 'photo') {
  const rgb = channels.slice(0, 3);
  const avgMean =
    rgb.length > 0
      ? rgb.reduce((sum, ch) => sum + ch.mean, 0) / rgb.length
      : 120;
  const avgStdev =
    rgb.length > 0
      ? rgb.reduce((sum, ch) => sum + ch.stdev, 0) / rgb.length
      : 55;

  if (preset === 'poster') {
    return {
      brightness: 1.02,
      saturation: 1.04,
      contrastSlope: 1.04,
      contrastOffset: -4,
      sharpenSigma: 0.7,
    };
  }

  const targetMean = 124;
  const exposureDelta = (targetMean - avgMean) / 255;
  const brightness = round3(clamp(1.02 + exposureDelta * 0.16, 0.98, 1.09));
  const contrastBoost = avgStdev < 52 ? 0.08 : avgStdev < 64 ? 0.06 : 0.04;
  const contrastSlope = round3(clamp(1 + contrastBoost, 1.03, 1.1));
  const contrastOffset = Number((-128 * (contrastSlope - 1)).toFixed(2));
  const saturation = round3(clamp(1.06 + (avgMean < 105 ? 0.02 : 0), 1.04, 1.09));

  return {
    brightness,
    saturation,
    contrastSlope,
    contrastOffset,
    sharpenSigma: 0.88,
  };
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadExistingManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { version: null, items: {} };
  }
}

async function allOutputsExist(slug, widths) {
  for (const w of widths) {
    for (const ext of ['avif', 'webp', 'jpg']) {
      if (!(await fileExists(path.join(OUT_DIR, `${slug}-${w}w.${ext}`)))) {
        return false;
      }
    }
  }
  return true;
}

async function run() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const prevManifest = await loadExistingManifest();
  const nextItems = { ...(prevManifest.items ?? {}) };

  let totalOriginal = 0;
  let totalAvifPrimary = 0;
  let totalWebpPrimary = 0;
  let processedCount = 0;
  let cachedCount = 0;

  for (const job of PHOTO_JOBS) {
    const inputPath = path.isAbsolute(job.input)
      ? job.input
      : path.join(ROOT, job.input);

    if (!(await fileExists(inputPath))) {
      if (job.optional) {
        if (nextItems[job.slug]) {
          totalOriginal += nextItems[job.slug].originalBytes ?? 0;
          totalAvifPrimary += nextItems[job.slug].avifBytes ?? 0;
          totalWebpPrimary += nextItems[job.slug].webpBytes ?? 0;
        }
        continue;
      }
      throw new Error(`Missing required source image: ${inputPath}`);
    }

    const origStat = await fs.stat(inputPath);
    const cached = prevManifest.items?.[job.slug];
    const isFresh =
      !FORCE &&
      prevManifest.version === PIPELINE_VERSION &&
      cached &&
      cached.sourceMtimeMs === origStat.mtimeMs &&
      cached.originalBytes === origStat.size &&
      (await allOutputsExist(job.slug, job.widths));

    if (isFresh) {
      cachedCount += 1;
      totalOriginal += cached.originalBytes;
      totalAvifPrimary += cached.avifBytes;
      totalWebpPrimary += cached.webpBytes;
      continue;
    }

    const source = sharp(inputPath);
    const [meta, stats] = await Promise.all([source.metadata(), source.stats()]);
    const grade = computeAdaptiveGrade(stats.channels, job.preset);
    const primaryWidth = job.widths[job.widths.length - 1];

    let primaryAvifBytes = 0;
    let primaryWebpBytes = 0;
    let primaryJpgBytes = 0;

    for (const width of job.widths) {
      const targetWidth = meta.width ? Math.min(width, meta.width) : width;

      const pipeline = sharp(inputPath)
        .rotate()
        .resize({
          width: targetWidth,
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
        })
        .toColorspace('srgb')
        .linear(grade.contrastSlope, grade.contrastOffset)
        .modulate({
          brightness: grade.brightness,
          saturation: grade.saturation,
        })
        .sharpen({ sigma: grade.sharpenSigma, m1: 0.9, m2: 2.0 });

      const base = path.join(OUT_DIR, `${job.slug}-${width}w`);

      const [avifInfo, webpInfo, jpgInfo] = await Promise.all([
        pipeline
          .clone()
          .avif({ quality: 64, effort: 3, chromaSubsampling: '4:2:0' })
          .toFile(`${base}.avif`),
        pipeline
          .clone()
          .webp({ quality: 85, effort: 4, smartSubsample: true })
          .toFile(`${base}.webp`),
        pipeline
          .clone()
          .jpeg({ quality: 85, progressive: true, mozjpeg: true })
          .toFile(`${base}.jpg`),
      ]);

      if (width === primaryWidth) {
        primaryAvifBytes = avifInfo.size;
        primaryWebpBytes = webpInfo.size;
        primaryJpgBytes = jpgInfo.size;
      }
    }

    processedCount += 1;
    totalOriginal += origStat.size;
    totalAvifPrimary += primaryAvifBytes;
    totalWebpPrimary += primaryWebpBytes;

    nextItems[job.slug] = {
      slug: job.slug,
      widths: job.widths,
      sourceMtimeMs: origStat.mtimeMs,
      originalBytes: origStat.size,
      avifBytes: primaryAvifBytes,
      webpBytes: primaryWebpBytes,
      jpgBytes: primaryJpgBytes,
      grade,
    };

    console.log(
      `${job.slug.padEnd(28)} orig ${formatKb(origStat.size).padStart(9)} -> ${primaryWidth}w: AVIF ${formatKb(primaryAvifBytes).padStart(8)} | WebP ${formatKb(primaryWebpBytes).padStart(8)} | JPG ${formatKb(primaryJpgBytes).padStart(8)} (b=${grade.brightness}, c=${grade.contrastSlope})`
    );
  }

  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify(
      {
        version: PIPELINE_VERSION,
        updatedAt: new Date().toISOString(),
        items: nextItems,
      },
      null,
      2
    )
  );

  if (processedCount === 0 && cachedCount > 0) {
    console.log(
      `Sharp pipeline up-to-date (${cachedCount} assets cached, AVIF ${formatKb(totalAvifPrimary)} vs ${formatKb(totalOriginal)} orig).`
    );
  } else {
    const avifSaved =
      totalOriginal > 0 ? Math.round((1 - totalAvifPrimary / totalOriginal) * 100) : 0;
    const webpSaved =
      totalOriginal > 0 ? Math.round((1 - totalWebpPrimary / totalOriginal) * 100) : 0;
    console.log('---');
    console.log(
      `Processed ${processedCount} asset(s) (${cachedCount} cached). Totals: ${formatKb(totalOriginal)} -> AVIF ${formatKb(totalAvifPrimary)} (${avifSaved}% lighter) | WebP ${formatKb(totalWebpPrimary)} (${webpSaved}% lighter)`
    );
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
