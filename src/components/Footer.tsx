import React from 'react';
import { useLenis } from 'lenis/react';
import { PROPERTIES, type PropertyItem } from '../data/properties';

interface FooterProps {
  onSelectProperty: (property: PropertyItem) => void;
  onOpenBooking: () => void;
}

export default function Footer({
  onSelectProperty,
  onOpenBooking,
}: FooterProps) {
  const lenis = useLenis();

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(href, { offset: -80, duration: 1.4 });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-white/15 pt-20 pb-12 text-[#A0A0A0]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* 4-Column Layout: Brand, Properties, Company, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Column 1: Brand */}
          <div className="space-y-5">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, '#home')}
              className="flex items-center gap-3 whitespace-nowrap shrink-0"
            >
              <span className="w-9 h-9 rounded-full border border-[#D4A95F] bg-[#D4A95F]/10 flex items-center justify-center text-[#D4A95F] font-display text-xl">
                L
              </span>
              <span className="font-display text-3xl tracking-[0.22em] text-white">
                LUXONN
              </span>
            </a>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              Curating architectural trophy residences, private islands, and
              sky-penthouses for sovereign collectors worldwide.
            </p>
            <div className="text-xs uppercase tracking-[0.2em] text-[#E7C98B]">
              DUBAI · NEW YORK · MIAMI · LAKE COMO
            </div>
          </div>

          {/* Column 2: Properties */}
          <div>
            <h4 className="font-display text-xl tracking-[0.16em] text-white uppercase mb-5">
              Trophy Portfolio
            </h4>
            <ul className="space-y-3 text-sm">
              {PROPERTIES.map((prop) => (
                <li key={prop.id}>
                  <button
                    type="button"
                    onClick={() => onSelectProperty(prop)}
                    className="text-left text-[#A0A0A0] hover:text-[#D4A95F] transition-colors cursor-pointer"
                  >
                    {prop.title} · {prop.city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-display text-xl tracking-[0.16em] text-white uppercase mb-5">
              Private Office
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#about"
                  onClick={(e) => scrollToSection(e, '#about')}
                  className="hover:text-[#D4A95F] transition-colors"
                >
                  Architectural Monograph
                </a>
              </li>
              <li>
                <a
                  href="#showcase"
                  onClick={(e) => scrollToSection(e, '#showcase')}
                  className="hover:text-[#D4A95F] transition-colors"
                >
                  Global Exhibition Showcase
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => scrollToSection(e, '#services')}
                  className="hover:text-[#D4A95F] transition-colors"
                >
                  Acquisition & Advisory
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="text-left hover:text-[#D4A95F] transition-colors cursor-pointer"
                >
                  Schedule Private Aviation Viewing
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-display text-xl tracking-[0.16em] text-white uppercase mb-5">
              Global Concierge
            </h4>
            <div className="space-y-3 text-sm">
              <p className="text-white">730 Fifth Avenue, Crown Suite, NYC</p>
              <p className="text-white">ICD Brookfield Place, Level 44, Dubai</p>
              <p className="tabular-nums text-[#E7C98B]">+1 (212) 940-8800</p>
              <p>concierge@luxonn.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A0A0A0]">
          <div>
            © {new Date().getFullYear()} LUXONN ARCHITECTURAL REALTY. ALL RIGHTS
            RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>PRIVACY PROTOCOL</span>
            <span aria-hidden="true">·</span>
            <span>FAMILY OFFICE DISCLOSURES</span>
            <span aria-hidden="true">·</span>
            <span>FAIR HOUSING NOTICE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
