export interface ImageChannelStats {
  mean: number;
  stdev: number;
}

export interface AdaptivePhotoGrade {
  brightness: number;
  saturation: number;
  contrastSlope: number;
  contrastOffset: number;
  sharpenSigma: number;
}

export const PIPELINE_VERSION = '2.0.0';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round3(value: number): number {
  return Number(value.toFixed(3));
}

/**
 * Computes conservative, identity-preserving editorial lighting, contrast,
 * and sharpness adjustments from an image's RGB luminance statistics.
 * Tight clamps prevent artificial oversaturation or blown-out skin tones.
 */
export function computeAdaptivePhotoGrade(
  channels: readonly ImageChannelStats[],
  preset: 'photo' | 'poster' = 'photo'
): AdaptivePhotoGrade {
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

  // Gently lift underexposed church photos without washing out well-lit shots
  const targetMean = 124;
  const exposureDelta = (targetMean - avgMean) / 255;
  const brightness = round3(clamp(1.02 + exposureDelta * 0.16, 0.98, 1.09));

  // Add mild editorial contrast when source dynamic range is flat (low stdev)
  const contrastBoost = avgStdev < 52 ? 0.08 : avgStdev < 64 ? 0.06 : 0.04;
  const contrastSlope = round3(clamp(1 + contrastBoost, 1.03, 1.1));
  const contrastOffset = Number((-128 * (contrastSlope - 1)).toFixed(2));

  // Preserve authentic skin tones with restrained saturation lift
  const saturation = round3(clamp(1.06 + (avgMean < 105 ? 0.02 : 0), 1.04, 1.09));
  const sharpenSigma = 0.88;

  return {
    brightness,
    saturation,
    contrastSlope,
    contrastOffset,
    sharpenSigma,
  };
}
