import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROPERTIES, type PropertyItem } from '../data/properties';

gsap.registerPlugin(ScrollTrigger);

interface PropertyShowcaseProps {
  onSelectProperty: (property: PropertyItem) => void;
}

export default function PropertyShowcase({
  onSelectProperty,
}: PropertyShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const showcaseItems = PROPERTIES.filter((p) => p.showcase);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        return Math.max(0, trackWidth - viewportWidth + 80);
      };

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative h-screen min-h-[700px] bg-[#050505] border-t border-white/10 overflow-hidden flex flex-col justify-center"
    >
      {/* Top Pinned Header Bar */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-[#D4A95F] mb-2">
            03. GLOBAL EXHIBITION ARCHIVE
          </div>
          <h2 className="font-display uppercase tracking-[0.1em] text-white text-4xl md:text-6xl leading-none">
            SIGNATURE ESTATES SHOWCASE
          </h2>
        </div>
        <div className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
          SCROLL TO TRAVERSE · CLICK RESIDENCE TO INSPECT
        </div>
      </div>

      {/* Horizontal Scrolling Flex Track */}
      <div className="w-full overflow-visible pl-6 md:pl-10">
        <div
          ref={trackRef}
          className="flex items-stretch gap-8 w-max pr-16 will-change-transform"
        >
          {showcaseItems.map((item, idx) => (
            <article
              key={item.id}
              onClick={() => onSelectProperty(item)}
              className="group relative w-[85vw] sm:w-[640px] lg:w-[820px] h-[440px] md:h-[520px] shrink-0 overflow-hidden bg-[#111111] border border-white/15 hover:border-[#D4A95F] transition-colors duration-500 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark Contrast Scrim */}
              <div
                aria-hidden="true"
                className="
                  absolute inset-0
                  bg-gradient-to-t from-[#050505] via-[#050505]/35 to-transparent
                "
              />

              {/* Top Metadata Bar */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <div className="glass px-4 py-2 text-xs uppercase tracking-[0.22em] text-white">
                  EDITION 0{idx + 1} · {item.city}
                </div>
                <div className="w-11 h-11 rounded-full glass flex items-center justify-center text-white group-hover:bg-[#D4A95F] group-hover:text-black transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Residence Summary */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[#E7C98B] mb-2">
                    {item.subtitle} · {item.architect}
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl tracking-[0.1em] text-white leading-none">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#A0A0A0] mt-3 tabular-nums">
                    <span>{item.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.sqft}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.beds} Bedrooms</span>
                  </div>
                </div>

                <div className="md:text-right shrink-0">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0] mb-1">
                    Private Offering
                  </div>
                  <div className="font-display text-3xl md:text-4xl tracking-[0.1em] text-[#D4A95F] tabular-nums">
                    {item.price}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
