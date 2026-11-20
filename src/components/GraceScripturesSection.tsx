import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import {
  GRACE_SCRIPTURES,
  buildWhatsAppUrl,
  getMinistryPhotoById,
} from '../utils/heroMath';
import { EditorialPhotoCard } from './PhotoLightbox';

interface GraceScripturesSectionProps {
  onOpenPhoto: (photoId: string) => void;
}

export function GraceScripturesSection({
  onOpenPhoto,
}: GraceScripturesSectionProps) {
  const [activeId, setActiveId] = useState(GRACE_SCRIPTURES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const couplePhoto = getMinistryPhotoById('couple-blessing');

  const activeScripture =
    GRACE_SCRIPTURES.find((item) => item.id === activeId) ?? GRACE_SCRIPTURES[0];

  const handleCopyVerse = async () => {
    const text = `“${activeScripture.verse}” (${activeScripture.reference}) — ${activeScripture.reflection}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedId(activeScripture.id);
      window.setTimeout(() => {
        setCopiedId((cur) => (cur === activeScripture.id ? null : cur));
      }, 2200);
    } catch {
      setCopiedId(activeScripture.id);
    }
  };

  const shareWhatsAppUrl = buildWhatsAppUrl(
    `Olá Maestri! Paz! Estava lendo ${activeScripture.reference} no seu site (“${activeScripture.verse}”) e gostei muito da reflexão.`
  );

  return (
    <section
      id="escrituras"
      aria-label="Textos bíblicos que fundamentam o ministério"
      className="bg-[#0B0909] border-t border-white/10 py-20 sm:py-28 px-5 sm:px-8 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <p className="font-mono-meta text-xs font-medium uppercase tracking-[0.14em] text-[#E05A2B] mb-3">
              Nas Escrituras
            </p>
            <h2 className="font-editorial text-balance text-3xl sm:text-4xl leading-[1.12] tracking-[-0.02em] text-white font-normal mb-4">
              Quatro textos bíblicos que sustentam tudo o que compartilhamos.
            </h2>
            <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-7">
              Mais do que frases de efeito, a nossa fé repousa naquilo que Deus já
              registrou na Sua Palavra sobre graça, fraqueza humana e justiça em Cristo.
            </p>

            <div
              role="tablist"
              aria-label="Escolher versículo bíblico"
              className="flex flex-col gap-2"
            >
              {GRACE_SCRIPTURES.map((item, idx) => {
                const isSelected = item.id === activeScripture.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveId(item.id)}
                    className={`w-full min-h-[52px] flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-left border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/25 text-white'
                        : 'bg-transparent border-white/10 text-white/75 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono-meta text-xs text-[#E05A2B] tabular-nums">
                        0{idx + 1}
                      </span>
                      <span className="text-sm font-medium">{item.theme}</span>
                    </div>
                    <span className="font-mono-meta text-xs text-white/70 whitespace-nowrap">
                      {item.reference}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              role="tabpanel"
              className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/12 p-6 sm:p-9 md:p-10 shadow-2xl shadow-black/40"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="font-mono-meta text-xs uppercase tracking-[0.14em] text-[#E05A2B]">
                  {activeScripture.reference}
                </span>
                <span className="font-mono-meta text-xs text-white/70">
                  {activeScripture.theme}
                </span>
              </div>

              <blockquote className="font-editorial italic text-2xl sm:text-3xl leading-[1.32] text-white font-normal mb-6">
                “{activeScripture.verse}”
              </blockquote>

              <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-8 pt-6 border-t border-white/10">
                {activeScripture.reflection}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyVerse}
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/10 text-white text-xs font-medium px-5 transition-colors cursor-pointer"
                >
                  {copiedId === activeScripture.id ? (
                    <>
                      <Check size={14} className="text-[#4ADE80]" aria-hidden="true" />
                      <span>Versículo copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} aria-hidden="true" />
                      <span>Copiar texto e reflexão</span>
                    </>
                  )}
                </button>

                <a
                  href={shareWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-white/85 hover:text-white transition-colors"
                >
                  <span>Comentar no WhatsApp</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Strategic editorial family & altar companion photo */}
            <div className="mt-6">
              <EditorialPhotoCard
                photo={couplePhoto}
                sizes="(max-width: 1024px) 100vw, 58vw"
                aspectClass="aspect-[16/9]"
                objectPositionClass="object-[50%_35%]"
                overlayCaption
                onOpen={onOpenPhoto}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
