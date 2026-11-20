import React, { useState } from 'react';
import {
  X,
  Search,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
} from 'lucide-react';
import {
  HERO_POSTER_URL,
  HERO_VIDEO_URL,
  PROPERTIES,
  type PropertyItem,
} from '../data/properties';

/* 1. Interactive Property Detail Modal */
interface PropertyDetailModalProps {
  property: PropertyItem | null;
  onClose: () => void;
  onRequestViewing: (propertyId: string) => void;
}

export function PropertyDetailModal({
  property,
  onClose,
  onRequestViewing,
}: PropertyDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!property) return null;

  const images = property.gallery.length > 0 ? property.gallery : [property.image];
  const currentImg = images[activeImageIdx] || property.image;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={property.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#111111] border border-white/20 overflow-hidden my-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full glass text-white hover:text-[#D4A95F] hover:border-[#D4A95F] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Interactive Gallery */}
          <div className="lg:col-span-7 bg-[#050505] flex flex-col justify-between">
            <div className="relative h-[320px] sm:h-[440px] overflow-hidden">
              <img
                src={currentImg}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 glass px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-white tabular-nums">
                {property.coordinates}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-[#050505] border-t border-white/10">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative h-16 overflow-hidden border transition-all cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-[#D4A95F] opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${property.title} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Architectural Specifications & Booking Action */}
          <div className="lg:col-span-5 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#E7C98B] mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4A95F]" />
                <span>{property.location}</span>
              </div>

              <h2 className="font-display text-4xl tracking-[0.1em] text-white leading-none mb-2">
                {property.title}
              </h2>

              <div className="font-display text-3xl tracking-[0.1em] text-[#D4A95F] tabular-nums mb-6">
                {property.price}
              </div>

              <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6">
                {property.description}
              </p>

              {/* Key Architectural Specs Grid */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10 mb-6 text-xs tabular-nums">
                <div>
                  <div className="text-[#A0A0A0] flex items-center gap-1.5 mb-1">
                    <BedDouble className="w-3.5 h-3.5 text-[#D4A95F]" />
                    <span>Bedrooms</span>
                  </div>
                  <div className="text-white font-semibold">{property.beds} Suites</div>
                </div>
                <div>
                  <div className="text-[#A0A0A0] flex items-center gap-1.5 mb-1">
                    <Bath className="w-3.5 h-3.5 text-[#D4A95F]" />
                    <span>Bathrooms</span>
                  </div>
                  <div className="text-white font-semibold">{property.baths} Baths</div>
                </div>
                <div>
                  <div className="text-[#A0A0A0] flex items-center gap-1.5 mb-1">
                    <Maximize2 className="w-3.5 h-3.5 text-[#D4A95F]" />
                    <span>Footprint</span>
                  </div>
                  <div className="text-white font-semibold">{property.sqft}</div>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-8">
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-3">
                  ARCHITECTURAL PEDIGREE · {property.architect.toUpperCase()}
                </div>
                <ul className="space-y-2 text-xs text-[#A0A0A0]">
                  {property.highlights.map((hl) => (
                    <li key={hl} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4A95F] shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const id = property.id;
                onClose();
                onRequestViewing(id);
              }}
              className="w-full py-4 bg-[#D4A95F] hover:bg-[#E7C98B] text-black text-xs uppercase tracking-[0.22em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Schedule Private Viewing</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. Fullscreen Cinematic Video Player Modal */
interface VideoLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoLightboxModal({
  isOpen,
  onClose,
}: VideoLightboxModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Architectural Film Player"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl border border-white/20 bg-[#050505] overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#E7C98B]">
            <span>LUXONN CINEMA ARCHIVE</span>
            <span aria-hidden="true">·</span>
            <span>4K ARCHITECTURAL SHOWREEL</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4A95F] hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          <video
            src={HERO_VIDEO_URL}
            poster={HERO_POSTER_URL}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

/* 3. Live Property Search Overlay */
interface SearchOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: PropertyItem) => void;
}

export function SearchOverlayModal({
  isOpen,
  onClose,
  onSelectProperty,
}: SearchOverlayModalProps) {
  const [query, setQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('All');

  if (!isOpen) return null;

  const cities = ['All', 'Dubai', 'New York', 'Miami', 'Lake Como', 'Aspen'];

  const results = PROPERTIES.filter((p) => {
    const matchesCity = cityFilter === 'All' || p.city === cityFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.architect.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q);
    return matchesCity && matchesQuery;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Portfolio"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-start justify-center pt-20 px-4 pb-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#111111] border border-white/20 p-6 md:p-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs uppercase tracking-[0.28em] text-[#D4A95F]">
            GLOBAL PORTFOLIO SEARCH
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#D4A95F] hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-[#D4A95F] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by residence name, city, or architect (e.g., Foster, Palm Jumeirah, Central Park)..."
            className="w-full bg-[#050505] border border-white/20 focus:border-[#D4A95F] pl-12 pr-4 py-4 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none"
          />
        </div>

        {/* City Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setCityFilter(city)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer ${
                cityFilter === city
                  ? 'bg-[#D4A95F] text-black font-semibold'
                  : 'bg-[#050505] text-[#A0A0A0] hover:text-white border border-white/10'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#A0A0A0]">
              No residences match your filter criteria.
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  onSelectProperty(item);
                }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#050505] border border-white/10 hover:border-[#D4A95F] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-16 object-cover shrink-0"
                  />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#E7C98B]">
                      {item.location} · {item.architect}
                    </div>
                    <div className="font-display text-2xl tracking-[0.1em] text-white group-hover:text-[#D4A95F] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#A0A0A0] tabular-nums">
                      {item.sqft} · {item.beds} Beds · {item.baths} Baths
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className="font-display text-2xl tracking-[0.1em] text-[#D4A95F] tabular-nums">
                    {item.price}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-[#D4A95F]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* 4. Private Viewing Concierge Booking Modal */
interface BookingModalProps {
  isOpen: boolean;
  preselectedPropertyId?: string;
  onClose: () => void;
}

export function BookingModal({
  isOpen,
  preselectedPropertyId,
  onClose,
}: BookingModalProps) {
  const [propertyId, setPropertyId] = useState(
    preselectedPropertyId || PROPERTIES[0].id
  );
  const [viewingFormat, setViewingFormat] = useState<'in-person' | 'virtual'>(
    'in-person'
  );
  const [preferredDate, setPreferredDate] = useState('2026-11-24');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (preselectedPropertyId) {
      setPropertyId(preselectedPropertyId);
    }
  }, [preselectedPropertyId]);

  if (!isOpen) return null;

  const selectedProp =
    PROPERTIES.find((p) => p.id === propertyId) || PROPERTIES[0];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.includes('@')) {
      setError('Please provide your name and a valid email address.');
      return;
    }
    setError(null);
    setConfirmedCode(`PV-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book Private Viewing"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#111111] border border-white/20 p-8 md:p-10 relative my-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-[#D4A95F] hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedCode ? (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D4A95F]/15 border border-[#D4A95F] flex items-center justify-center text-[#D4A95F] mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#E7C98B] tabular-nums">
              CONFIRMATION #{confirmedCode}
            </div>
            <h3 className="font-display text-4xl tracking-[0.1em] text-white">
              PRIVATE VIEWING SCHEDULED
            </h3>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              Your {viewingFormat === 'in-person' ? 'In-Person Chauffeur & Helicopter' : 'Live 4K Architectural'}{' '}
              viewing for <span className="text-white">{selectedProp.title}</span>{' '}
              on <span className="text-[#E7C98B] tabular-nums">{preferredDate}</span>{' '}
              has been registered. Flight and security credentials have been
              dispatched to <span className="text-white">{clientEmail}</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                setConfirmedCode(null);
                onClose();
              }}
              className="px-8 py-3.5 bg-[#D4A95F] hover:bg-[#E7C98B] text-black text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
            >
              Return to Portfolio
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-6" noValidate>
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-[#D4A95F] mb-2">
                PRIVATE VIEWING PROTOCOL
              </div>
              <h3 className="font-display text-4xl tracking-[0.1em] text-white">
                RESERVE EXCLUSIVE TOUR
              </h3>
            </div>

            {error && (
              <div className="p-3 border border-amber-500/40 bg-amber-500/10 text-xs text-amber-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0] mb-2">
                Select Residence
              </label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full bg-[#050505] border border-white/20 focus:border-[#D4A95F] px-4 py-3 text-sm text-white focus:outline-none"
              >
                {PROPERTIES.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.title} · {prop.location} ({prop.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0] mb-2">
                Viewing Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setViewingFormat('in-person')}
                  className={`py-3 px-4 text-xs uppercase tracking-[0.16em] border transition-colors cursor-pointer ${
                    viewingFormat === 'in-person'
                      ? 'bg-[#D4A95F] text-black border-[#D4A95F] font-semibold'
                      : 'bg-[#050505] text-[#A0A0A0] border-white/15 hover:text-white'
                  }`}
                >
                  In-Person VIP Tour
                </button>
                <button
                  type="button"
                  onClick={() => setViewingFormat('virtual')}
                  className={`py-3 px-4 text-xs uppercase tracking-[0.16em] border transition-colors cursor-pointer ${
                    viewingFormat === 'virtual'
                      ? 'bg-[#D4A95F] text-black border-[#D4A95F] font-semibold'
                      : 'bg-[#050505] text-[#A0A0A0] border-white/15 hover:text-white'
                  }`}
                >
                  Live 4K Director Walkthrough
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0] mb-2">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#D4A95F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#050505] border border-white/20 focus:border-[#D4A95F] pl-10 pr-4 py-3 text-sm text-white tabular-nums focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0] mb-2">
                  Principal Full Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Lord / Lady / Principal Name"
                  className="w-full bg-[#050505] border border-white/20 focus:border-[#D4A95F] px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0] mb-2">
                Confidential Email *
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="principal@familyoffice.com"
                className="w-full bg-[#050505] border border-white/20 focus:border-[#D4A95F] px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#D4A95F] hover:bg-[#E7C98B] text-black text-xs uppercase tracking-[0.22em] font-semibold transition-colors cursor-pointer"
            >
              Confirm Private Viewing Reservation
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
