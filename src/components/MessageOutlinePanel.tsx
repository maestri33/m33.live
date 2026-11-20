import React from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { buildWhatsAppUrl, type MinistryMessage } from '../utils/heroMath';

interface MessageOutlinePanelProps {
  message: MinistryMessage;
  instagramUrl: string;
}

export function MessageOutlinePanel({
  message,
  instagramUrl,
}: MessageOutlinePanelProps) {
  const topicWhatsAppUrl = buildWhatsAppUrl(
    `Olá Maestri! Paz! Vi o tema "${message.title}" (${message.scriptureRef}) no seu site e queria conversar sobre compartilhar essa palavra na nossa igreja.`
  );

  return (
    <div className="mt-5 rounded-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-white/75">
          <BookOpen size={14} className="text-[#E05A2B] shrink-0" aria-hidden="true" />
          <span className="font-medium text-white">Esboço da Mensagem</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-meta text-white/75">{message.scriptureRef}</span>
        </div>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-white/75 hover:text-white transition-colors"
        >
          <span>Acompanhar no @maestri.oficial</span>
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>

      <blockquote className="font-editorial italic text-lg sm:text-xl text-white/95 leading-relaxed mb-5 pl-4 border-l-2 border-[#E05A2B]/70">
        {message.excerptQuote}
      </blockquote>

      <div className="mb-5">
        <p className="font-mono-meta text-[11px] uppercase tracking-[0.12em] text-white/70 mb-3">
          Pontos compartilhados na Palavra
        </p>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {message.keyPoints.map((point, idx) => (
            <li
              key={point}
              className="rounded-xl bg-black/35 border border-white/8 p-3.5 text-sm text-white/80 leading-relaxed"
            >
              <span className="font-mono-meta text-[11px] text-[#E05A2B] font-semibold block mb-1">
                0{idx + 1}.
              </span>
              {point}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
        <p className="text-xs text-white/70">
          Pode ser adaptada para culto dominical, célula ou estudo bíblico.
        </p>
        <a
          href={topicWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white hover:text-gray-900 text-white text-xs font-semibold px-4 transition-colors"
        >
          <span>Conversar sobre este tema no WhatsApp</span>
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
