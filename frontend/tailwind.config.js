/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de la tienda: negro, azul, azul claro y blanco. Los mismos valores
        // existen como variables CSS en src/index.css (:root) para los componentes
        // de components/ui que usan color-mix().
        ink: '#04070D',       // fondo principal (casi negro)
        surface: '#090F19',   // tarjetas / superficies elevadas
        surface2: '#111C2D',  // superficies aún más elevadas (hover, inputs)
        azure: '#1E6BFF',     // acento principal (azul)
        azureSoft: '#4F8DFF',
        // Azul oscuro reservado al hover de los botones azules: mantiene el texto
        // blanco por encima de 4.5:1 de contraste, que `azure` ya no garantiza.
        azureDeep: '#0B4CD6',
        sky: '#6FD3FF',       // acento secundario (azul claro)
        skySoft: '#A9E7FF',
        steel: '#8CA3C2',     // texto secundario
        mist: '#F2F8FF',      // texto principal sobre fondo oscuro (blanco)
        danger: '#FF6B81',    // reservado a errores: nunca decorativo

        // Nombres semánticos (shadcn) que esperan los componentes de components/ui.
        background: '#04070D',
        foreground: '#F2F8FF',
        primary: '#1E6BFF',
        secondary: '#6FD3FF',
        destructive: '#FF6B81',
        border: '#18243A',
        'muted-foreground': '#8CA3C2',
      },
      keyframes: {
        'scroll-cue': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
