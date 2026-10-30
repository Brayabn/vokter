// Paleta de VOKTER móvil: negro, azul, azul claro y blanco.
// Los mismos valores que frontend/tailwind.config.js, para que web y app se vean
// como la misma tienda.
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
  azureDeep: '#0B4CD6',
  sky: '#6FD3FF',       // acento secundario y texto de acento (azul claro)
  skySoft: '#A9E7FF',
  steel: '#8CA3C2',     // texto secundario
  mist: '#F2F8FF',      // texto principal (blanco)
  danger: '#FF6B81',    // reservado a errores
};

// Bordes de un píxel: casi invisibles pero suficientes para separar superficies
// sobre un fondo negro.
export const hairline = 'rgba(111,211,255,0.16)';
export const veil = 'rgba(255,255,255,0.06)';

export const radius = { sm: 12, md: 18, lg: 24, pill: 999 };

// Resplandor azul de las superficies destacadas (Android usa elevation).
export const glow = {
  shadowColor: colors.azure,
  shadowOpacity: 0.35,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 10,
};

// Altura que deja libre la barra de pestañas flotante: las listas y los scrolls
// añaden este espacio abajo para que el último elemento no quede debajo.
export const TAB_BAR_SPACE = 104;
