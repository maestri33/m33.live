import dubaiImg from '../assets/images/dubai_penthouse_villa_1794772838062.jpg';
import nyImg from '../assets/images/ny_billionaire_penthouse_1794772839809.jpg';
import miamiImg from '../assets/images/miami_waterfront_estate_1794772840408.jpg';
import monolithImg from '../assets/images/about_architecture_monolith_1794772841960.jpg';
import comoImg from '../assets/images/showcase_lake_como_villa_1794772842166.jpg';

// Helper to support both Vite string imports and Astro ImageMetadata objects
const toSrc = (img: any): string => (typeof img === 'string' ? img : (img?.src ?? ''));

const dubai = toSrc(dubaiImg);
const ny = toSrc(nyImg);
const miami = toSrc(miamiImg);
const monolith = toSrc(monolithImg);
const como = toSrc(comoImg);

export interface PropertyItem {
  id: string;
  title: string;
  subtitle: string;
  city: 'Dubai' | 'New York' | 'Miami' | 'Lake Como' | 'Aspen' | 'Monaco';
  location: string;
  price: string;
  priceNumeric: number;
  sqft: string;
  beds: number;
  baths: number;
  lotSize: string;
  architect: string;
  yearBuilt: number;
  featured: boolean;
  showcase: boolean;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  coordinates: string;
}

export const HERO_VIDEO_URL =
  'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_bg_video_real_estate.mp4';
export const HERO_POSTER_URL =
  'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/luxonn_hero_bg%20_img.png';

export const PROPERTIES: PropertyItem[] = [
  {
    id: 'vela-palm-jumeirah',
    title: 'VELA HORIZON VILLA',
    subtitle: 'Cantilevered Waterfront Sanctuary',
    city: 'Dubai',
    location: 'Palm Jumeirah, Dubai',
    price: '$38,500,000',
    priceNumeric: 38500000,
    sqft: '16,400 Sq Ft',
    beds: 7,
    baths: 9,
    lotSize: '0.68 Acres',
    architect: 'Foster + Partners Studio',
    yearBuilt: 2026,
    featured: true,
    showcase: true,
    image: dubai,
    gallery: [dubai, como, miami, ny],
    description:
      'Carved from Roman travertine and structural low-iron glass on the tip of Frond G, Vela Horizon commands 180-degree views of the Dubai Marina skyline. Features a 42-meter zero-edge reflection pool, submerged fire lounge, and private deep-water berth.',
    highlights: [
      '42-meter zero-edge heated infinity pool',
      'Private 85ft yacht berth on the Arabian Gulf',
      'Subterranean 10-car museum gallery with turntable',
      'Bespoke Poliform & Minotti architectural interiors',
    ],
    coordinates: '25.1124° N, 55.1390° E',
  },
  {
    id: 'the-crown-central-park',
    title: 'THE SOVEREIGN TRIPLEX',
    subtitle: 'Billionaires’ Row Sky Penthouse',
    city: 'New York',
    location: '57th Street, New York',
    price: '$64,000,000',
    priceNumeric: 64000000,
    sqft: '12,850 Sq Ft',
    beds: 6,
    baths: 8,
    lotSize: 'Full 78th–80th Floors',
    architect: 'Studio Sofield & CetraRuddy',
    yearBuilt: 2025,
    featured: true,
    showcase: true,
    image: ny,
    gallery: [ny, dubai, monolith, como],
    description:
      'Suspended 1,100 feet above Manhattan, this triple-height residence frames uninterrupted north-to-south vistas from Central Park to the Atlantic horizon. Anchored by a sculptural bronze spiral staircase and book-matched Silver Roots marble hearth.',
    highlights: [
      '24-foot double-height great room over Central Park',
      'Sculptural hand-patinated bronze spiral staircase',
      'Private high-speed elevator vestibule on all 3 levels',
      'Climate-controlled 1,800-bottle tasting cellar',
    ],
    coordinates: '40.7644° N, 73.9772° W',
  },
  {
    id: 'villa-solaris-star-island',
    title: 'VILLA SOLARIS ESTATE',
    subtitle: 'Tropical Brutalist Compound',
    city: 'Miami',
    location: 'Star Island, Miami Beach',
    price: '$49,750,000',
    priceNumeric: 49750000,
    sqft: '18,200 Sq Ft',
    beds: 8,
    baths: 11,
    lotSize: '1.12 Acres',
    architect: 'Oppenheim Architecture',
    yearBuilt: 2026,
    featured: true,
    showcase: true,
    image: miami,
    gallery: [miami, dubai, como, ny],
    description:
      'Board-formed architectural concrete meets warm Brazilian ipe louvers along 210 linear feet of Biscayne Bay frontage. Designed for seamless indoor-outdoor living with a private superyacht dock, wellness hammam, and sunset reflection pavilion.',
    highlights: [
      '210 feet of protected Biscayne Bay water frontage',
      'Private deep-water dock accommodating 130ft yachts',
      'Resort-grade hydrotherapy spa and cold plunge',
      'Detached two-story guest pavilion and screening room',
    ],
    coordinates: '25.7769° N, 80.1498° W',
  },
  {
    id: 'villa-bellagio-cliffside',
    title: 'PALAZZO LARIO CLIFFSIDE',
    subtitle: 'Suspended Alpine Lake Sanctuary',
    city: 'Lake Como',
    location: 'Torno, Lake Como',
    price: '$42,000,000',
    priceNumeric: 42000000,
    sqft: '14,600 Sq Ft',
    beds: 6,
    baths: 8,
    lotSize: '2.40 Acres',
    architect: 'Patricia Urquiola Studio',
    yearBuilt: 2025,
    featured: false,
    showcase: true,
    image: como,
    gallery: [como, monolith, dubai, ny],
    description:
      'Anchored directly into the Moltrasio limestone cliff face above Lake Como, Palazzo Lario pairs centuries-old Lombard stone masonry with frameless structural glass terraces and a subterranean Riva boat house carved into the rock.',
    highlights: [
      'Subterranean cliffside boathouse for classic Riva craft',
      'Cantilevered glass-bottom infinity pool over Lake Como',
      'Private funicular linking terraced olive groves to water',
      'Helipad clearance with 18-minute Milan Linate transfer',
    ],
    coordinates: '45.8569° N, 9.1167° E',
  },
  {
    id: 'monolith-ridge-sanctuary',
    title: 'AURELIA RIDGE MONOLITH',
    subtitle: 'Cantilevered Mountain Fortress',
    city: 'Aspen',
    location: 'Red Mountain, Aspen',
    price: '$55,000,000',
    priceNumeric: 55000000,
    sqft: '15,100 Sq Ft',
    beds: 7,
    baths: 9,
    lotSize: '3.85 Acres',
    architect: 'Olson Kundig',
    yearBuilt: 2026,
    featured: false,
    showcase: true,
    image: monolith,
    gallery: [monolith, como, ny, dubai],
    description:
      'Jutting dramatically from granite crags high on Red Mountain, this architectural tour de force combines raw cast-in-place concrete with brushed Muntz brass cladding, heated stone sky-decks, and direct ski-in access.',
    highlights: [
      '36-foot cantilevered viewing deck over Aspen Mountain',
      'Geothermal snow-melt terraces and outdoor bronze hearths',
      'Oxygen-enriched primary suite at alpine elevation',
      'Museum-grade acoustic concert and art gallery wing',
    ],
    coordinates: '39.2014° N, 106.8175° W',
  },
];

