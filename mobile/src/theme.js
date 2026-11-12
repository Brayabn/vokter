// Sistema de diseño de VOKTER móvil: el mismo que la web (frontend/tailwind.config.js y
// frontend/src/index.css), traducido a React Native para que la app se vea como la tienda
// web en un teléfono. Si cambias un valor aquí, cámbialo también en esos dos archivos.
//
// Regla de contraste que hay que mantener al añadir pantallas:
//   - `azure` es oscuro: encima va texto `mist` (blanco), nunca `ink`.
//   - `sky` es claro: encima va texto `ink` (negro), nunca blanco.
//   - `sky` es además el color del texto de acento sobre fondo oscuro.
export const colors = {
  // Identidad de VOKTER: negro azulado, azul electrico y celeste. Es la misma
  // linea grafica que la web, para que app y sitio se lean como una sola
  // plataforma.
  //
  // REGLAS DE CONTRASTE (verificadas con WCAG, no estimadas):
  //   - `azure` como FONDO lleva texto `onAzure` (blanco puro): 4.68:1.
  //     Con `mist` encima solo daria 4.08:1, por debajo del minimo AA.
  //   - `azure` NO se usa como texto pequeno sobre fondo oscuro (4.28:1).
  //     Para texto de acento va `sky`, que da 12.46:1.
  ink: '#05080F',       // fondo principal de la app
  surface: '#0B1422',   // tarjetas
  surface2: '#121E30',  // inputs y superficies elevadas
  azure: '#2168FF',     // azul electrico: botones, pestana activa, seleccion
  azureSoft: '#4F8DFF',
  azureDeep: '#1450D6', // pulsado de los botones azules
  sky: '#70D9FF',       // celeste: texto de acento, cuotas, etiquetas
  skySoft: '#A9E7FF',
  steel: '#91A4BF',     // texto secundario (gris azulado)
  mist: '#E8F0FC',      // texto principal
  onAzure: '#FFFFFF',   // unico color admitido encima de `azure`
  border: '#263A52',    // bordes discretos de tarjetas y separadores
  danger: '#FF6B81',    // reservado a errores: nunca decorativo
  live: '#4ADE80',      // indicador de "en vivo" (10.6:1 sobre tarjeta)
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
  azure10: 'rgba(33,104,255,0.10)',
  azure15: 'rgba(33,104,255,0.15)',
  azure25: 'rgba(33,104,255,0.25)',
  azure60: 'rgba(33,104,255,0.60)',
  sky10: 'rgba(112,217,255,0.10)',
  sky15: 'rgba(112,217,255,0.15)',
  sky30: 'rgba(112,217,255,0.30)',
  sky40: 'rgba(112,217,255,0.40)',
  border60: 'rgba(38,58,82,0.60)',
  live15: 'rgba(74,222,128,0.15)',
  live40: 'rgba(74,222,128,0.40)',
  danger10: 'rgba(255,107,129,0.10)',
  danger30: 'rgba(255,107,129,0.30)',
};

// Bordes de un píxel: casi invisibles pero suficientes para separar superficies.
// Borde de un pixel entre superficies. Antes era blanco al 10%; ahora hay un
// color de borde propio en la paleta.
export const hairline = colors.border;

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
  azure: ['#A9E7FF', '#70D9FF', '#2168FF'],
  mist: ['#FFFFFF', 'rgba(232,240,252,0.55)'],
  bar: [colors.azure, colors.sky],
};

export const radius = { sm: 12, md: 16, lg: 20, xl: 24, pill: 999 };

// Superficie de las GlowCard de la web (--backdrop y --backup-border de spotlight-card.jsx).
export const card = {
  backgroundColor: 'rgba(11,20,34,0.74)',
  borderColor: 'rgba(38,58,82,0.9)',
  borderWidth: 1.5,
  borderRadius: radius.lg,
};

// Sombras con la misma sintaxis que la web (boxShadow existe en la nueva arquitectura de
// React Native, en Android y en iOS): shadow-[0_0_30px_-10px_rgba(33,104,255,0.8)], etc.
export const glow = { boxShadow: '0px 0px 30px -10px rgba(33,104,255,0.8)' };
export const glowStrong = { boxShadow: '0px 0px 40px -8px rgba(33,104,255,0.9)' };
export const glowSky = { boxShadow: '0px 0px 30px -12px rgba(112,217,255,0.9)' };
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
