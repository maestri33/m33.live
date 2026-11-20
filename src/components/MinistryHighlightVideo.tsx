import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Upload, Volume2, VolumeX } from 'lucide-react';
import {
  HIGHLIGHT_CLIP_SECONDS,
  computeHighlightProgress,
  formatSeconds,
  shouldLoopHighlightClip,
} from '../utils/heroMath';

interface MinistryHighlightVideoProps {
  defaultSrc: string;
  posterSrc: string;
  onInviteClick: () => void;
}

export function MinistryHighlightVideo({
  defaultSrc,
  posterSrc,
  onInviteClick,
}: MinistryHighlightVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [videoSrc, setVideoSrc] = useState(defaultSrc);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [clipDuration, setClipDuration] = useState(HIGHLIGHT_CLIP_SECONDS);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    video.muted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        setIsPlaying(false);
      });
    }
  }, [videoSrc]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldLoopHighlightClip(video.currentTime, HIGHLIGHT_CLIP_SECONDS)) {
      video.currentTime = 0;
      setCurrentTime(0);
      if (video.paused && isPlaying) {
        video.play().catch(() => {});
      }
      return;
    }

    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    const effective = Math.min(
      HIGHLIGHT_CLIP_SECONDS,
      Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : HIGHLIGHT_CLIP_SECONDS
    );
    setClipDuration(effective);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleCustomVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setVideoSrc(nextUrl);
    setCustomFileName(file.name);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const progressPct = computeHighlightProgress(
    currentTime,
    clipDuration,
    HIGHLIGHT_CLIP_SECONDS
  );

  return (
    <section
      id="destaque-video"
      aria-label="Trecho de ministração em destaque"
      className="relative bg-[#0B0909] border-t border-white/10 pt-24 sm:pt-28 pb-16 sm:pb-24 scroll-mt-10 px-5 sm:px-8 md:px-12 overflow-hidden"
    >
      {/* Subtle atmospheric glow behind the frosted glass video frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[720px] rounded-full bg-[#7A1C12]/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <p className="font-mono-meta text-xs font-medium uppercase tracking-[0.14em] text-[#E05A2B] mb-3">
              Ministração em Destaque · 00:30 Loop
            </p>
            <h2 className="font-editorial text-balance text-3xl sm:text-4xl leading-[1.12] tracking-[-0.02em] text-white font-normal">
              Um pouco da Palavra compartilhada ao vivo.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleCustomVideoChange}
              aria-label="Carregar vídeo de ministração local"
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md px-4 text-xs font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Upload size={14} aria-hidden="true" />
              <span>{customFileName ? 'Trocar vídeo (.mp4)' : 'Testar seu vídeo (.mp4)'}</span>
            </button>
          </div>
        </div>

        {/* Frosted glass backdrop-blur aspect-video showcase container */}
        <div className="rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/12 p-2 sm:p-3 shadow-2xl shadow-black/60">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#080707]">
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              data-testid="ministry-highlight-video"
              className="h-full w-full object-cover"
            />

            {/* Measured bottom legibility scrim (desktop overlay only) */}
            <div
              aria-hidden="true"
              className="pointer-events-none hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
            />

            {/* Subtle filename label only when previewing a custom local .mp4 */}
            {customFileName && (
              <div className="pointer-events-none absolute top-3 left-3 sm:top-6 sm:left-6 rounded-lg bg-black/55 backdrop-blur-md border border-white/10 px-3 py-1">
                <span className="font-mono-meta text-[11px] tracking-[0.08em] text-white/90">
                  Prévia · {customFileName}
                </span>
              </div>
            )}

            {/* Desktop bottom glass overlay with quote + interactive video controls */}
            <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-6 md:p-8 flex-col gap-4">
              <div className="max-w-xl">
                <p className="font-editorial italic text-xl md:text-2xl leading-snug text-white drop-shadow">
                  “Você não para de pecar para ir pro céu — você para de pecar porque foi salvo por Jesus e recebeu uma nova natureza.”
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/12 px-4 py-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar trecho em vídeo' : 'Reproduzir trecho em vídeo'}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Ativar som do vídeo' : 'Silenciar vídeo'}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>

                <div className="flex-1 min-w-[140px] flex items-center gap-3 px-1">
                  <div className="relative h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[#E05A2B] transition-all duration-200"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="font-mono-meta text-xs text-white/80 tabular-nums whitespace-nowrap">
                    {formatSeconds(currentTime)} / {formatSeconds(clipDuration)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onInviteClick}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white/12 hover:bg-white hover:text-gray-900 text-white text-xs font-semibold px-5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Convidar para sua Igreja
                </button>
              </div>
            </div>
          </div>

          {/* Mobile frosted footer below aspect-video so the speaker's face stays unobstructed */}
          <div className="sm:hidden pt-4 px-2 pb-2 flex flex-col gap-3.5">
            <p className="font-editorial italic text-base leading-snug text-white/95">
              “Você não para de pecar para ir pro céu — você para de pecar porque foi salvo por Jesus e recebeu uma nova natureza.”
            </p>
            <div className="flex items-center justify-between gap-2.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 px-2.5 py-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pausar trecho em vídeo' : 'Reproduzir trecho em vídeo'}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Ativar som do vídeo' : 'Silenciar vídeo'}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              <div className="flex-1 flex items-center gap-2.5 min-w-0 pr-1">
                <div className="relative h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[#E05A2B] transition-all duration-200"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="font-mono-meta text-[11px] text-white/80 tabular-nums whitespace-nowrap">
                  {formatSeconds(currentTime)} / {formatSeconds(clipDuration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
