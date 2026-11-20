import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import {
  MINISTRY_GALLERY_PHOTOS,
  type MinistryGalleryPhoto,
} from '../utils/heroMath';
import { OptimizedPicture } from './OptimizedPicture';

interface EditorialPhotoCardProps {
  photo: MinistryGalleryPhoto;
  sizes: string;
  aspectClass?: string;
  objectPositionClass?: string;
  overlayCaption?: boolean;
  onOpen: (photoId: string) => void;
  className?: string;
}

export function EditorialPhotoCard({
  photo,
  sizes,
  aspectClass,
  objectPositionClass,
  overlayCaption = true,
  onOpen,
  className = '',
}: EditorialPhotoCardProps) {
  const effectiveAspect = aspectClass ?? photo.aspectClass;
  const effectivePosition =
    objectPositionClass ?? photo.objectPositionClass ?? 'object-center';

  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#140E0E] ${className}`}
    >
      <button
        type="button"
        onClick={() => onOpen(photo.id)}
        aria-label={`Ampliar foto: ${photo.title}`}
        className="block w-full h-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
      >
        <div className={`relative w-full overflow-hidden ${effectiveAspect}`}>
          <OptimizedPicture
            slug={photo.slug}
            widths={photo.widths}
            sizes={sizes}
            alt={photo.alt}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${effectivePosition}`}
          />

          {overlayCaption && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"
            />
          )}

          <span
            aria-hidden="true"
            className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 opacity-85 group-hover:opacity-100 transition-opacity"
          >
            <Expand size={14} />
          </span>

          {overlayCaption && (
            <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="font-mono-meta text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E05A2B] mb-1">
                {photo.tag}
              </p>
              <p className="font-editorial text-lg sm:text-xl text-white font-normal leading-snug mb-1">
                {photo.title}
              </p>
              <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed line-clamp-2">
                {photo.caption}
              </p>
            </figcaption>
          )}
        </div>

        {!overlayCaption && (
          <figcaption className="p-4 sm:p-5">
            <p className="font-mono-meta text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E05A2B] mb-1">
              {photo.tag}
            </p>
            <p className="font-editorial text-lg text-white font-normal leading-snug mb-1">
              {photo.title}
            </p>
            <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed">
              {photo.caption}
            </p>
          </figcaption>
        )}
      </button>
    </figure>
  );
}

interface PhotoLightboxProps {
  activePhotoId: string | null;
  onClose: () => void;
  onSelectPhoto: (photoId: string) => void;
}

export function PhotoLightbox({
  activePhotoId,
  onClose,
  onSelectPhoto,
}: PhotoLightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const currentIndex = activePhotoId
    ? MINISTRY_GALLERY_PHOTOS.findIndex((p) => p.id === activePhotoId)
    : -1;
  const activePhoto =
    currentIndex >= 0 ? MINISTRY_GALLERY_PHOTOS[currentIndex] : null;

  useEffect(() => {
    if (!activePhoto) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        const nextIdx = (currentIndex + 1) % MINISTRY_GALLERY_PHOTOS.length;
        onSelectPhoto(MINISTRY_GALLERY_PHOTOS[nextIdx].id);
      } else if (event.key === 'ArrowLeft') {
        const prevIdx =
          (currentIndex - 1 + MINISTRY_GALLERY_PHOTOS.length) %
          MINISTRY_GALLERY_PHOTOS.length;
        onSelectPhoto(MINISTRY_GALLERY_PHOTOS[prevIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhoto, currentIndex, onClose, onSelectPhoto]);

  if (!activePhoto) return null;

  const goPrev = () => {
    const prevIdx =
      (currentIndex - 1 + MINISTRY_GALLERY_PHOTOS.length) %
      MINISTRY_GALLERY_PHOTOS.length;
    onSelectPhoto(MINISTRY_GALLERY_PHOTOS[prevIdx].id);
  };

  const goNext = () => {
    const nextIdx = (currentIndex + 1) % MINISTRY_GALLERY_PHOTOS.length;
    onSelectPhoto(MINISTRY_GALLERY_PHOTOS[nextIdx].id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização ampliada: ${activePhoto.title}`}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl border border-white/15 bg-[#0E0B0B] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-white/10">
          <div className="min-w-0">
            <p className="font-mono-meta text-[10px] uppercase tracking-[0.14em] text-[#E05A2B]">
              {activePhoto.tag} · {currentIndex + 1} /{' '}
              {MINISTRY_GALLERY_PHOTOS.length}
            </p>
            <p className="font-editorial text-lg text-white truncate">
              {activePhoto.title}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Próxima foto"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar visualização"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="bg-black flex items-center justify-center max-h-[68vh] overflow-hidden">
          <OptimizedPicture
            slug={activePhoto.slug}
            widths={activePhoto.widths}
            sizes="90vw"
            alt={activePhoto.alt}
            priority
            pictureClassName="flex items-center justify-center w-full h-full"
            className="max-h-[68vh] w-auto max-w-full object-contain"
          />
        </div>

        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-sm text-white/80 leading-relaxed">
            {activePhoto.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