export const ABOUT_IMAGE = monolith;
export const VIDEO_SECTION_IMAGE = como;

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  transactionValue: string;
  avatar: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    quote:
      'LUXONN orchestrated our off-market acquisition on Palm Jumeirah in under fourteen days. Their architectural due diligence, private aviation logistics, and discretion are unmatched in global real estate.',
    author: 'Aleksandr Vance-Korsakov',
    role: 'Managing Principal',
    organization: 'Vance Sovereign Capital, Geneva',
    transactionValue: '$38.5M Off-Market Acquisition',
    avatar: dubai,
  },
  {
    id: 'test-2',
    quote:
      'When divesting our Central Park triplex, LUXONN bypassed conventional listings entirely—curating private twilight viewings for four pre-vetted family offices and achieving a record price per square foot.',
    author: 'Lady Victoria Sterling-Houghton',
    role: 'Chairwoman & Collector',
    organization: 'Sterling Architectural Trust, London & NYC',
    transactionValue: '$64.0M Private Placement',
    avatar: ny,
  },
];

export interface OfficeLocation {
  id: string;
  city: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  coordinates: string;
  hours: string;
  mapX: string;
  mapY: string;
  image: string;
}

export const GLOBAL_OFFICES: OfficeLocation[] = [
  {
    id: 'dubai',
    city: 'DUBAI',
    title: 'DIFC & Palm Jumeirah Flagship',
    address: 'ICD Brookfield Place, Level 44, DIFC, Dubai, UAE',
    phone: '+971 4 892 4000',
    email: 'dubai.private@luxonn.com',
    coordinates: '25.2116° N, 55.2815° E',
    hours: 'Mon – Sun · 09:00 – 22:00 GST',
    mapX: '64%',
    mapY: '48%',
    image: dubai,
  },
  {
    id: 'new-york',
    city: 'NEW YORK',
    title: 'Billionaires’ Row Private Salon',
    address: '730 Fifth Avenue, Crown Penthouse Suite, New York, NY 10019',
    phone: '+1 (212) 940-8800',
    email: 'ny.concierge@luxonn.com',
    coordinates: '40.7629° N, 73.9749° W',
    hours: 'Mon – Sat · 08:30 – 20:00 EST',
    mapX: '28%',
    mapY: '36%',
    image: ny,
  },
  {
    id: 'miami',
    city: 'MIAMI',
    title: 'Star Island & Design District',
    address: '140 NE 39th Street, Penthouse Gallery, Miami, FL 33137',
    phone: '+1 (305) 810-9200',
    email: 'miami.estates@luxonn.com',
    coordinates: '25.8126° N, 80.1918° W',
    hours: 'Mon – Sun · 09:00 – 21:00 EST',
    mapX: '25%',
    mapY: '56%',
    image: miami,
  },
];
