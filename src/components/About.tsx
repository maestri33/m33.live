import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ABOUT_IMAGE } from '../data/properties';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  onOpenBooking: () => void;
}

const STATS = [
  { value: '25+', label: 'Years of Provenance', detail: 'Since 2001 Globally' },
  { value: '$4B+', label: 'Trophy Volume Sold', detail: 'Audited Private Placements' },
  { value: '12', label: 'Global Flagships', detail: 'Dubai · NYC · Miami · Geneva' },
];

export default function About({ onOpenBooking }: AboutProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const imgTarget = imageRef.current;
    const sectionTarget = sectionRef.current;
    const contentTarget = contentRef.current;

    if (!sectionTarget) return;

    const ctx = gsap.context(() => {
      // Null-checked Y-axis parallax scrub on architectural image
      if (imgTarget) {
        gsap.fromTo(
          imgTarget,
          { yPercent: -10, scale: 1.12 },
          {
            yPercent: 10,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionTarget,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      if (contentTarget) {
        gsap.fromTo(
          contentTarget.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentTarget,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-28 md:py-36 bg-[#111111] border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Left Column: Parallax Architectural Image */}
          <div className="lg:col-span-6 relative min-h-[520px] lg:min-h-[680px] overflow-hidden border border-white/15 bg-[#1A1A1A]">
            <img
              ref={imageRef}
              src={ABOUT_IMAGE}
              alt="Cantilevered Architectural Masterpiece at Golden Hour"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center will-change-transform"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent"
            />
            <div className="absolute bottom-6 left-6 right-6 glass p-5 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#E7C98B]">
                  ARCHITECTURAL MONOGRAPH NO. 04
                </div>
                <div className="font-display text-xl tracking-[0.12em] text-white mt-0.5">
                  AURELIA RIDGE CANTILEVER · OLSON KUNDIG
                </div>
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-[#D4A95F] tabular-nums">
                2026
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Philosophy & 3 Stat Counters */}
          <div
            ref={contentRef}
            className="lg:col-span-6 flex flex-col justify-between py-2"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-[#D4A95F] mb-4">
                02. PHILOSOPHY & PROVENANCE
              </div>

              <h2 className="font-display uppercase tracking-[0.09em] text-white text-5xl md:text-6xl leading-[0.95] mb-8">
                ARCHITECTURAL MASTERPIECES
              </h2>

              <p className="text-base md:text-lg text-white/90 leading-relaxed font-light mb-6">
                At LUXONN, we do not merely broker square footage—we steward
                living works of structural sculpture. Every residence in our
                collection is vetted for site-specific engineering, Pritzker-level
                pedigree, and enduring generational value.
              </p>

              <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed mb-10">
                From cantilevered travertine sanctuaries over the Arabian Gulf to
                triple-height glass penthouses crowning Manhattan’s 57th Street,
                our private advisory team connects sovereign collectors with the
                world’s rarest residential architecture—often before a property
                ever reaches the public record.
              </p>
            </div>

            {/* 3 Quantitative Stat Counters */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-white/15 mb-10">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="font-display text-5xl md:text-6xl tracking-[0.08em] text-[#D4A95F] tabular-nums leading-none mb-2">
                      {stat.value}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-white font-medium mb-1">
                      {stat.label}
                    </span>
                    <span className="text-xs text-[#A0A0A0]">
                      {stat.detail}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="px-8 py-4 bg-[#D4A95F] hover:bg-[#E7C98B] text-black text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 flex items-center gap-3 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Consult Private Advisory</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-[#A0A0A0] tracking-[0.15em] uppercase">
                  DIRECT PRINCIPAL ACCESS · STRICT NDA PROTOCOL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
