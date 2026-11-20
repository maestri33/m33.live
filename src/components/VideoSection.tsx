import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VIDEO_SECTION_IMAGE } from '../data/properties';

gsap.registerPlugin(ScrollTrigger);

interface VideoSectionProps {
  onOpenVideo: () => void;
}

export default function VideoSection({ onOpenVideo }: VideoSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const playBtnRef = useRef<HTMLButtonElement | null>(null);
  const pulseRingRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const playBtn = playBtnRef.current;
    const pulseRing = pulseRingRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      // Continuous GSAP pulse animation (yoyo) on play button
      if (playBtn) {
        gsap.to(playBtn, {
          scale: 1.1,
          duration: 1.25,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (pulseRing) {
        gsap.fromTo(
          pulseRing,
          { scale: 1, opacity: 0.65 },
          {
            scale: 1.55,
            opacity: 0,
            duration: 1.8,
            repeat: -1,
            ease: 'power2.out',
          }
        );
      }

      // Image wrapper slightly scales down and rounds corners using GSAP scrub on scroll
      if (wrapper) {
        gsap.fromTo(
          wrapper,
          { scale: 1, borderRadius: '0px' },
          {
            scale: 0.92,
            borderRadius: '32px',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              end: 'bottom 25%',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[90vh] min-h-[600px] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <div
        ref={wrapperRef}
        onClick={onOpenVideo}
        className="relative w-full h-full overflow-hidden border border-white/15 cursor-pointer group will-change-transform"
      >
        {/* Background Property Image */}
        <img
          src={VIDEO_SECTION_IMAGE}
          alt="LUXONN Architectural Film Showcase"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />

        {/* Dark Backdrop-Blur Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/55 backdrop-blur-[3px] group-hover:bg-black/45 transition-colors duration-500"
        />

        {/* Centered Play Button & Film Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="text-xs uppercase tracking-[0.32em] text-[#E7C98B] mb-6">
            ARCHITECTURAL SHORT FILM · 04:18
          </div>

          {/* Massive Pulsing Play Button */}
          <div className="relative flex items-center justify-center mb-8">
            <span
              ref={pulseRingRef}
              aria-hidden="true"
              className="pointer-events-none absolute w-28 h-28 md:w-32 md:h-32 rounded-full border border-[#D4A95F]"
            />
            <button
              ref={playBtnRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenVideo();
              }}
              aria-label="Play Fullscreen Architectural Film"
              className="relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#D4A95F] hover:bg-[#E7C98B] text-black flex items-center justify-center shadow-[0_0_60px_rgba(212,169,95,0.65)] transition-colors duration-300 cursor-pointer"
            >
              <Play className="w-10 h-10 fill-black text-black ml-1" />
            </button>
          </div>

          <h2 className="font-display uppercase tracking-[0.12em] text-white text-5xl md:text-7xl leading-none mb-3">
            EXPERIENCE THE UNSEEN
          </h2>
          <p className="text-sm md:text-base text-white/80 max-w-lg font-light">
            Step inside our private cliffside sanctuaries and sky-penthouses in
            4K cinema resolution.
          </p>
        </div>
      </div>
    </section>
  );
}
