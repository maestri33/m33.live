import React, { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { GLOBAL_OFFICES, PROPERTIES } from '../data/properties';

export default function Contact() {
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>(
    GLOBAL_OFFICES[0].id
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interestProperty, setInterestProperty] = useState(PROPERTIES[0].title);
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const activeOffice =
    GLOBAL_OFFICES.find((o) => o.id === selectedOfficeId) || GLOBAL_OFFICES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter your full name and a valid email address.');
      return;
    }
    setErrorMsg(null);
    const code = `LXN-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRef(code);
  };

  const resetForm = () => {
    setSubmittedRef(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const isFloating = (field: string, value: string) =>
    focusedField === field || value.trim().length > 0;

  return (
    <section
      id="contact"
      className="py-28 md:py-36 bg-[#111111] border-t border-white/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="mb-16">
          <div className="text-xs uppercase tracking-[0.28em] text-[#D4A95F] mb-3">
            06. PRIVATE CONCIERGE DESK
          </div>
          <h2 className="font-display uppercase tracking-[0.1em] text-white text-5xl md:text-6xl leading-none">
            INITIATE PRIVATE INQUIRY
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Left Side: Office Info & Grayscale-to-Color Interactive Map */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div>
              {/* Office Selector Tabs */}
              <div className="flex items-center gap-2 p-1.5 bg-[#050505] border border-white/10 mb-8 w-fit">
                {GLOBAL_OFFICES.map((office) => (
                  <button
                    key={office.id}
                    type="button"
                    onClick={() => setSelectedOfficeId(office.id)}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedOfficeId === office.id
                        ? 'bg-[#D4A95F] text-black font-semibold'
                        : 'text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    {office.city}
                  </button>
                ))}
              </div>

              {/* Active Flagship Contact Details */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#D4A95F] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0] mb-1">
                      {activeOffice.title}
                    </div>
                    <div className="text-base text-white font-light">
                      {activeOffice.address}
                    </div>
                    <div className="text-xs text-[#E7C98B] mt-1 tabular-nums">
                      {activeOffice.coordinates} · {activeOffice.hours}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#D4A95F] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0] mb-1">
                        Direct Advisory Line
                      </div>
                      <a
                        href={`tel:${activeOffice.phone}`}
                        className="text-base text-white hover:text-[#D4A95F] transition-colors tabular-nums"
                      >
                        {activeOffice.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#D4A95F] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0] mb-1">
                        Private Desk Email
                      </div>
                      <a
                        href={`mailto:${activeOffice.email}`}
                        className="text-base text-white hover:text-[#D4A95F] transition-colors"
                      >
                        {activeOffice.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Grayscale Map Placeholder that Gains Color and Scales on Hover */}
            <div className="group relative h-[300px] sm:h-[340px] overflow-hidden border border-white/15 bg-[#050505]">
              <img
                src={activeOffice.image}
                alt={`${activeOffice.city} Architectural Map Context`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700 ease-out"
              />

              {/* Subtle Architectural Grid Overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent"
              />

              {/* Interactive Global Pins */}
              {GLOBAL_OFFICES.map((office) => {
                const isSelected = office.id === selectedOfficeId;
                return (
                  <button
                    key={office.id}
                    type="button"
                    onClick={() => setSelectedOfficeId(office.id)}
                    style={{ left: office.mapX, top: office.mapY }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4A95F] text-black font-semibold shadow-[0_0_25px_rgba(212,169,95,0.85)] scale-110'
                        : 'glass text-white hover:border-[#D4A95F]'
                    }`}
                  >
                    {office.city}
                  </button>
                );
              })}

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
                <span className="uppercase tracking-[0.2em]">
                  HOVER TO ILLUMINATE SATELLITE VIEW
                </span>
                <span className="text-[#D4A95F] tabular-nums">
                  {activeOffice.coordinates}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Glassmorphism Inquiry Form with Floating Gold Labels */}
          <div className="lg:col-span-6">
            <div className="glass p-8 md:p-12 h-full flex flex-col justify-between">
              {submittedRef ? (
                <div className="my-auto py-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#D4A95F]/15 border border-[#D4A95F] flex items-center justify-center text-[#D4A95F] mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="text-xs uppercase tracking-[0.28em] text-[#E7C98B]">
                    DOSSIER REGISTERED · REF {submittedRef}
                  </div>
                  <h3 className="font-display text-4xl tracking-[0.1em] text-white">
                    PRIVATE ADVISORY ASSIGNED
                  </h3>
                  <p className="text-sm text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white">{fullName}</span>. A
                    Senior Managing Partner from our{' '}
                    <span className="text-[#E7C98B]">{activeOffice.city}</span>{' '}
                    private desk will contact you within two hours regarding{' '}
                    <span className="text-white">{interestProperty}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3.5 bg-[#D4A95F] hover:bg-[#E7C98B] text-black text-xs uppercase tracking-[0.22em] font-semibold transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                  <div>
                    <h3 className="font-display text-3xl tracking-[0.1em] text-white mb-2">
                      REQUEST CONFIDENTIAL DOSSIER
                    </h3>
                    <p className="text-xs text-[#A0A0A0] tracking-wide">
                      All inquiries are protected under mutual non-disclosure
                      protocol.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-4 border border-amber-500/50 bg-amber-500/10 text-xs text-amber-200">
                      {errorMsg}
                    </div>
                  )}

                  {/* Floating Label Input: Full Name */}
                  <div className="relative pt-4">
                    <label
                      htmlFor="contact-name"
                      className={`absolute left-0 transition-all duration-200 pointer-events-none uppercase tracking-[0.2em] ${
                        isFloating('name', fullName)
                          ? 'top-0 text-[10px] text-[#D4A95F] font-semibold'
                          : 'top-6 text-xs text-[#A0A0A0]'
                      }`}
                    >
                      Principal Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={fullName}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-transparent border-b border-white/25 focus:border-[#D4A95F] py-3 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Two-Column Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="relative pt-4">
                      <label
                        htmlFor="contact-email"
                        className={`absolute left-0 transition-all duration-200 pointer-events-none uppercase tracking-[0.2em] ${
                          isFloating('email', email)
                            ? 'top-0 text-[10px] text-[#D4A95F] font-semibold'
                            : 'top-6 text-xs text-[#A0A0A0]'
                        }`}
                      >
                        Private Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-white/25 focus:border-[#D4A95F] py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="relative pt-4">
                      <label
                        htmlFor="contact-phone"
                        className={`absolute left-0 transition-all duration-200 pointer-events-none uppercase tracking-[0.2em] ${
                          isFloating('phone', phone)
                            ? 'top-0 text-[10px] text-[#D4A95F] font-semibold'
                            : 'top-6 text-xs text-[#A0A0A0]'
                        }`}
                      >
                        Direct Telephone / WhatsApp
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent border-b border-white/25 focus:border-[#D4A95F] py-3 text-sm text-white focus:outline-none transition-colors tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Select Residence of Interest */}
                  <div className="relative pt-4">
                    <label
                      htmlFor="contact-property"
                      className="block text-[10px] uppercase tracking-[0.2em] text-[#D4A95F] font-semibold mb-2"
                    >
                      Residence of Interest
                    </label>
                    <select
                      id="contact-property"
                      value={interestProperty}
                      onChange={(e) => setInterestProperty(e.target.value)}
                      className="w-full bg-[#050505] border border-white/20 focus:border-[#D4A95F] px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    >
                      {PROPERTIES.map((prop) => (
                        <option key={prop.id} value={prop.title}>
                          {prop.title} — {prop.location} ({prop.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Floating Label Textarea: Message */}
                  <div className="relative pt-4">
                    <label
                      htmlFor="contact-message"
                      className={`absolute left-0 transition-all duration-200 pointer-events-none uppercase tracking-[0.2em] ${
                        isFloating('message', message)
                          ? 'top-0 text-[10px] text-[#D4A95F] font-semibold'
                          : 'top-6 text-xs text-[#A0A0A0]'
                      }`}
                    >
                      Bespoke Requirements & Viewing Preferences
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      value={message}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-transparent border-b border-white/25 focus:border-[#D4A95F] py-3 text-sm text-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#D4A95F] hover:bg-[#E7C98B] text-black text-xs uppercase tracking-[0.24em] font-semibold shadow-[0_0_30px_rgba(212,169,95,0.35)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>Transmit Confidential Inquiry</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
