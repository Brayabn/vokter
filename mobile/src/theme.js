// Sistema de diseño de VOKTER móvil: el mismo que la web (frontend/tailwind.config.js y
// frontend/src/index.css), traducido a React Native para que la app se vea como la tienda
// web en un teléfono. Si cambias un valor aquí, cámbialo también en esos dos archivos.
//
// Regla de contraste que hay que mantener al añadir pantallas:
//   - `azure` es oscuro: encima va texto `mist` (blanco), nunca `ink`.
//   - `sky` es claro: encima va texto `ink` (negro), nunca blanco.
//   - `sky` es además el color del texto de acento sobre fondo oscuro.
export const colors = {
  ink: '#04070D',       // fondo de la app (casi negro)
  surface: '#090F19',   // tarjetas
  surface2: '#111C2D',  // inputs y superficies elevadas
  azure: '#1E6BFF',     // acento principal (azul)
  azureSoft: '#4F8DFF',
  azureDeep: '#0B4CD6', // pulsado de los botones azules
  sky: '#6FD3FF',       // acento secundario y texto de acento (azul claro)
  skySoft: '#A9E7FF',
  steel: '#8CA3C2',     // texto secundario
  mist: '#F2F8FF',      // texto principal (blanco)
  danger: '#FF6B81',    // reservado a errores: nunca decorativo
};

// Equivalentes de las opacidades de Tailwind que usa la web (border-white/10, bg-sky/15...).
export const alpha = {
  white3: 'rgba(255,255,255,0.03)',
  white5: 'rgba(255,255,255,0.05)',
  white10: 'rgba(255,255,255,0.10)',
  white15: 'rgba(255,255,255,0.15)',
  white25: 'rgba(255,255,255,0.25)',
  ink80: 'rgba(4,7,13,0.80)',
  ink85: 'rgba(4,7,13,0.85)',
  azure10: 'rgba(30,107,255,0.10)',
  azure15: 'rgba(30,107,255,0.15)',
  azure25: 'rgba(30,107,255,0.25)',
  azure60: 'rgba(30,107,255,0.60)',
  sky10: 'rgba(111,211,255,0.10)',
  sky15: 'rgba(111,211,255,0.15)',
  sky30: 'rgba(111,211,255,0.30)',
  sky40: 'rgba(111,211,255,0.40)',
  danger10: 'rgba(255,107,129,0.10)',
  danger30: 'rgba(255,107,129,0.30)',
};

// Bordes de un píxel: casi invisibles pero suficientes para separar superficies.
export const hairline = alpha.white10;

// Tipografías de la web: Sora (titulares), Inter (texto) e IBM Plex Mono (etiquetas,
// precios, porcentajes). Se cargan en App.js; en React Native el peso va en el nombre
// de la fuente, no en fontWeight.
export const fonts = {
  display: 'Sora_700Bold',
  displaySemi: 'Sora_600SemiBold',
  displayHeavy: 'Sora_800ExtraBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoSemi: 'IBMPlexMono_600SemiBold',
  monoBold: 'IBMPlexMono_700Bold',
};

// Degradados de los titulares (.text-gradient-azure / .text-gradient-mist de la web).
export const gradients = {
  azure: ['#A9E7FF', '#6FD3FF', '#1E6BFF'],
  mist: ['#FFFFFF', 'rgba(242,248,255,0.55)'],
  bar: [colors.azure, colors.sky],
};

export const radius = { sm: 12, md: 16, lg: 20, xl: 24, pill: 999 };

// Superficie de las GlowCard de la web (--backdrop y --backup-border de spotlight-card.jsx).
export const card = {
  backgroundColor: 'rgba(6,11,20,0.74)',
  borderColor: 'rgba(34,53,79,0.9)',
  borderWidth: 1.5,
  borderRadius: radius.lg,
};

// Sombras con la misma sintaxis que la web (boxShadow existe en la nueva arquitectura de
// React Native, en Android y en iOS): shadow-[0_0_30px_-10px_rgba(30,107,255,0.8)], etc.
export const glow = { boxShadow: '0px 0px 30px -10px rgba(30,107,255,0.8)' };
export const glowStrong = { boxShadow: '0px 0px 40px -8px rgba(30,107,255,0.9)' };
export const glowSky = { boxShadow: '0px 0px 30px -12px rgba(111,211,255,0.9)' };
export const cardShadow = { boxShadow: '0px 16px 32px -16px rgba(0,0,0,1)' };

// Etiqueta "CATÁLOGO", "TU PANEL"...: font-mono text-xs uppercase tracking-[0.3em] text-sky
export const kicker = {
  fontFamily: fonts.monoMedium,
  fontSize: 11,
  letterSpacing: 3.3,
  textTransform: 'uppercase',
  color: colors.sky,
};

// Margen lateral de las páginas (px-6 de la web).
export const PAGE_PADDING = 24;
