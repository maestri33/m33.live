export const SEO_CONFIG = {
  siteName: 'Maestri Oficial',
  title: 'Maestri Oficial — Evangelho da Graça e Vida em Cristo',
  description:
    'Site oficial de Maestri Oficial (@maestri.oficial). Anunciando a obra consumada da cruz, a justiça pela fé e o descanso na graça. Convide para sua igreja.',
  ogImagePath: '/assets/optimized/portrait-studio-1200w.jpg',
  ogImageAlt: 'Maestri Oficial — Evangelho da Graça, Justiça pela Fé e Vida em Cristo',
  ogImageWidth: 1200,
  ogImageHeight: 670,
  locale: 'pt_BR',
  instagramUrl: 'https://www.instagram.com/maestri.oficial/',
  whatsappUrl: 'https://wa.me/5543996648750',
  telephone: '+55-43-99664-8750',
} as const;

export function resolveAbsoluteSeoUrl(origin: string, path = '/'): string {
  const cleanOrigin = origin.trim().replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!cleanOrigin) return normalizedPath;
  return `${cleanOrigin}${normalizedPath}`;
}

export interface PersonSchemaJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  alternateName: string;
  description: string;
  jobTitle: string;
  url: string;
  image: string;
  knowsLanguage: string;
  knowsAbout: string[];
  sameAs: string[];
  homeLocation: {
    '@type': 'Place';
    address: {
      '@type': 'PostalAddress';
      addressRegion: string;
      addressCountry: string;
    };
  };
  contactPoint: {
    '@type': 'ContactPoint';
    contactType: string;
    telephone: string;
    url: string;
    availableLanguage: string[];
  };
}

export function buildPersonJsonLd(origin: string, pathname = '/'): PersonSchemaJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SEO_CONFIG.siteName,
    alternateName: '@maestri.oficial',
    description:
      'Pregador e ensinador bíblico brasileiro dedicado ao Evangelho da Graça — anunciando a obra consumada da cruz, o dom da justiça pela fé e a vida em Cristo para igrejas locais, células e encontros.',
    jobTitle: 'Pregador e Ensinador Bíblico',
    url: resolveAbsoluteSeoUrl(origin, pathname || '/'),
    image: resolveAbsoluteSeoUrl(origin, SEO_CONFIG.ogImagePath),
    knowsLanguage: 'pt-BR',
    knowsAbout: [
      'Evangelho da Graça',
      'Justiça pela Fé',
      'Obra Consumada da Cruz',
      'Nova Aliança',
      'Estudo Bíblico',
      'Vida em Cristo',
    ],
    sameAs: [SEO_CONFIG.instagramUrl, SEO_CONFIG.whatsappUrl],
    homeLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'PR',
        addressCountry: 'BR',
      },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Convites para Ministrações',
      telephone: SEO_CONFIG.telephone,
      url: SEO_CONFIG.whatsappUrl,
      availableLanguage: ['Portuguese'],
    },
  };
}

export function syncRuntimeSeoMetadata(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const origin = window.location.origin;
  const pathname = window.location.pathname || '/';
  const canonicalUrl = resolveAbsoluteSeoUrl(origin, pathname);
  const absoluteImageUrl = resolveAbsoluteSeoUrl(origin, SEO_CONFIG.ogImagePath);

  const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', canonicalUrl);
  }

  const ogUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (ogUrlMeta) {
    ogUrlMeta.setAttribute('content', canonicalUrl);
  }

  const ogImageMeta = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
  if (ogImageMeta) {
    ogImageMeta.setAttribute('content', absoluteImageUrl);
  }

  const twitterImageMeta = document.querySelector<HTMLMetaElement>('meta[name="twitter:image"]');
  if (twitterImageMeta) {
    twitterImageMeta.setAttribute('content', absoluteImageUrl);
  }

  const jsonLdScript = document.getElementById('schema-person');
  if (jsonLdScript) {
    jsonLdScript.textContent = JSON.stringify(buildPersonJsonLd(origin, pathname), null, 2);
  }
}
