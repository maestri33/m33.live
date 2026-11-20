export interface Point {
  x: number;
  y: number;
}

export interface ArcStatSpec {
  id: string;
  radius: number;
  startDeg: number;
  endDeg: number;
  dotDeg: number;
  value: string;
  suffix: string;
  label: string;
  accessibleLabel: string;
}

export interface ComputedArcStat extends ArcStatSpec {
  start: Point;
  end: Point;
  dot: Point;
  pathD: string;
  arcLength: number;
  lineDelay: number;
  markDelay: number;
  ringDelay: number;
  valueDelay: number;
  labelDelay: number;
}

export interface MinistryMessage {
  id: string;
  index: string;
  title: string;
  category: 'Graça & Cruz' | 'Justiça pela Fé' | 'Vida em Cristo';
  duration: string;
  summary: string;
  excerptQuote: string;
  scriptureRef: string;
  keyPoints: [string, string, string];
}

export interface GraceScripture {
  id: string;
  reference: string;
  theme: string;
  verse: string;
  reflection: string;
}

export const WHATSAPP_NUMBER_BR = '5543996648750';
export const WHATSAPP_DISPLAY = '(43) 99664-8750';

export function buildWhatsAppUrl(
  message?: string,
  phoneDigits: string = WHATSAPP_NUMBER_BR
): string {
  const digitsOnly = phoneDigits.replace(/\D/g, '');
  const normalized =
    digitsOnly.length === 10 || digitsOnly.length === 11
      ? `55${digitsOnly}`
      : digitsOnly || WHATSAPP_NUMBER_BR;
  const base = `https://wa.me/${normalized}`;
  const trimmedMessage = message?.trim();
  if (!trimmedMessage) return base;
  return `${base}?text=${encodeURIComponent(trimmedMessage)}`;
}

export const ARC_CENTER: Point = { x: -110, y: 300 };

export const ARC_STATS: ArcStatSpec[] = [
  {
    id: 'so-a-graca',
    radius: 330,
    startDeg: -92,
    endDeg: 16,
    dotDeg: -46,
    value: '01',
    suffix: '',
    label: 'SÓ A GRAÇA',
    accessibleLabel: 'Pilar um: Só a graça — favor imerecido de Deus em Cristo',
  },
  {
    id: 'justica-pela-fe',
    radius: 395,
    startDeg: -56,
    endDeg: 60,
    dotDeg: 2,
    value: '02',
    suffix: '',
    label: 'JUSTIÇA',
    accessibleLabel: 'Pilar dois: Justiça pela fé — dom gratuito sem condenação',
  },
  {
    id: 'obra-consumada',
    radius: 460,
    startDeg: -14,
    endDeg: 72,
    dotDeg: 44,
    value: '03',
    suffix: '',
    label: 'OBRA CONSUMADA',
    accessibleLabel: 'Pilar três: Obra consumada de Jesus na cruz',
  },
];

