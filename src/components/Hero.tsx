import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Compass, DollarSign, Maximize2 } from 'lucide-react';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';
import {
  HERO_POSTER_URL,
  HERO_VIDEO_URL,
  PROPERTIES,
  type PropertyItem,
} from '../data/properties';

interface HeroProps {
  onSelectProperty: (property: PropertyItem) => void;
  onOpenBooking: (propertyId?: string) => void;
}

export default function Hero({ onSelectProperty, onOpenBooking }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement | null>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);
  const floatingCardsRef = useRef<HTMLDivElement | null>(null);
  const replayTimeoutRef = useRef<number | null>(null);
  const lenis = useLenis();

  const heroProperty = PROPERTIES[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (headlineLine1Ref.current && headlineLine2Ref.current) {
        tl.fromTo(
          [headlineLine1Ref.current, headlineLine2Ref.current],
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.14 },
          0.25
        );
      }

      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          '-=0.65'
        );
      }

      if (ctaGroupRef.current) {
        tl.fromTo(
          ctaGroupRef.current.children,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
          '-=0.55'
        );
      }

      if (floatingCardsRef.current) {
        tl.fromTo(
          floatingCardsRef.current.children,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.9, stagger: 0.15 },
          '-=0.65'
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (replayTimeoutRef.current) {
        window.clearTimeout(replayTimeoutRef.current);
      }
    };
  }, []);

  const handleVideoEnded = () => {
    if (replayTimeoutRef.current) {
      window.clearTimeout(replayTimeoutRef.current);
    }
    replayTimeoutRef.current = window.setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay fallback handled silently
        });
      }
    }, 5000);
  };

  const scrollToProperties = () => {
    if (lenis) {
      lenis.scrollTo('#properties', { offset: -80, duration: 1.4 });
    } else {
      document.querySelector('#properties')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[720px] overflow-hidden flex items-end pb-16 md:pb-24 bg-[#050505]"
    >
      {/* Background Video with Poster Fallback & 5-second pause before restart */}
      <video
        ref={videoRef}
        src={HERO_VIDEO_URL}
        poster={HERO_POSTER_URL}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
      />

      {/* Subtle directional gradients on left and bottom; center/right stay transparent */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent
        "
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent
        "
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        {/* Left Editorial Hero Column */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#E7C98B] mb-5">
            <span>PRIVATE ARCHITECTURAL PORTFOLIO</span>
            <span aria-hidden="true">·</span>
            <span>DUBAI / NEW YORK / MIAMI</span>
          </div>

          <h1 className="font-display uppercase tracking-[0.08em] leading-[0.9] text-white text-[clamp(3.75rem,8.5vw,7.75rem)] mb-6">
            <span className="block overflow-hidden">
              <span ref={headlineLine1Ref} className="block">
                LUXURY
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                ref={headlineLine2Ref}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E7C98B] to-[#D4A95F]"
              >
                REDEFINED
              </span>
            </span>
          </h1>

          <p
            ref={subtextRef}
            className="text-base md:text-lg text-[#A0A0A0] max-w-xl leading-relaxed font-light mb-10"
          >
            Curating monumental cliffside sanctuaries, sky-penthouses, and
            private waterfront compounds engineered by the world’s foremost
            architectural visionaries.
          </p>

          {/* CTA Buttons with glowing gold drop-shadows and intensifying white borders */}
          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center gap-5"
          >
            <button
              type="button"
              onClick={scrollToProperties}
              className="px-8 py-4 bg-[#D4A95F] hover:bg-[#E7C98B] text-black text-xs uppercase tracking-[0.22em] font-semibold border border-white/30 hover:border-white shadow-[0_0_35px_rgba(212,169,95,0.45)] hover:shadow-[0_0_50px_rgba(212,169,95,0.75)] transition-all duration-300 flex items-center gap-3 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Explore Residences</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenBooking(heroProperty.id)}
              className="px-8 py-4 glass text-white hover:text-[#E7C98B] text-xs uppercase tracking-[0.22em] font-medium border border-white/30 hover:border-white shadow-[0_0_25px_rgba(212,169,95,0.18)] hover:shadow-[0_0_40px_rgba(212,169,95,0.4)] transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Schedule Private Viewing
            </button>
          </div>
        </div>

        {/* Desktop-Only Floating Glass Cards on Right Side (Location, Price, Sq Ft) */}
        <div
          ref={floatingCardsRef}
          className="hidden lg:flex flex-col gap-4 w-[340px] shrink-0"
        >
          {/* Card 1: Location */}
          <button
            type="button"
            onClick={() => onSelectProperty(heroProperty)}
            className="glass p-5 text-left group hover:border-[#D4A95F]/70 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#A0A0A0]">
                Featured Location
              </span>
              <Compass className="w-4 h-4 text-[#D4A95F] group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="font-display text-2xl tracking-[0.12em] text-white group-hover:text-[#E7C98B] transition-colors">
              {heroProperty.location}
            </div>
            <div className="text-xs text-[#A0A0A0] mt-1 tabular-nums">
              {heroProperty.coordinates} · {heroProperty.title}
            </div>
          </button>

          {/* Card 2: Price Valuation */}
          <button
            type="button"
            onClick={() => onSelectProperty(heroProperty)}
            className="glass p-5 text-left group hover:border-[#D4A95F]/70 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#A0A95F] text-[#A0A0A0]">
                Offering Valuation
              </span>
              <DollarSign className="w-4 h-4 text-[#D4A95F]" />
            </div>
            <div className="font-display text-3xl tracking-[0.12em] text-[#D4A95F] tabular-nums">
              {heroProperty.price}
            </div>
            <div className="text-xs text-[#A0A0A0] mt-1">
              Turnkey Furnished · Private Berth Included
            </div>
          </button>

          {/* Card 3: Architectural Scale / Sq Ft */}
          <button
            type="button"
            onClick={() => onSelectProperty(heroProperty)}
            className="glass p-5 text-left group hover:border-[#D4A95F]/70 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#A0A0A0]">
                Interior Footprint
              </span>
              <Maximize2 className="w-4 h-4 text-[#D4A95F] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="font-display text-2xl tracking-[0.12em] text-white tabular-nums">
              {heroProperty.sqft}
            </div>
            <div className="text-xs text-[#A0A0A0] mt-1 tabular-nums">
              {heroProperty.beds} Bedrooms · {heroProperty.baths} Baths ·{' '}
              {heroProperty.lotSize}
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
