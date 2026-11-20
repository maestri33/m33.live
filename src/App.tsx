import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Instagram,
  Menu,
  X,
} from 'lucide-react';
import { ActionModal, type ModalMode } from './components/ActionModal';
import { GraceScripturesSection } from './components/GraceScripturesSection';
import { MessageOutlinePanel } from './components/MessageOutlinePanel';
import { MinistryGallerySection } from './components/MinistryGallerySection';
import { MinistryHighlightVideo } from './components/MinistryHighlightVideo';
import { OptimizedPicture } from './components/OptimizedPicture';
import { EditorialPhotoCard, PhotoLightbox } from './components/PhotoLightbox';
import {
  MINISTRY_MESSAGES,
  WHATSAPP_DISPLAY,
  buildComputedArcs,
  buildWhatsAppUrl,
  computeActiveNavSection,
  computeGridParallaxTarget,
  filterMinistryMessages,
  getMinistryPhotoById,
  getNextTabIndex,
  lerp,
} from './utils/heroMath';
import { syncRuntimeSeoMetadata } from './utils/seoMetadata';

const BG_IMAGE_STUDIO = '/assets/optimized/portrait-studio-1920w.webp';
const HIGHLIGHT_VIDEO_SRC = '/assets/ministry-highlight.mp4';
const HIGHLIGHT_POSTER_SRC = '/assets/optimized/poster-highlight-1280w.webp';
const INSTAGRAM_URL = 'https://www.instagram.com/maestri.oficial/';

const NAV_ITEMS = [
  { id: 'inicio', label: 'Início' },
  { id: 'ministerio', label: 'Sobre' },
  { id: 'galeria', label: 'Vídeos' },
  { id: 'mensagens', label: 'Mensagens' },
  { id: 'escrituras', label: 'Escrituras' },
  { id: 'agenda', label: 'Convites' },
] as const;

const MESSAGE_CATEGORIES = [
  'Todas',
  'Graça & Cruz',
  'Justiça pela Fé',
  'Vida em Cristo',
] as const;

const MINISTRY_PILLARS = [
  {
    number: '01.',
    title: 'A Obra Consumada na Cruz',
    description:
      'Ensino simples e bíblico centrado na suficiência de Jesus: nada precisa ser acrescentado pelo esforço humano ao que Ele já declarou consumado.',
  },
  {
    number: '02.',
    title: 'Justiça pela Fé, não por Mérito',
    description:
      'Compartilhando alívio contra a culpa crônica e o legalismo, lembrando que a justiça de Deus é um presente gratuito recebido pela fé em Cristo.',
  },
  {
    number: '03.',
    title: 'Descanso na Graça e Filiação',
    description:
      'Caminhando lado a lado com a igreja local para trocar o peso da performance pela liberdade de filhos amados que vivem pela graça.',
  },
] as const;

const SERVING_FORMATS = [
  {
    tag: '01 · CULTOS',
    title: 'Cultos na Igreja Local',
    description:
      'Domingo, meio de semana ou cultos especiais — chegando de leve para servir o pastor e edificar a igreja na graça de Jesus.',
    whatsappTopic: 'um culto na nossa igreja',
  },
  {
    tag: '02 · CÉLULAS & ESTUDOS',
    title: 'Células e Estudos Bíblicos',
    description:
      'Encontros menores, mesa aberta e leitura das cartas de Paulo e Hebreus de forma simples, próxima e sem formalidade.',
    whatsappTopic: 'uma célula ou estudo bíblico',
  },
  {
    tag: '03 · JOVENS & ENCONTROS',
    title: 'Jovens, Retiros e Cafés',
    description:
      'Conversas francas sobre identidade em Cristo, liberdade da condenação e como viver o Evangelho da Graça no dia a dia.',
    whatsappTopic: 'um encontro de jovens ou retiro',
  },
] as const;

function BrandLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M6.5 28.5V9.5L18 20.5L29.5 9.5V28.5"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 5.5V28.5M14.2 10.5H21.8"
        stroke="#E05A2B"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .14 5.35.14 11.92c0 2.1.55 4.15 1.59 5.96L0 24l6.3-1.65a11.88 11.88 0 0 0 5.76 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.47-8.42ZM12.06 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.87 9.87 0 0 1-1.52-5.25c0-5.46 4.44-9.9 9.91-9.9 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.47-4.44 9.88-9.9 9.88Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