export const MINISTRY_MESSAGES: MinistryMessage[] = [
  {
    id: 'obra-consumada',
    index: '01',
    title: 'A Obra Consumada da Cruz',
    category: 'Graça & Cruz',
    duration: '45 min',
    summary:
      'Por que o “Está consumado” de Jesus encerra de vez a tentativa de merecer o favor de Deus pelo esforço humano — e abre o caminho para o descanso da fé.',
    scriptureRef: 'João 19:30',
    excerptQuote:
      '“A religião sempre diz ‘faça mais para ser aceito’; o Evangelho da Graça anuncia ‘está consumado — receba e descanse no que Cristo já fez’.”',
    keyPoints: [
      'O que Jesus realmente encerrou quando declarou “Está consumado” no Calvário.',
      'Por que acrescentar mérito humano à cruz anula a paz e alimenta a ansiedade espiritual.',
      'Como trocar uma fé baseada em cobrança por uma caminhada de gratidão e descanso.',
    ],
  },
  {
    id: 'dom-da-justica',
    index: '02',
    title: 'O Dom da Justiça e o Fim da Condenação',
    category: 'Justiça pela Fé',
    duration: '45 min',
    summary:
      'Entendendo que você foi feito justiça de Deus em Cristo Jesus — não pelo seu desempenho semanal, mas pelo sangue perfeito da Nova Aliança.',
    scriptureRef: '2 Coríntios 5:21 · Romanos 8:1',
    excerptQuote:
      '“Quando a consciência de pecado dá lugar à consciência de justiça em Cristo, a culpa perde a voz e o pecado perde o domínio sobre você.”',
    keyPoints: [
      'A grande troca da cruz: Cristo assumiu o nosso pecado para recebermos a Sua justiça.',
      'A diferença prática entre convicção do Espírito Santo e condenação religiosa.',
      'Como levantar depois de uma falha olhando para o advogado junto ao Pai, e não para a culpa.',
    ],
  },
  {
    id: 'reinando-em-vida',
    index: '03',
    title: 'Abundância da Graça para Reinar em Vida',
    category: 'Vida em Cristo',
    duration: '50 min',
    summary:
      'Como receber continuamente a abundância da graça e do dom da justiça capacita o crente a vencer o medo, a culpa e a derrota de dentro para fora.',
    scriptureRef: 'Romanos 5:17',
    excerptQuote:
      '“O crer certo produz o viver certo: quanto mais você contempla a abundância da graça de Jesus, mais naturalmente você reina sobre as circunstâncias.”',
    keyPoints: [
      'Romanos 5:17 na prática: não conquistamos a graça — nós a recebemos em abundância.',
      'Por que a transformação real nasce de contemplar Jesus, nunca de promessas na força da carne.',
      'Vivendo paz em casa, no trabalho e na igreja local a partir da identidade em Cristo.',
    ],
  },
  {
    id: 'descanso-na-graca',
    index: '04',
    title: 'Cessando das Próprias Obras: O Descanso de Deus',
    category: 'Graça & Cruz',
    duration: '45 min',
    summary:
      'Um mergulho em Hebreus e Gálatas sobre como abandonar o jugo do legalismo religioso e viver em plena dependência do Espírito.',
    scriptureRef: 'Hebreus 4:9–11 · Gálatas 2:21',
    excerptQuote:
      '“Descansar em Deus não é passividade — é a postura de fé de quem parou de tentar comprar o que o Pai já entregou de graça no Filho.”',
    keyPoints: [
      'O contraste em Hebreus entre o sacerdote que trabalhava em pé e Cristo que se assentou.',
      'O alerta de Paulo aos Gálatas contra começar no Espírito e tentar terminar na carne.',
      'Como servir a igreja com alegria leve, sem esgotamento nem culpa por performance.',
    ],
  },
  {
    id: 'identidade-de-filho',
    index: '05',
    title: 'De Servo a Filho: Livre Acesso ao Trono',
    category: 'Vida em Cristo',
    duration: '45 min',
    summary:
      'Desconstruindo a mentalidade de órfão e de desempenho para desfrutar da comunhão sem medo, da Ceia do Senhor e da paternidade de Deus.',
    scriptureRef: 'Gálatas 4:7 · Hebreus 4:16',
    excerptQuote:
      '“O véu foi rasgado de alto a baixo. Você não se aproxima do trono da graça como quem pede esmola, mas como filho amado que tem lugar à mesa.”',
    keyPoints: [
      'O Espírito de adoção que nos faz clamar “Aba, Pai” em vez de fugir de Deus.',
      'A Ceia do Senhor como celebração da graça e da cura, e não tribunal de condenação.',
      'Chegar com confiança ao trono da graça exatamente nos dias em que nos sentimos mais fracos.',
    ],
  },
];

export const GRACE_SCRIPTURES: GraceScripture[] = [
  {
    id: '2co-12-9',
    reference: '2 Coríntios 12:9',
    theme: 'Força na Fraqueza',
    verse:
      'A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.',
    reflection:
      'Deus nunca procurou super-heróis espirituais para falar do Evangelho. Ele escolhe pessoas comuns e imperfeitas justamente para que fique claro que toda a força, o consolo e a transformação vêm exclusivamente de Jesus.',
  },
  {
    id: 'rm-5-17',
    reference: 'Romanos 5:17',
    theme: 'Reinar em Vida',
    verse:
      'Muito mais os que recebem a abundância da graça e o dom da justiça reinarão em vida por meio de um só, Jesus Cristo.',
    reflection:
      'Repare no verbo usado por Paulo: não é “merecer”, é “receber”. Quando recebemos a graça abundante e o presente da justiça pela fé, deixamos de viver esmagados pela culpa e começamos a caminhar em liberdade.',
  },
  {
    id: '2co-5-21',
    reference: '2 Coríntios 5:21',
    theme: 'Justiça em Cristo',
    verse:
      'Aquele que não conheceu pecado, Deus o fez pecado por nós; para que nele fôssemos feitos justiça de Deus.',
    reflection:
      'A cruz foi a troca mais generosa da história. Jesus levou sobre Si tudo o que nos condenava, para que hoje o Pai olhe para nós revestidos da própria justiça do Filho amado.',
  },
  {
    id: 'hb-4-16',
    reference: 'Hebreus 4:16',
    theme: 'Trono da Graça',
    verse:
      'Cheguemo-nos, pois, com confiança ao trono da graça, para que possamos alcançar misericórdia e achar graça, a fim de sermos ajudados em tempo oportuno.',
    reflection:
      'O trono de Deus para quem está em Cristo não é um trono de julgamento — é um trono de graça. Nos dias difíceis, em vez de se afastar com vergonha, você tem livre acesso para correr para perto do Pai.',
  },
];

