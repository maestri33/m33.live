import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROPERTIES, type PropertyItem } from '../data/properties';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedPropertiesProps {
  onSelectProperty: (property: PropertyItem) => void;
}

const CITY_FILTERS = ['All', 'Dubai', 'New York', 'Miami'] as const;

export default function FeaturedProperties({
  onSelectProperty,
}: FeaturedPropertiesProps) {
  const [activeCity, setActiveCity] = useState<(typeof CITY_FILTERS)[number]>('All');
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  const featuredList = PROPERTIES.filter((p) =>
    activeCity === 'All' ? p.featured : p.city === activeCity
  );

  useEffect(() => {
    const container = cardsContainerRef.current;
    if (!container || container.children.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(container.children),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCity]);

  return (
    <section
      id="properties"
      ref={sectionRef}
      className="py-28 md:py-36 bg-[#050505] border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-[#D4A95F] mb-3">
              01. CURATED TROPHY PORTFOLIO
            </div>
            <h2 className="font-display uppercase tracking-[0.1em] text-white text-5xl md:text-6xl leading-none">
              FEATURED RESIDENCES
            </h2>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-2 p-1.5 bg-[#111111] border border-white/10 self-start md:self-auto">
            {CITY_FILTERS.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setActiveCity(city)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCity === city
                    ? 'bg-[#D4A95F] text-black font-semibold'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Grid (Dubai, New York, Miami) */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredList.map((property, index) => (
            <article
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="group relative h-[540px] overflow-hidden bg-[#111111] border border-white/15 hover:border-[#D4A95F] hover:shadow-[0_0_40px_rgba(212,169,95,0.28)] transition-all duration-500 cursor-pointer"
            >
              {/* Property Background Image with scale-up on hover */}
              <img
                src={property.image}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Dark Measured Gradient Overlay */}
              <div
                aria-hidden="true"
                className="
                  absolute inset-0
                  bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent
                  opacity-90 group-hover:opacity-95 transition-opacity duration-500
                "
              />

              {/* Top Editorial Index & Location */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs tracking-[0.22em] uppercase text-white/80">
                <span>
                  0{index + 1} · {property.city}
                </span>
                <span className="w-9 h-9 rounded-full glass flex items-center justify-center text-white group-hover:bg-[#D4A95F] group-hover:text-black group-hover:border-[#D4A95F] transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Sliding Info Box at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-7 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="text-xs uppercase tracking-[0.2em] text-[#E7C98B] mb-1">
                  {property.location}
                </div>

                <h3 className="font-display text-3xl tracking-[0.1em] text-white mb-2">
                  {property.title}
                </h3>

                <div className="font-display text-2xl tracking-[0.1em] text-[#D4A95F] tabular-nums mb-4">
                  {property.price}
                </div>

                {/* Unboxed Metadata with clean typographic separators */}
                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-[#A0A0A0] tabular-nums opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2">
                    <span>{property.beds} Beds</span>
                    <span aria-hidden="true">·</span>
                    <span>{property.baths} Baths</span>
                    <span aria-hidden="true">·</span>
                    <span>{property.sqft}</span>
                  </div>
                  <span className="text-[#E7C98B] uppercase tracking-[0.15em] font-medium">
                    Inspect
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
