import React, { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TESTIMONIALS } from '../data/properties';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
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
          duration: 0.9,
          stagger: 0.2,
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
      ref={sectionRef}
      className="py-28 md:py-36 bg-[#050505] border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-[#D4A95F] mb-3">
              05. CLIENT ENDORSEMENTS
            </div>
            <h2 className="font-display uppercase tracking-[0.1em] text-white text-5xl md:text-6xl leading-none">
              SOVEREIGN TESTIMONIALS
            </h2>
          </div>
          <div className="text-xs uppercase tracking-[0.22em] text-[#A0A0A0]">
            AUDITED FAMILY OFFICE & PRINCIPAL TRANSACTIONS
          </div>
        </div>

        {/* 2-Column Editorial Testimonials Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="relative p-10 md:p-12 bg-[#111111] border border-white/15 hover:border-[#D4A95F]/60 transition-colors duration-500 overflow-hidden flex flex-col justify-between"
            >
              {/* Large Gold Quotation Marks in Background */}
              <Quote
                aria-hidden="true"
                className="pointer-events-none absolute top-6 right-8 w-28 h-28 text-[#D4A95F]/10 stroke-[1]"
              />

              <div className="relative z-10">
                {/* 5 Gold Stars + Transaction Context */}
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-1.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#D4A95F] text-[#D4A95F]"
                      />
                    ))}
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#E7C98B] tabular-nums">
                    {item.transactionValue}
                  </span>
                </div>

                {/* Editorial Review Text */}
                <blockquote className="text-lg md:text-xl text-white/95 font-light leading-relaxed mb-10">
                  “{item.quote}”
                </blockquote>
              </div>

              {/* Client Avatar, Name, and Role */}
              <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.author}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border border-[#D4A95F]/60 shrink-0"
                />
                <div>
                  <div className="font-display text-2xl tracking-[0.1em] text-white">
                    {item.author}
                  </div>
                  <div className="text-xs text-[#A0A0A0] tracking-wide">
                    {item.role} · {item.organization}
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