export function filterMinistryMessages(
  messages: MinistryMessage[],
  category: string
): MinistryMessage[] {
  if (category === 'Todas') return messages;
  return messages.filter((msg) => msg.category === category);
}

export function getNextTabIndex(
  currentIndex: number,
  key: string,
  total: number
): number | null {
  if (total <= 0) return null;
  if (key === 'ArrowRight') return (currentIndex + 1) % total;
  if (key === 'ArrowLeft') return (currentIndex - 1 + total) % total;
  if (key === 'Home') return 0;
  if (key === 'End') return total - 1;
  return null;
}

export const HIGHLIGHT_CLIP_SECONDS = 30;

export function shouldLoopHighlightClip(
  currentTime: number,
  maxSeconds = HIGHLIGHT_CLIP_SECONDS
): boolean {
  return Number.isFinite(currentTime) && currentTime >= maxSeconds;
}

export function computeHighlightProgress(
  currentTime: number,
  durationSeconds: number,
  maxSeconds = HIGHLIGHT_CLIP_SECONDS
): number {
  const effectiveDuration = Math.min(
    maxSeconds,
    Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : maxSeconds
  );
  if (effectiveDuration <= 0 || !Number.isFinite(currentTime)) return 0;
  return Math.max(0, Math.min(100, (currentTime / effectiveDuration) * 100));
}

export function formatSeconds(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function polarToCartesian(center: Point, radius: number, angleDeg: number): Point {
  const rad = degToRad(angleDeg);
  return {
    x: Number((center.x + radius * Math.cos(rad)).toFixed(2)),
    y: Number((center.y + radius * Math.sin(rad)).toFixed(2)),
  };
}

export function computeArcLength(radius: number, startDeg: number, endDeg: number): number {
  const deltaRad = Math.abs(degToRad(endDeg - startDeg));
  return Number((radius * deltaRad).toFixed(2));
}

export function describeArcPath(
  center: Point,
  radius: number,
  startDeg: number,
  endDeg: number
): string {
  const start = polarToCartesian(center, radius, startDeg);
  const end = polarToCartesian(center, radius, endDeg);
  const largeArcFlag = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export function buildComputedArcs(
  specs: ArcStatSpec[] = ARC_STATS,
  center: Point = ARC_CENTER
): ComputedArcStat[] {
  return specs.map((spec, index) => {
    const start = polarToCartesian(center, spec.radius, spec.startDeg);
    const end = polarToCartesian(center, spec.radius, spec.endDeg);
    const dot = polarToCartesian(center, spec.radius, spec.dotDeg);
    const pathD = describeArcPath(center, spec.radius, spec.startDeg, spec.endDeg);
    const arcLength = computeArcLength(spec.radius, spec.startDeg, spec.endDeg);
    const lineDelay = Number((0.4 + index * 0.22).toFixed(2));
    const markDelay = Number((lineDelay + 0.9).toFixed(2));

    return {
      ...spec,
      start,
      end,
      dot,
      pathD,
      arcLength,
      lineDelay,
      markDelay,
      ringDelay: Number((markDelay + 0.3).toFixed(2)),
      valueDelay: Number((markDelay + 0.15).toFixed(2)),
      labelDelay: Number((markDelay + 0.3).toFixed(2)),
    };
  });
}

export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function computeGridParallaxTarget(
  clientPos: number,
  viewportSize: number,
  maxOffset = 16
): number {
  if (viewportSize <= 0) return 0;
  const normalized = Math.max(0, Math.min(1, clientPos / viewportSize));
  return (normalized - 0.5) * maxOffset;
}

export type InvitationField = 'organizer' | 'city' | 'email';

export interface InvitationInput {
  organizer: string;
  city: string;
  email: string;
}

export interface InvitationValidationError {
  field: InvitationField;
  message: string;
}

export function validateReservationEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Informe um e-mail para retorno.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return 'Informe um e-mail válido (ex.: contato@igreja.com.br).';
  }
  return null;
}

