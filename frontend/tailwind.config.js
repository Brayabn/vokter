/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Paleta de la tienda: negro, azul, azul claro y blanco. Cada color apunta a
      // una variable CSS definida en src/index.css, cuyo valor cambia con el tema
      // (:root = oscuro, [data-theme="light"] = claro). Se guardan como canales RGB
      // sueltos ("30 107 255") para que sigan funcionando los modificadores de
      // opacidad de Tailwind: bg-ink/80, text-steel/70, border-hairline/10...
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',             // fondo principal
        surface: 'rgb(var(--surface) / <alpha-value>)',     // tarjetas / superficies elevadas
        surface2: 'rgb(var(--surface2) / <alpha-value>)',   // superficies aún más elevadas (hover, inputs)
        azure: 'rgb(var(--azure) / <alpha-value>)',         // acento principal (azul)
        azureSoft: 'rgb(var(--azure-soft) / <alpha-value>)',
        // Azul oscuro reservado al hover de los botones azules: mantiene el texto
        // blanco por encima de 4.5:1 de contraste, que `azure` ya no garantiza.
        azureDeep: 'rgb(var(--azure-deep) / <alpha-value>)',
        sky: 'rgb(var(--sky) / <alpha-value>)',             // acento secundario
        skySoft: 'rgb(var(--sky-soft) / <alpha-value>)',
        steel: 'rgb(var(--steel) / <alpha-value>)',         // texto secundario
        mist: 'rgb(var(--mist) / <alpha-value>)',           // texto principal sobre el fondo
        danger: 'rgb(var(--danger) / <alpha-value>)',       // reservado a errores: nunca decorativo

        // Tinta de bordes y veladuras sutiles: blanco en oscuro, tinta de marca en
        // claro. Así `border-hairline/10` da una línea tenue en ambos temas sin
        // tocar la clase. Sustituye a los white/10 y black/20 fijos.
        hairline: 'rgb(var(--hairline) / <alpha-value>)',

        // Texto y iconos sobre el azul de acento. Se mantiene blanco en ambos
        // temas: `mist` no sirve porque en el claro es azul oscuro y perdería
        // el contraste sobre el botón.
        onAccent: 'rgb(var(--on-accent) / <alpha-value>)',

        // Nombres semánticos (shadcn) que esperan los componentes de components/ui.
        background: 'rgb(var(--ink) / <alpha-value>)',
        foreground: 'rgb(var(--mist) / <alpha-value>)',
        primary: 'rgb(var(--azure) / <alpha-value>)',
        secondary: 'rgb(var(--sky) / <alpha-value>)',
        destructive: 'rgb(var(--danger) / <alpha-value>)',
        border: 'rgb(var(--line) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--steel) / <alpha-value>)',
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
