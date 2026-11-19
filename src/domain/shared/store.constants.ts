export const STORE_INFO = {
  name: 'La casita de Mathi',
  shortName: 'La casita',
  accentName: 'Mathi',
  tagline: 'Accesorios para celular con atención cercana y estilo.',
  whatsappNumber: '51986983274',
  whatsappDisplay: '+51 986 983 274',
  defaultWhatsappMessage:
    'Hola, vengo de la página web de La casita de Mathi. Quisiera información sobre sus productos.',
  address: 'Arica 320',
  schedule: {
    weekdays: 'Lunes a sábado: 8:00 a. m. – 8:30 p. m.',
    sunday: 'Domingo: 8:00 a. m. – 6:00 p. m.',
  },
  currency: 'S/',
  defaultCasePrice: 35,
  defaultMicaAddonPrice: 10,
} as const;

export const CATEGORY_META = {
  fundas: {
    label: 'Fundas',
    shortDesc: 'Transparentes, de color entero y con diseño.',
    priceHint: 'Desde S/ 35',
  },
  protectores: {
    label: 'Protectores',
    shortDesc: 'Vidrio templado para pantalla y cámara.',
    priceHint: 'Desde S/ 20',
  },
  cables: {
    label: 'Cables',
    shortDesc: 'USB-C, Lightning, V8 y 3 en 1.',
    priceHint: 'Desde S/ 20',
  },
  cargadores: {
    label: 'Cargadores',
    shortDesc: 'Carga rápida de pared, auto e inalámbricos.',
    priceHint: 'Desde S/ 20',
  },
  audifonos: {
    label: 'Audífonos',
    shortDesc: 'Inalámbricos, diadema, USB-C, Jack y Lightning.',
    priceHint: 'Desde S/ 20',
  },
} as const;