export function validateInvitationForm(
  input: InvitationInput
): InvitationValidationError | null {
  if (!input.organizer.trim()) {
    return {
      field: 'organizer',
      message: 'Informe seu nome ou o nome da igreja/evento.',
    };
  }
  if (!input.city.trim()) {
    return {
      field: 'city',
      message: 'Informe a cidade e estado do encontro.',
    };
  }
  const emailError = validateReservationEmail(input.email);
  if (emailError) {
    return {
      field: 'email',
      message: emailError,
    };
  }
  return null;
}

export interface OptimizedImageSources {
  avifSrcSet: string;
  webpSrcSet: string;
  jpgSrcSet: string;
  fallbackSrc: string;
  primaryWebpSrc: string;
}

export function buildOptimizedImageSources(
  slug: string,
  widths: readonly number[] = [640, 1200]
): OptimizedImageSources {
  const sorted = [...widths].filter((w) => w > 0).sort((a, b) => a - b);
  const effective = sorted.length > 0 ? sorted : [640, 1200];
  const largest = effective[effective.length - 1];

  return {
    avifSrcSet: effective
      .map((w) => `/assets/optimized/${slug}-${w}w.avif ${w}w`)
      .join(', '),
    webpSrcSet: effective
      .map((w) => `/assets/optimized/${slug}-${w}w.webp ${w}w`)
      .join(', '),
    jpgSrcSet: effective
      .map((w) => `/assets/optimized/${slug}-${w}w.jpg ${w}w`)
      .join(', '),
    fallbackSrc: `/assets/optimized/${slug}-${largest}w.jpg`,
    primaryWebpSrc: `/assets/optimized/${slug}-${largest}w.webp`,
  };
}

export interface MinistryGalleryPhoto {
  id: string;
  slug: string;
  widths: readonly number[];
  title: string;
  tag: string;
  caption: string;
  alt: string;
  aspectClass: string;
  objectPositionClass?: string;
}

export interface MinistryVideoClip {
  id: string;
  title: string;
  tag: string;
  duration: string;
  caption: string;
  videoSrc: string;
  posterSlug: string;
}

export const MINISTRY_GALLERY_PHOTOS: MinistryGalleryPhoto[] = [
  {
    id: 'stage-live',
    slug: 'stage-live',
    widths: [640, 1200],
    title: 'Ministração ao Vivo',
    tag: 'PALAVRA AO VIVO',
    caption:
      'Compartilhando a graça e a suficiência de Jesus com alegria e simplicidade na igreja local.',
    alt: 'Maestri ministrando ao vivo com microfone sob iluminação de palco',
    aspectClass: 'aspect-[16/10]',
    objectPositionClass: 'object-center',
  },
  {
    id: 'youth-pulpit',
    slug: 'youth-pulpit',
    widths: [640, 1024],
    title: 'Desde Cedo na Casa de Deus',
    tag: 'HISTÓRIA',
    caption:
      'Os primeiros passos no púlpito ainda jovem — uma caminhada construída pela graça ao longo dos anos.',
    alt: 'Registro restaurado de Maestri ainda jovem falando ao microfone no púlpito da igreja',
    aspectClass: 'aspect-square',
    objectPositionClass: 'object-top',
  },
  {
    id: 'beige-pulpit',
    slug: 'beige-pulpit',
    widths: [640, 1200],
    title: 'A Mesa da Graça (Mateus 15:27)',
    tag: 'PREGAÇÃO',
    caption:
      'Ministrando na igreja local sobre a fé que descansa na generosidade da mesa de Jesus.',
    alt: 'Maestri pregando no púlpito com terno bege e Mateus 15:27 projetado ao fundo',
    aspectClass: 'aspect-[16/10]',
    objectPositionClass: 'object-[50%_20%]',
  },
  {
    id: 'blazer-preach',
    slug: 'blazer-preach',
    widths: [640, 1200],
    title: 'Palavra Aberta na Igreja Local',
    tag: 'ENSINO',
    caption:
      'Compartilhando as Escrituras com simplicidade, proximidade e foco total na obra de Cristo.',
    alt: 'Maestri ministrando ao lado do púlpito com blazer marrom e microfone',
    aspectClass: 'aspect-[16/10]',
    objectPositionClass: 'object-[50%_18%]',
  },
  {
    id: 'couple-blessing',
    slug: 'couple-blessing',
    widths: [640, 1200],
    title: 'Família, Comunhão e Cobertura',
    tag: 'ALTAR & FAMÍLIA',
    caption:
      'Recebendo oração junto à esposa no altar — o ministério nasce primeiro em casa e na comunhão dos irmãos.',
    alt: 'Maestri e sua esposa recebendo oração de um pastor no altar da igreja',
    aspectClass: 'aspect-[16/10]',
    objectPositionClass: 'object-[50%_35%]',
  },
  {
    id: 'baby-dedication',
    slug: 'baby-dedication',
    widths: [640, 1200],
    title: 'Apresentação e Bênção de Famílias',
    tag: 'IGREJA LOCAL',
    caption:
      'Celebrando a vida e abençoando cada geração junto às famílias da igreja local.',
    alt: 'Maestri segurando um bebê recém-nascido no púlpito cercado pela família em oração',
    aspectClass: 'aspect-[16/10]',
    objectPositionClass: 'object-[50%_40%]',
  },
];

