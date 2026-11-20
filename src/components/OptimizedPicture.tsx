import React from 'react';
import { buildOptimizedImageSources } from '../utils/heroMath';

interface OptimizedPictureProps {
  slug: string;
  widths?: readonly number[];
  sizes: string;
  alt: string;
  className?: string;
  pictureClassName?: string;
  priority?: boolean;
}

export function OptimizedPicture({
  slug,
  widths = [640, 1200],
  sizes,
  alt,
  className = '',
  pictureClassName = 'block w-full h-full',
  priority = false,
}: OptimizedPictureProps) {
  const sources = buildOptimizedImageSources(slug, widths);

  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={sources.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={sources.webpSrcSet} sizes={sizes} />
      <img
        src={sources.fallbackSrc}
        srcSet={sources.jpgSrcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        className={className}
      />
    </picture>
  );
}
