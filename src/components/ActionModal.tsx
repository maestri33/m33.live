import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import {
  type InvitationField,
  type InvitationValidationError,
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
  validateInvitationForm,
} from '../utils/heroMath';

export type ModalMode = 'invite' | 'contact' | null;

interface ActionModalProps {
  mode: ModalMode;
  prefilledTopic: string | null;
  instagramUrl: string;
  onClose: () => void;
}

const EVENT_FORMATS = [
  'Culto / Igreja Local',
  'Conferência / Congresso',
  'Encontro de Jovens',
  'Workshop / Liderança',
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ActionModal({
  mode,
  prefilledTopic,
  instagramUrl,
  onClose,
}: ActionModalProps) {
  const [organizer, setOrganizer] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [eventFormat, setEventFormat] = useState(EVENT_FORMATS[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<InvitationValidationError | null>(null);
  const [submitted, setSubmitted] = useState<{
    organizer: string;
    city: string;
    email: string;
    eventFormat: string;
  } | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const organizerInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!mode) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    setError(null);
    setSubmitted(null);
    setOrganizer('');
    setCity('');
    setEmail('');
    setNotes(prefilledTopic ? `Tema de interesse: ${prefilledTopic}` : '');

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      organizerInputRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last || !dialogRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus();
    };
  }, [mode, prefilledTopic, onClose]);

  if (!mode) return null;

  const isInvite = mode === 'invite';

  const focusField = (field: InvitationField) => {
    if (field === 'organizer') organizerInputRef.current?.focus();
    if (field === 'city') cityInputRef.current?.focus();
    if (field === 'email') emailInputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateInvitationForm({ organizer, city, email });
    if (validationError) {
      setError(validationError);
      focusField(validationError.field);
      return;
    }
    setError(null);
    setSubmitted({
      organizer: organizer.trim(),
      city: city.trim(),
      email: email.trim(),
      eventFormat,
    });
  };

  const inputClass = (field: InvitationField) =>
    `w-full min-h-[44px] rounded-xl bg-white/5 border px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none transition-colors ${
      error?.field === field
        ? 'border-red-500/80 focus:border-red-400'
        : 'border-white/15 focus:border-white/55'
    }`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ministry-modal-title"
        className="relative w-full max-w-md rounded-2xl bg-[#110D0D] border border-white/15 p-6 sm:p-7 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="font-mono-meta text-[11px] uppercase tracking-[0.14em] text-white/70 mb-1.5">
              Maestri Oficial
            </p>
            <h2
              id="ministry-modal-title"
              className="font-editorial text-2xl sm:text-[26px] leading-tight font-normal tracking-[-0.02em] text-white"
            >
              {isInvite ? 'Convidar para Ministrar' : 'Contato do Ministério'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-white"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <p className="text-sm text-white/90 leading-relaxed">
              Convite pronto para{' '}
              <span className="text-white font-semibold">{submitted.organizer}</span>{' '}
              ({submitted.city}) — {submitted.eventFormat}.
            </p>
            <p className="text-sm text-white/75 leading-relaxed">
              Para agilizar a conversa sobre a data, envie estes dados direto no meu
              WhatsApp{' '}
              <span className="font-mono-meta text-white font-medium">
                {WHATSAPP_DISPLAY}
              </span>{' '}
              ou aguarde o retorno em{' '}
              <span className="text-white font-medium">{submitted.email}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href={buildWhatsAppUrl(
                  `Olá Maestri! Paz! Convite de ${submitted.organizer} (${submitted.city}) — ${submitted.eventFormat}.${
                    notes.trim() ? ` ${notes.trim()}` : ''
                  } Retorno: ${submitted.email}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-full bg-white text-gray-900 text-sm font-semibold px-4 hover:bg-gray-100 transition-colors"
              >
                <span>Enviar no WhatsApp</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center rounded-full border border-white/20 text-white text-sm font-medium px-5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <p className="text-sm text-white/75 leading-relaxed">
              {isInvite
                ? `Se preferir, pode chamar direto no WhatsApp ${WHATSAPP_DISPLAY} — ou preencher abaixo para conversarmos sobre a data.`
                : `Chame direto no WhatsApp ${WHATSAPP_DISPLAY} ou envie sua mensagem por aqui.`}
            </p>

            <div>
              <label
                htmlFor="invite-organizer"
                className="block text-xs font-medium text-white/85 mb-1.5"
              >
                Nome / Igreja ou Evento
              </label>
              <input
                ref={organizerInputRef}
                id="invite-organizer"
                type="text"
                value={organizer}
                aria-invalid={error?.field === 'organizer'}
                aria-describedby={error?.field === 'organizer' ? 'invite-form-error' : undefined}
                onChange={(e) => {
                  setOrganizer(e.target.value);
                  if (error?.field === 'organizer') setError(null);
                }}
                placeholder="Ex.: Igreja Batista Central"
                className={inputClass('organizer')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="invite-city"
                  className="block text-xs font-medium text-white/85 mb-1.5"
                >
                  Cidade / UF
                </label>
                <input
                  ref={cityInputRef}
                  id="invite-city"
                  type="text"
                  value={city}
                  aria-invalid={error?.field === 'city'}
                  aria-describedby={error?.field === 'city' ? 'invite-form-error' : undefined}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (error?.field === 'city') setError(null);
                  }}
                  placeholder="Ex.: São Paulo - SP"
                  className={inputClass('city')}
                />
              </div>

              <div>
                <label
                  htmlFor="invite-format"
                  className="block text-xs font-medium text-white/85 mb-1.5"
                >
                  Formato
                </label>
                <select
                  id="invite-format"
                  value={eventFormat}
                  onChange={(e) => setEventFormat(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/55"
                >
                  {EVENT_FORMATS.map((fmt) => (
                    <option key={fmt} value={fmt} className="bg-[#110D0D] text-white">
                      {fmt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="invite-email"
                className="block text-xs font-medium text-white/85 mb-1.5"
              >
                E-mail para Retorno
              </label>
              <input
                ref={emailInputRef}
                id="invite-email"
                type="email"
                value={email}
                aria-invalid={error?.field === 'email'}
                aria-describedby={error?.field === 'email' ? 'invite-form-error' : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error?.field === 'email') setError(null);
                }}
                placeholder="contato@igreja.com.br"
                autoComplete="email"
                className={inputClass('email')}
              />
            </div>

            <div>
              <label
                htmlFor="invite-notes"
                className="block text-xs font-medium text-white/85 mb-1.5"
              >
                Data prevista ou observação (opcional)
              </label>
              <textarea
                id="invite-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex.: Conferência de Jovens em setembro"
                className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/55 resize-none"
              />
            </div>

            {error && (
              <p id="invite-form-error" role="alert" className="text-xs font-medium text-red-400">
                {error.message}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] inline-flex items-center justify-center rounded-full px-5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-white text-gray-900 text-sm font-semibold px-6 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Enviar Convite
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
