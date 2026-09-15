/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12172B',       // fondo principal
        surface: '#1B2140',   // tarjetas / superficies elevadas
        surface2: '#242B4D',  // superficies aún más elevadas (hover, inputs)
        gold: '#E8B04B',      // acento principal
        goldSoft: '#F3D08A',
        lavender: '#A8AEC4',  // texto secundario
        mist: '#E7E9F2',      // texto principal sobre fondo oscuro
        success: '#4ADE80',
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