const DEFAULT_WHATSAPP_URL = buildWhatsAppUrl(
  'Olá Maestri! Paz! Gostaria de conversar sobre um convite para ministrar na nossa igreja.'
);

export default function App() {
  const [activeNav, setActiveNav] = useState<string>('inicio');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [prefilledTopic, setPrefilledTopic] = useState<string | null>(null);
  const [lightboxPhotoId, setLightboxPhotoId] = useState<string | null>(null);

  const stageLivePhoto = useMemo(() => getMinistryPhotoById('stage-live'), []);
  const youthPhoto = useMemo(() => getMinistryPhotoById('youth-pulpit'), []);
  const beigePulpitPhoto = useMemo(() => getMinistryPhotoById('beige-pulpit'), []);
  const blazerPreachPhoto = useMemo(() => getMinistryPhotoById('blazer-preach'), []);
  const babyDedicationPhoto = useMemo(() => getMinistryPhotoById('baby-dedication'), []);

  const heroSectionRef = useRef<HTMLElement | null>(null);
  const revealLayerRef = useRef<HTMLDivElement | null>(null);
  const gridPatternRef = useRef<SVGPatternElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const navScrollLockUntilRef = useRef<number>(0);

  const activeNavItem = useMemo(
    () => NAV_ITEMS.find((item) => item.id === activeNav) ?? NAV_ITEMS[0],
    [activeNav]
  );

  const computedArcs = useMemo(() => buildComputedArcs(), []);
  const visibleMessages = useMemo(
    () => filterMinistryMessages(MINISTRY_MESSAGES, selectedCategory),
    [selectedCategory]
  );

  // Synchronize canonical, OpenGraph, Twitter Card, and Person JSON-LD URLs with active origin
  useEffect(() => {
    syncRuntimeSeoMetadata();
  }, []);

  // Lock body scroll & handle Escape when mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Real-time deterministic Scroll Spy (handles short, tall, and bottom sections accurately)
  useEffect(() => {
    const observedSections: Array<{ id: string; navId: string }> = [
      { id: 'inicio', navId: 'inicio' },
      { id: 'destaque-video', navId: 'inicio' },
      { id: 'ministerio', navId: 'ministerio' },
      { id: 'galeria', navId: 'galeria' },
      { id: 'mensagens', navId: 'mensagens' },
      { id: 'escrituras', navId: 'escrituras' },
      { id: 'agenda', navId: 'agenda' },
      { id: 'contato', navId: 'agenda' },
    ];

    let rafId = 0;

    const updateActiveSection = () => {
      rafId = 0;
      if (Date.now() < navScrollLockUntilRef.current) return;

      const metrics = observedSections
        .map((entry) => {
          const el = document.getElementById(entry.id);
          if (!el) return null;
          return {
            navId: entry.navId,
            top: el.getBoundingClientRect().top + window.scrollY,
          };
        })
        .filter((item): item is { navId: string; top: number } => item !== null);

      if (metrics.length === 0) return;

      const nextNav = computeActiveNavSection(
        metrics,
        window.scrollY,
        window.innerHeight,
        document.documentElement.scrollHeight
      );

      setActiveNav((prev) => (prev === nextNav ? prev : nextNav));
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Single on-demand rAF loop for GPU CSS variable spotlight mask + SVG grid parallax
  useEffect(() => {
    const revealLayer = revealLayerRef.current;
    const gridPattern = gridPatternRef.current;
    if (!revealLayer) return;

    const targetCursor = { x: -999, y: -999 };
    const smoothCursor = { x: -999, y: -999 };
    const gridTarget = { x: 0, y: 0 };
    const gridCurrent = { x: 0, y: 0 };

    let lastCursorX = -999;
    let lastCursorY = -999;
    let lastGridX = NaN;
    let lastGridY = NaN;
    let animationFrameId = 0;
    let isRunning = false;

    const tick = () => {
      smoothCursor.x = lerp(smoothCursor.x, targetCursor.x, 0.1);
      smoothCursor.y = lerp(smoothCursor.y, targetCursor.y, 0.1);

      const cursorRemaining =
        Math.abs(targetCursor.x - smoothCursor.x) + Math.abs(targetCursor.y - smoothCursor.y);
      if (cursorRemaining < 0.4) {
        smoothCursor.x = targetCursor.x;
        smoothCursor.y = targetCursor.y;
      }

      if (
        Math.abs(smoothCursor.x - lastCursorX) > 0.1 ||
        Math.abs(smoothCursor.y - lastCursorY) > 0.1
      ) {
        revealLayer.style.setProperty('--cursor-x', `${smoothCursor.x.toFixed(1)}px`);
        revealLayer.style.setProperty('--cursor-y', `${smoothCursor.y.toFixed(1)}px`);
        lastCursorX = smoothCursor.x;
        lastCursorY = smoothCursor.y;
      }

      gridCurrent.x = lerp(gridCurrent.x, gridTarget.x, 0.06);
      gridCurrent.y = lerp(gridCurrent.y, gridTarget.y, 0.06);

      const gridRemaining =
        Math.abs(gridTarget.x - gridCurrent.x) + Math.abs(gridTarget.y - gridCurrent.y);
      if (gridRemaining < 0.04) {
        gridCurrent.x = gridTarget.x;
        gridCurrent.y = gridTarget.y;
      }

      if (
        gridPattern &&
        (Math.abs(gridCurrent.x - lastGridX) > 0.01 ||
          Math.abs(gridCurrent.y - lastGridY) > 0.01)
      ) {
        gridPattern.setAttribute('x', gridCurrent.x.toFixed(2));
        gridPattern.setAttribute('y', gridCurrent.y.toFixed(2));
        lastGridX = gridCurrent.x;
        lastGridY = gridCurrent.y;
      }

      if (cursorRemaining >= 0.4 || gridRemaining >= 0.04) {
        animationFrameId = window.requestAnimationFrame(tick);
      } else {
        isRunning = false;
        animationFrameId = 0;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    let hasEntered = false;

    const handlePointerMove = (event: PointerEvent) => {
      const heroRect = heroSectionRef.current?.getBoundingClientRect();
      const nextX = heroRect ? event.clientX - heroRect.left : event.clientX;
      const nextY = heroRect ? event.clientY - heroRect.top : event.clientY;

      targetCursor.x = nextX;
      targetCursor.y = nextY;

      if (!hasEntered) {
        hasEntered = true;
        smoothCursor.x = nextX;
        smoothCursor.y = nextY;
      }

      gridTarget.x = computeGridParallaxTarget(event.clientX, window.innerWidth, 16);
      gridTarget.y = computeGridParallaxTarget(event.clientY, window.innerHeight, 16);
      startLoop();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleNavSelect = (sectionId: string) => {
    navScrollLockUntilRef.current = Date.now() + 750;
    setActiveNav(sectionId);
    setMobileMenuOpen(false);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openInviteModal = (topic: string | null = null) => {
    setMobileMenuOpen(false);
    setPrefilledTopic(topic);
    setModalMode('invite');
  };

  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    const nextIndex = getNextTabIndex(index, event.key, MESSAGE_CATEGORIES.length);
    if (nextIndex === null) return;
    event.preventDefault();
    const nextCategory = MESSAGE_CATEGORIES[nextIndex];
    setSelectedCategory(nextCategory);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#0B0909] text-white">
      {/* Fixed Navigation */}
      <nav
        aria-label="Navegação principal"
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:justify-center p-4 sm:p-5"
      >
        {/* Desktop centered single pill */}
        <div className="nav-drop hidden md:flex bg-black/65 backdrop-blur-md rounded-full pl-3 pr-2 py-2 items-center gap-1 border border-white/10">
          <button
            type="button"
            onClick={() => handleNavSelect('inicio')}
            aria-label="Voltar ao início"
            className="flex items-center justify-center p-1.5 mr-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <BrandLogo />
          </button>

          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavSelect(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'font-semibold text-white bg-white/16 ring-1 ring-white/20 shadow-sm'
                    : 'font-medium text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full bg-[#E05A2B] transition-all duration-200 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 w-0 -mr-1.5'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => openInviteModal(null)}
            className="bg-white text-gray-900 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-gray-100 transition-colors ml-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Convidar
          </button>
        </div>

        {/* Mobile unified frosted pill bar (prevents text bleed-through behind gaps) */}
        <div className="nav-drop md:hidden flex w-full items-center justify-between bg-[#0B0909]/85 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/12 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          <button
            type="button"
            onClick={() => handleNavSelect('inicio')}
            aria-label="Voltar ao início"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <BrandLogo />
          </button>

          {/* Mobile live current-section indicator so user always knows where they are */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={`Seção atual: ${activeNavItem.label}. Abrir menu de navegação`}
            data-testid="mobile-active-section"
            className="inline-flex items-center gap-2 min-h-[38px] px-4 rounded-full bg-white/10 ring-1 ring-white/15 text-xs font-medium text-white cursor-pointer"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#E05A2B]" />
            <span className="font-mono-meta uppercase tracking-[0.1em] text-[11px]">
              {activeNavItem.label}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-dropdown"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Full-Width Dark Frosted Dropdown */}
      {mobileMenuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />
          <div
            id="mobile-nav-dropdown"
            className="fixed top-0 left-0 right-0 z-40 bg-[#0B0909]/95 backdrop-blur-xl border-b border-white/10 pt-20 pb-7 px-5 shadow-2xl md:hidden"
          >
            <div className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full min-h-[48px] flex items-center justify-between text-left text-base border-b border-white/10 transition-colors cursor-pointer ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-white/75 font-medium hover:text-white'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-[#E05A2B]"
                        />
                      )}
                      <span>{item.label}</span>
                    </span>
                    {isActive && (
                      <span className="font-mono-meta text-[11px] uppercase tracking-[0.12em] text-[#E05A2B]">
                        Atual
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => openInviteModal(null)}
                className="mt-6 w-full min-h-[48px] inline-flex items-center justify-center bg-white text-gray-900 text-sm font-semibold px-6 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Convidar para Ministrar
              </button>
            </div>
          </div>
        </>
      )}

      <main>
        {/* Full-Screen Hero Section */}
        <section
          id="inicio"
          ref={heroSectionRef}
          className="relative h-[100dvh] w-full overflow-hidden bg-[#1a0404]"
        >
          {/* Layer 1 (z-0): Parallax Grid Background */}
          <svg
            aria-hidden="true"
            data-testid="hero-grid-svg"
            className="absolute inset-0 z-0 h-full w-full pointer-events-none"
            style={{ opacity: 0.1 }}
          >
            <defs>
              <pattern
                ref={gridPatternRef}
                id="hero-grid-pattern"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
                x="0"
                y="0"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
          </svg>

          {/* Layer 2 (z-10): Retouched Studio Portrait with Ken Burns */}
          <div
            aria-hidden="true"
            data-testid="hero-base-image"
            className="ken-burns absolute inset-0 z-10 bg-center bg-cover"
            style={{ backgroundImage: `url("${BG_IMAGE_STUDIO}")` }}
          />

          {/* Layer 3 (z-30): GPU-Accelerated CSS Variable Spotlight Reveal Layer */}
          <div
            ref={revealLayerRef}
            aria-hidden="true"
            data-testid="hero-reveal-layer"
            className="hero-spotlight-mask absolute inset-0 z-30 bg-center bg-cover pointer-events-none"
            style={{
              backgroundImage: `url("${BG_IMAGE_STUDIO}")`,
              filter: 'grayscale(1) contrast(1.24) brightness(1.1)',
            }}
          />

          {/* Localized legibility scrim strictly behind bottom-left copy */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.45)_0%,transparent_58%)]"
          />

          {/* Layer 4 (z-50): Semantic + Visual Stats on a Fading Circular Arc */}
          <div
            data-testid="hero-stats-arc"
            className="absolute inset-y-0 right-0 z-50 pointer-events-none"
          >
            <ul aria-label="Números do Ministério" className="sr-only">
              {computedArcs.map((arc) => (
                <li key={arc.id}>{arc.accessibleLabel}</li>
              ))}
            </ul>

            <svg
              aria-hidden="true"
              viewBox="0 0 380 700"
              preserveAspectRatio="xMaxYMid meet"
              className="hidden sm:block h-full w-auto"
            >
              <defs>
                {computedArcs.map((arc, i) => (
                  <linearGradient
                    key={arc.id}
                    id={`arc-grad-${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={arc.start.x}
                    y1={arc.start.y}
                    x2={arc.end.x}
                    y2={arc.end.y}
                  >
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="22%" stopColor="#ffffff" stopOpacity="0.5" />
                    <stop offset="55%" stopColor="#ffffff" stopOpacity="0.5" />
                    <stop offset="85%" stopColor="#ffffff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {computedArcs.map((arc, i) => (
                <g key={arc.id}>
                  <path
                    d={arc.pathD}
                    fill="none"
                    stroke={`url(#arc-grad-${i})`}
                    strokeWidth="1.1"
                    className="arc-line"
                    style={
                      {
                        '--len': arc.arcLength,
                        animationDelay: `${arc.lineDelay}s`,
                      } as React.CSSProperties
                    }
                  />

                  <circle
                    cx={arc.dot.x}
                    cy={arc.dot.y}
                    r="7"
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    className="arc-ring"
                    style={{ animationDelay: `${arc.ringDelay}s` }}
                  />

                  <circle
                    cx={arc.dot.x}
                    cy={arc.dot.y}
                    r="3.4"
                    fill="#ffffff"
                    className="arc-dot"
                    style={{ animationDelay: `${arc.markDelay}s` }}
                  />

                  <text
                    x={arc.dot.x + 16}
                    y={arc.dot.y + 4}
                    fill="#ffffff"
                    fontSize="32"
                    fontWeight="500"
                    letterSpacing="-1px"
                    className="arc-text font-mono-meta"
                    style={{ animationDelay: `${arc.valueDelay}s` }}
                  >
                    {arc.value}
                    <tspan fontSize="19" dy="-10">
                      {arc.suffix}
                    </tspan>
                  </text>

                  <text
                    x={arc.dot.x + 18}
                    y={arc.dot.y + 22}
                    fill="#ffffff"
                    fillOpacity="0.82"
                    fontSize="8.5"
                    fontWeight="600"
                    letterSpacing="1.6px"
                    className="arc-text font-mono-meta"
                    style={{ animationDelay: `${arc.labelDelay}s` }}
                  >
                    {arc.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Layer 5 (z-50): Hero Text Block */}
          <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-5 sm:left-8 md:left-12 z-50 max-w-[320px] sm:max-w-md">
            <p
              className="hero-rise font-mono-meta text-[11px] sm:text-xs font-medium tracking-[0.14em] uppercase text-white/90 mb-3 sm:mb-4"
              style={{ animationDelay: '0.15s' }}
            >
              <span className="font-editorial italic normal-case tracking-normal text-sm sm:text-base">Maestri Oficial</span> · Evangelho da Graça
            </p>

            <h1
              className="hero-rise font-editorial text-5xl sm:text-6xl md:text-[68px] leading-[1.02] tracking-[-0.03em] text-white font-normal mb-4 sm:mb-5"
              style={{ animationDelay: '0.3s' }}
            >
              Graça,
              <br />
              justiça e
              <br />
              descanso
            </h1>

            <p
              className="hero-rise text-sm sm:text-base text-white/90 leading-relaxed mb-6 sm:mb-8"
              style={{ animationDelay: '0.5s' }}
            >
              Um servo comum anunciando um Cristo suficiente: a obra consumada
              da cruz, o dom da justiça pela fé e a liberdade de viver como
              filhos amados.
            </p>

            <div
              className="hero-rise flex flex-wrap items-center gap-3"
              style={{ animationDelay: '0.7s' }}
            >
              <a
                href={DEFAULT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden min-h-[48px] inline-flex items-center justify-center gap-2.5 bg-white text-gray-900 text-sm font-semibold px-6 sm:px-7 py-3 rounded-full shadow-lg shadow-black/25 transition-transform duration-200 hover:scale-[1.03] hover:bg-neutral-100 active:scale-95"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                />
                <WhatsAppIcon className="relative z-10 h-4 w-4 text-[#16A34A]" />
                <span className="relative z-10">Falar no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => openInviteModal(null)}
                className="min-h-[48px] inline-flex items-center justify-center bg-black/55 backdrop-blur-md border border-white/25 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
              >
                Convidar
              </button>
            </div>
          </div>
        </section>

        {/* Highlight Video Section (30s autoPlay muted loop in aspect-video backdrop-blur frame) */}
        <MinistryHighlightVideo
          defaultSrc={HIGHLIGHT_VIDEO_SRC}
          posterSrc={HIGHLIGHT_POSTER_SRC}
          onInviteClick={() => openInviteModal('Ministração ao Vivo')}
        />

        {/* Section 1: Sobre o Ministério */}
        <section
          id="ministerio"
          className="relative bg-[#0B0909] border-t border-white/10 py-20 sm:py-28 px-5 sm:px-8 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-between gap-8">
                <div>
                  <p className="font-mono-meta text-xs font-medium uppercase tracking-[0.14em] text-[#E05A2B] mb-4">
                    Sobre Mim & A Mensagem
                  </p>
                  <h2 className="font-editorial text-balance text-3xl sm:text-4xl leading-[1.12] tracking-[-0.02em] text-white font-normal mb-5">
                    Nada sobre nós — tudo sobre a suficiência de Jesus.
                  </h2>
                  <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                    Não carrego fórmula pronta nem palco grandioso. Sou alguém
                    alcançado pela graça que ama compartilhar as Escrituras com
                    simplicidade — chegando de leve para servir igrejas, células
                    e encontros onde a Palavra de Cristo traga alívio e fé.
                  </p>
                </div>

                <EditorialPhotoCard
                  photo={stageLivePhoto}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  aspectClass="aspect-[16/10]"
                  overlayCaption
                  onOpen={setLightboxPhotoId}
                />
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between gap-8">
                <div className="divide-y divide-white/10 border-y border-white/10">
                  {MINISTRY_PILLARS.map((pillar) => (
                    <div key={pillar.number} className="py-7 first:pt-6 last:pb-6">
                      <div className="flex items-baseline gap-3 mb-2.5">
                        <span className="font-mono-meta text-xs font-semibold text-[#E05A2B] tabular-nums">
                          {pillar.number}
                        </span>
                        <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-white">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-[15px] text-white/75 leading-relaxed pl-8">
                        {pillar.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Strategic historical story card: from youth at the pulpit to today */}
                <figure className="group rounded-2xl border border-white/10 bg-[#140E0E] p-3.5 sm:p-4">
                  <button
                    type="button"
                    onClick={() => setLightboxPhotoId(youthPhoto.id)}
                    aria-label={`Ampliar foto: ${youthPhoto.title}`}
                    className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-xl"
                  >
                    <div className="relative w-full sm:w-32 aspect-[4/3] sm:aspect-square shrink-0 overflow-hidden rounded-xl bg-black">
                      <OptimizedPicture
                        slug={youthPhoto.slug}
                        widths={youthPhoto.widths}
                        sizes="(max-width: 640px) 100vw, 140px"
                        alt={youthPhoto.alt}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="min-w-0">
                      <p className="font-mono-meta text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E05A2B] mb-1">
                        {youthPhoto.tag}
                      </p>
                      <p className="font-editorial text-lg text-white font-normal leading-snug mb-1">
                        {youthPhoto.title}
                      </p>
                      <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed">
                        {youthPhoto.caption}
                      </p>
                    </figcaption>
                  </button>
                </figure>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/75">
                  <a
                    href={DEFAULT_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 text-white hover:text-[#4ADE80] transition-colors font-medium"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    <span>{WHATSAPP_DISPLAY}</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                  <span aria-hidden="true" className="text-white/70">
                    ·
                  </span>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 text-white hover:text-[#E05A2B] transition-colors font-medium"
                  >
                    <Instagram size={16} aria-hidden="true" />
                    <span>@maestri.oficial</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1.5: Momentos & Ministrações (Real Graded Videos & Retouched Photos) */}
        <MinistryGallerySection />

        {/* Section 2: Mensagens & Temas */}
        <section
          id="mensagens"
          className="bg-[#110D0D] border-t border-white/10 py-20 sm:py-28 px-5 sm:px-8 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-xl">
                <p className="font-mono-meta text-xs font-medium uppercase tracking-[0.14em] text-[#E05A2B] mb-3">
                  Ensino & Ministrações
                </p>
                <h2 className="font-editorial text-balance text-3xl sm:text-4xl leading-[1.12] tracking-[-0.02em] text-white font-normal">
                  A revelação da graça e da justiça de Deus nas Escrituras.
                </h2>
              </div>

              <div
                role="tablist"
                aria-label="Filtrar mensagens por categoria"
                className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 self-start md:self-auto"
              >
                {MESSAGE_CATEGORIES.map((category, index) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      id={`tab-${category}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="messages-grid"
                      tabIndex={active ? 0 : -1}
                      onClick={() => setSelectedCategory(category)}
                      onKeyDown={(e) => handleTabKeyDown(e, index)}
                      className={`min-h-[40px] px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white text-gray-900'
                          : 'text-white/75 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strategic preaching photography woven into Ensino & Ministrações */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-12">
              <EditorialPhotoCard
                photo={beigePulpitPhoto}
                sizes="(max-width: 768px) 100vw, 58vw"
                aspectClass="aspect-[4/3] md:aspect-auto md:h-[400px]"
                objectPositionClass="object-[50%_20%]"
                overlayCaption
                onOpen={setLightboxPhotoId}
                className="md:col-span-7"
              />
              <EditorialPhotoCard
                photo={blazerPreachPhoto}
                sizes="(max-width: 768px) 100vw, 42vw"
                aspectClass="aspect-[4/3] md:aspect-auto md:h-[400px]"
                objectPositionClass="object-[50%_18%]"
                overlayCaption
                onOpen={setLightboxPhotoId}
                className="md:col-span-5"
              />
            </div>

            <div
              id="messages-grid"
              role="tabpanel"
              aria-labelledby={`tab-${selectedCategory}`}
              className="divide-y divide-white/10 border-y border-white/10"
            >
              {visibleMessages.map((msg) => {
                const isPreviewOpen = expandedPreviewId === msg.id;
                return (
                  <article key={msg.id} className="py-7">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start md:items-center">
                      <div className="md:col-span-4">
                        <div className="font-mono-meta flex items-center gap-2 text-xs text-white/70 mb-2">
                          <span className="tabular-nums text-[#E05A2B] font-semibold">
                            {msg.index}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{msg.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{msg.duration}</span>
                        </div>
                        <h3 className="font-editorial text-2xl font-normal tracking-[-0.01em] text-white">
                          {msg.title}
                        </h3>
                      </div>

                      <p className="md:col-span-5 text-sm sm:text-[15px] text-white/75 leading-relaxed">
                        {msg.summary}
                      </p>

                      <div className="md:col-span-3 flex flex-wrap items-center md:justify-end gap-2">
                        <button
                          type="button"
                          aria-expanded={isPreviewOpen}
                          onClick={() =>
                            setExpandedPreviewId((cur) => (cur === msg.id ? null : msg.id))
                          }
                          className={`min-h-[44px] inline-flex items-center gap-1.5 rounded-full px-4 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isPreviewOpen
                              ? 'bg-white/15 border-white/30 text-white'
                              : 'border-white/15 text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <BookOpen size={14} aria-hidden="true" />
                          <span>{isPreviewOpen ? 'Ocultar esboço' : 'Ver esboço'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openInviteModal(msg.title)}
                          className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-white hover:text-[#E05A2B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <span>Solicitar tema</span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {isPreviewOpen && (
                      <MessageOutlinePanel message={msg} instagramUrl={INSTAGRAM_URL} />
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Nas Escrituras (4 textos-chave da Graça + foto estratégica de comunhão) */}
        <GraceScripturesSection onOpenPhoto={setLightboxPhotoId} />

        {/* Section 4: Convites & Conversa */}
        <section
          id="agenda"
          className="bg-[#110D0D] border-t border-white/10 py-20 sm:py-28 px-5 sm:px-8 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <p className="font-mono-meta text-xs font-medium uppercase tracking-[0.14em] text-[#E05A2B] mb-3">
                  Convites & Conversa
                </p>
                <h2 className="font-editorial text-balance text-3xl sm:text-4xl leading-[1.12] tracking-[-0.02em] text-white font-normal mb-5">
                  Quer compartilhar a Palavra na sua igreja ou célula?
                </h2>
                <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-8">
                  De leve e sem formalidade: seja um culto, uma célula na casa ou
                  um encontro de jovens, é só me chamar direto no WhatsApp{' '}
                  <span className="font-mono-meta text-white font-medium">
                    {WHATSAPP_DISPLAY}
                  </span>{' '}
                  para batermos um papo e ver se faz sentido caminharmos juntos.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={DEFAULT_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[46px] inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-semibold px-6 rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#16A34A]" />
                    <span>Chamar no WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => openInviteModal(null)}
                    className="min-h-[46px] inline-flex items-center justify-center border border-white/20 text-white text-sm font-medium px-5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Enviar pelo Site
                  </button>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[46px] inline-flex items-center gap-2 border border-white/15 text-white/85 text-sm font-medium px-5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Instagram size={16} aria-hidden="true" />
                    <span>@maestri.oficial</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>

                {/* Strategic pastoral & family photo anchoring the invitations section */}
                <div className="mt-8">
                  <EditorialPhotoCard
                    photo={babyDedicationPhoto}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    aspectClass="aspect-[16/10]"
                    objectPositionClass="object-[50%_38%]"
                    overlayCaption
                    onOpen={setLightboxPhotoId}
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="divide-y divide-white/10 border-y border-white/10">
                  {SERVING_FORMATS.map((item) => (
                    <div
                      key={item.tag}
                      className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="max-w-md">
                        <p className="font-mono-meta text-xs font-semibold tracking-[0.1em] text-[#E05A2B] tabular-nums mb-1.5">
                          {item.tag}
                        </p>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/75 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-start sm:justify-end">
                        <a
                          href={buildWhatsAppUrl(
                            `Olá Maestri! Paz! Queria bater um papo sobre ${item.whatsappTopic}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white border border-white/20 rounded-full px-5 hover:bg-white hover:text-gray-900 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Conversar</span>
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Closing Footer */}
      <footer
        id="contato"
        className="bg-[#080707] border-t border-white/10 pt-16 pb-10 px-5 sm:px-8 md:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <BrandLogo size={28} />
                <div>
                  <p className="text-base font-semibold text-white tracking-[-0.01em]">
                    Maestri Oficial
                  </p>
                  <p className="font-mono-meta text-[11px] uppercase tracking-[0.12em] text-white/70">
                    Evangelho da Graça
                  </p>
                </div>
              </div>
              <p className="font-editorial italic text-base sm:text-lg text-white/85 leading-relaxed max-w-md">
                “A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.”
              </p>
              <p className="font-mono-meta text-xs text-[#E05A2B] mt-2">
                2 Coríntios 12:9
              </p>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-white/70 mb-4">
                Navegação
              </p>
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavSelect(item.id)}
                      className="min-h-[38px] inline-flex items-center text-sm text-white/75 hover:text-white transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-white/70 mb-4">
                Fale Direto
              </p>
              <div className="flex flex-col items-start gap-2 text-sm text-white/80">
                <a
                  href={DEFAULT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2 text-white hover:text-[#4ADE80] transition-colors font-medium"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  <span>WhatsApp {WHATSAPP_DISPLAY}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Instagram size={15} aria-hidden="true" />
                  <span>instagram.com/maestri.oficial</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setPrefilledTopic(null);
                    setModalMode('contact');
                  }}
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-white/75 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Enviar mensagem pelo site</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/70">
            <p>© {new Date().getFullYear()} Maestri Oficial · Toda glória somente a Cristo.</p>
            <p className="font-mono-meta text-[11px] text-white/65">
              Paraná · Brasil
            </p>
          </div>
        </div>
      </footer>

      <ActionModal
        mode={modalMode}
        prefilledTopic={prefilledTopic}
        instagramUrl={INSTAGRAM_URL}
        onClose={() => setModalMode(null)}
      />

      <PhotoLightbox
        activePhotoId={lightboxPhotoId}
        onClose={() => setLightboxPhotoId(null)}
        onSelectPhoto={setLightboxPhotoId}
      />
    </div>
  );
}
