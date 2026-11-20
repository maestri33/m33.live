import React, { useEffect, useRef } from 'react';
import { Search, Home, TrendingUp, Paintbrush, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServicesProps {
  onOpenBooking: () => void;
}

const SERVICES_LIST = [
  {
    index: '01',
    title: 'Property Buying',
    subtitle: 'Off-Market Acquisition',
    description:
      'Access confidential pocket listings, sovereign islands, and architectural penthouses before public syndication with full structural and legal due diligence.',
    outcome: '14-Day Average Private Closing',
    Icon: Search,
  },
  {
    index: '02',
    title: 'Property Selling',
    subtitle: 'Discreet Divestiture',
    description:
      'Bespoke architectural cinematography, private jet buyer fly-ins, and direct placement with our vetted registry of global billionaires and family offices.',
    outcome: '98.4% List-to-Sale Realization',
    Icon: Home,
  },
  {
    index: '03',
    title: 'Capital Investment',
    subtitle: 'Trophy Asset Advisory',
    description:
      'Cross-border tax structuring, multi-jurisdictional trust acquisition, and high-yield luxury development syndication across Dubai, NYC, and Europe.',
    outcome: '$4.2B+ Assets Under Advisory',
    Icon: TrendingUp,
  },
  {
    index: '04',
    title: 'Architectural Design',
    subtitle: 'Bespoke Curation & Fit-Out',
    description:
      'Direct commissioning with Pritzker-winning architects, museum-grade art lighting curation, and turnkey Italian couture interior installations.',
    outcome: 'Turnkey Bespoke Delivery',
    Icon: Paintbrush,
  },
];

export default function Services({ onOpenBooking }: ServicesProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || grid.children.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(grid.children),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-28 md:py-36 bg-[#111111] border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-[#D4A95F] mb-3">
              04. PRIVATE OFFICE CAPABILITIES
            </div>
            <h2 className="font-display uppercase tracking-[0.1em] text-white text-5xl md:text-6xl leading-none">
              BESPOKE ADVISORY SERVICES
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#A0A0A0] max-w-md">
            Comprehensive acquisition, disposition, and architectural advisory
            tailored for ultra-high-net-worth collectors.
          </p>
        </div>

        {/* 4-Column Services Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {SERVICES_LIST.map(({ index, title, subtitle, description, outcome, Icon }) => (
            <div
              key={title}
              onClick={onOpenBooking}
              className="group relative p-8 glass overflow-hidden transition-all duration-500 border-t-2 border-t-transparent hover:border-t-[#D4A95F] flex flex-col justify-between min-h-[390px] cursor-pointer"
            >
              {/* Radial Gold Blur appearing behind card on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#D4A95F]/25 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-2xl tracking-[0.16em] text-[#A0A0A0] group-hover:text-[#D4A95F] transition-colors">
                    {index}.
                  </span>

                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#D4A95F] transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-[#D4A95F] transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-[11px] uppercase tracking-[0.22em] text-[#E7C98B] mb-1">
                  {subtitle}
                </div>

                <h3 className="font-display uppercase text-3xl tracking-[0.1em] text-white mb-4">
                  {title}
                </h3>

                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-8">
                  {description}
                </p>
              </div>

              <div className="relative z-10 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/80 font-medium tabular-nums">
                  {outcome}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#D4A95F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