export function getMinistryPhotoById(id: string): MinistryGalleryPhoto {
  return (
    MINISTRY_GALLERY_PHOTOS.find((photo) => photo.id === id) ??
    MINISTRY_GALLERY_PHOTOS[0]
  );
}

export const MINISTRY_VIDEO_CLIPS: MinistryVideoClip[] = [
  {
    id: 'nova-natureza',
    title: 'Salvo pela Graça, Nova Natureza',
    tag: 'PREGAÇÃO',
    duration: '0:30',
    caption:
      '“Você não para de pecar para ir pro céu — você para de pecar porque foi salvo por Jesus.”',
    videoSrc: '/assets/videos/nova-natureza.mp4',
    posterSlug: 'poster-nova-natureza',
  },
  {
    id: 'guiado-pelo-espirito',
    title: 'Guiado pelo Espírito Santo',
    tag: 'MINISTRAÇÃO',
    duration: '0:19',
    caption:
      'Vivendo sob a direção do Espírito Santo, livre do peso do esforço humano.',
    videoSrc: '/assets/videos/guiado-pelo-espirito.mp4',
    posterSlug: 'poster-guiado-pelo-espirito',
  },
  {
    id: 'ceia-do-senhor',
    title: 'Precioso pra Mim é Jesus',
    tag: 'CEIA DO SENHOR',
    duration: '0:24',
    caption:
      'Adoração simples ao redor da mesa da Ceia celebrando o sacrifício perfeito de Cristo.',
    videoSrc: '/assets/videos/ceia-do-senhor.mp4',
    posterSlug: 'poster-ceia-do-senhor',
  },
  {
    id: 'adoracao-igreja',
    title: 'Adoração na Igreja Local',
    tag: 'CULTO AO VIVO',
    duration: '0:25',
    caption:
      'Momento de louvor e entrega com a igreja reunida em comunhão.',
    videoSrc: '/assets/videos/adoracao-igreja.mp4',
    posterSlug: 'poster-adoracao-igreja',
  },
];

export interface ScrollSpySectionMetric {
  navId: string;
  top: number;
}

export function computeActiveNavSection(
  sections: readonly ScrollSpySectionMetric[],
  scrollY: number,
  viewportHeight: number,
  documentHeight: number
): string {
  if (sections.length === 0) return 'inicio';

  const safeScrollY = Math.max(0, scrollY);
  if (safeScrollY <= 40) {
    return sections[0].navId;
  }

  if (
    documentHeight > 0 &&
    viewportHeight > 0 &&
    safeScrollY + viewportHeight >= documentHeight - 40
  ) {
    return sections[sections.length - 1].navId;
  }

  const anchorOffset = Math.min(Math.max(viewportHeight * 0.32, 120), 280);
  const anchorY = safeScrollY + anchorOffset;

  let active = sections[0].navId;
  for (const section of sections) {
    if (section.top <= anchorY) {
      active = section.navId;
    } else {
      break;
    }
  }

  return active;
}

