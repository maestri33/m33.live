import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import {
  MINISTRY_VIDEO_CLIPS,
  type MinistryVideoClip,
  buildOptimizedImageSources,
} from '../utils/heroMath';

interface VideoClipCardProps {
  clip: MinistryVideoClip;
  isActive: boolean;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}

function VideoClipCard({
  clip,
  isActive,
  onActivate,
  onDeactivate,
}: VideoClipCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const posterSources = buildOptimizedImageSources(clip.posterSlug, [540]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      video.pause();
      return;
    }

    video.muted = isMuted;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    }
  }, [isActive, isMuted]);

  const handleTogglePlay = () => {
    if (isActive) {
      onDeactivate(clip.id);
    } else {
      onActivate(clip.id);
    }
  };

  const handleToggleMute = (event: React.MouseEvent) => {
    event.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  return (
    <article className="group flex flex-col rounded-2xl border border-white/10 bg-[#120D0D] overflow-hidden">
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#080707]">
        <video
          ref={videoRef}
          src={clip.videoSrc}
          poster={posterSources.primaryWebpSrc}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          onEnded={() => onDeactivate(clip.id)}
          data-testid={`gallery-video-${clip.id}`}
          className="h-full w-full object-cover"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35"
        />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="font-mono-meta text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 bg-black/60 backdrop-blur-md border border-white/10 rounded-md px-2.5 py-1">
            {clip.tag}
          </span>
          <span className="font-mono-meta text-[11px] tabular-nums text-white/90 bg-black/60 backdrop-blur-md border border-white/10 rounded-md px-2 py-1">
            {clip.duration}
          </span>
        </div>

        {!isActive && (
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={`Reproduzir vídeo: ${clip.title}`}
            className="absolute inset-0 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-900 shadow-xl shadow-black/50 transition-transform duration-200 group-hover:scale-105">
              <Play size={20} className="ml-0.5" aria-hidden="true" />
            </span>
          </button>
        )}

        {isActive && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={`Pausar vídeo: ${clip.title}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <Pause size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleToggleMute}
              aria-label={
                isMuted
                  ? `Ativar som: ${clip.title}`
                  : `Silenciar: ${clip.title}`
              }
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              {isMuted ? (
                <VolumeX size={16} aria-hidden="true" />
              ) : (
                <Volume2 size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-editorial text-lg font-normal text-white leading-snug">
          {clip.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed">
          {clip.caption}
        </p>
      </div>
    </article>
  );
}

export function MinistryGallerySection() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section
      id="galeria"
      aria-label="Vídeos reais de cultos e ministrações"
      className="bg-[#0E0A0A] border-t border-white/10 py-20 sm:py-28 px-5 sm:px-8 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <p className="font-mono-meta text-xs font-medium uppercase tracking-[0.14em] text-[#E05A2B] mb-3">
              Vídeos · Cultos & Ministrações
            </p>
            <h2 className="font-editorial text-balance text-3xl sm:text-4xl leading-[1.12] tracking-[-0.02em] text-white font-normal mb-3">
              Trechos reais na igreja local.
            </h2>
            <p className="text-sm sm:text-base text-white/75 leading-relaxed">
              Momentos de pregação, Ceia do Senhor e adoração tratados com
              clareza de imagem e áudio — toque em qualquer vídeo para assistir
              com som.
            </p>
          </div>
          <span className="font-mono-meta text-[11px] uppercase tracking-[0.12em] text-white/65 self-start md:self-end">
            04 trechos em HD
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MINISTRY_VIDEO_CLIPS.map((clip) => (
            <VideoClipCard
              key={clip.id}
              clip={clip}
              isActive={activeVideoId === clip.id}
              onActivate={(id) => setActiveVideoId(id)}
              onDeactivate={(id) =>
                setActiveVideoId((cur) => (cur === id ? null : cur))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

