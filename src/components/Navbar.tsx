import React, { useEffect, useRef, useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenBooking: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Residences', href: '#properties' },
  { label: 'Architecture', href: '#about' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Advisory', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onOpenSearch, onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const magneticBtnRef = useRef<HTMLButtonElement | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(href, { offset: -80, duration: 1.4 });
    } else {
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = magneticBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.28,
      y: y * 0.28,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handleMagneticLeave = () => {
    const btn = magneticBtnRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/70 backdrop-blur-2xl border-b border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Logo ("L" inside gold circle + LUXONN wordmark) */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 group focus-visible:outline-none"
        >
          <span className="w-9 h-9 rounded-full border border-[#D4A95F] bg-[#D4A95F]/10 flex items-center justify-center text-[#D4A95F] font-display text-xl tracking-wider group-hover:bg-[#D4A95F] group-hover:text-black transition-colors duration-300">
            L
          </span>
          <span className="font-display text-2xl md:text-3xl tracking-[0.22em] text-white">
            LUXONN
          </span>
        </a>

        {/* Zone 2: Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative text-xs uppercase tracking-[0.2em] text-[#A0A0A0] hover:text-white transition-colors duration-200 whitespace-nowrap shrink-0 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4A95F] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Search & Magnetic Book Viewing CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search Portfolio"
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:border-[#D4A95F] hover:text-[#D4A95F] text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            ref={magneticBtnRef}
            type="button"
            onClick={onOpenBooking}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium text-black bg-[#D4A95F] hover:bg-[#E7C98B] transition-colors duration-200 whitespace-nowrap shrink-0 shadow-[0_0_25px_rgba(212,169,95,0.35)] cursor-pointer"
          >
            Book Viewing
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="lg:hidden w-10 h-10 rounded-full border border-white/15 bg-white/5 text-white flex items-center justify-center hover:border-[#D4A95F] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-white/15 mt-4 px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm uppercase tracking-[0.2em] text-white/80 hover:text-[#D4A95F] py-2 border-b border-white/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="mt-2 w-full py-3 text-xs uppercase tracking-[0.2em] font-medium text-black bg-[#D4A95F] hover:bg-[#E7C98B] transition-colors"
          >
            Book Viewing
          </button>
        </div>
      )}
    </header>
  );
}
