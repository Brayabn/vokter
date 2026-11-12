/**
 * DATOS DEPORTIVOS DE DEMOSTRACIÓN.
 *
 * VOKTER no tiene contratado ningún proveedor de datos deportivos ni ninguna
 * casa de apuestas. Todo lo que hay aquí está INVENTADO para poder enseñar la
 * interfaz: marcadores, minutos y cuotas no corresponden a encuentros reales.
 *
 * Por eso cada registro va marcado con `isDemo` y la API lo devuelve siempre
 * acompañado de un aviso, para que ninguna pantalla pueda presentarlos como
 * información verificada. La app no acepta dinero: no hay apuestas, ni
 * depósitos, ni retiros.
 *
 * Los nombres de clubes y selecciones son reales porque el objetivo es que la
 * maqueta resulte reconocible; los resultados y las cuotas, no.
 */

const LEAGUES = [
  { slug: 'liga-betplay', name: 'Liga BetPlay', country: 'Colombia', icon: '🇨🇴', season: '2026-II', position: 1 },
  { slug: 'copa-betplay', name: 'Copa BetPlay', country: 'Colombia', icon: '🏆', season: '2026', position: 2 },
  { slug: 'mundial-2026', name: 'Mundial 2026', country: 'Internacional', icon: '🌎', season: '2026', position: 3 },
  { slug: 'libertadores', name: 'Copa Libertadores', country: 'Sudamérica', icon: '🥇', season: '2026', position: 4 },
];

// El color es el de la insignia que dibuja la app (no hay escudos externos).
const TEAMS = [
  { name: 'Atlético Nacional', shortName: 'Nacional', initials: 'NAC', color: '#1B8A3A', country: 'Colombia' },
  { name: 'Millonarios', shortName: 'Millonarios', initials: 'MIL', color: '#1E4FBF', country: 'Colombia' },
  { name: 'América de Cali', shortName: 'América', initials: 'AME', color: '#C62828', country: 'Colombia' },
  { name: 'Junior', shortName: 'Junior', initials: 'JUN', color: '#E53935', country: 'Colombia' },
  { name: 'Deportivo Cali', shortName: 'Cali', initials: 'CAL', color: '#1B5E20', country: 'Colombia' },
  { name: 'Independiente Santa Fe', shortName: 'Santa Fe', initials: 'SFE', color: '#A01722', country: 'Colombia' },
  { name: 'Once Caldas', shortName: 'Once Caldas', initials: 'ONC', color: '#455A64', country: 'Colombia' },
  { name: 'Deportes Tolima', shortName: 'Tolima', initials: 'TOL', color: '#8E6B1F', country: 'Colombia' },
  { name: 'Independiente Medellín', shortName: 'Medellín', initials: 'DIM', color: '#B0203A', country: 'Colombia' },
  { name: 'Atlético Bucaramanga', shortName: 'Bucaramanga', initials: 'BUC', color: '#5B8C21', country: 'Colombia' },
  { name: 'Colombia', shortName: 'Colombia', initials: 'COL', color: '#C8A415', country: 'Selección' },
  { name: 'Argentina', shortName: 'Argentina', initials: 'ARG', color: '#4A9FD4', country: 'Selección' },
  { name: 'Brasil', shortName: 'Brasil', initials: 'BRA', color: '#C9A227', country: 'Selección' },
  { name: 'Uruguay', shortName: 'Uruguay', initials: 'URU', color: '#2F7FC1', country: 'Selección' },
];

/**
 * Encuentros. `startsInHours` es un desplazamiento respecto al momento de la
 * siembra: negativo = ya ocurrió, positivo = está por jugarse. Se guarda como
 * fecha absoluta, pero se vuelve a calcular en cada arranque para que la
 * maqueta no envejezca (ver seedSports.js). Solo afecta a filas `isDemo`.
 *
 * Los mercados se definen con sus opciones y cuotas. `type` le dice a la app
 * cómo dibujarlas.
 */
const MATCHES = [
  {
    code: 'LB-01',
    league: 'liga-betplay',
    home: 'Atlético Nacional', away: 'Millonarios',
    startsInHours: -0.7, status: 'live', minute: 41, homeScore: 1, awayScore: 0,
    stadium: 'Atanasio Girardot', isPopular: true,
    markets: [
      { type: '1X2', name: 'Ganador del partido', position: 1, isPopular: true, odds: [
        { label: '1', description: 'Gana Atlético Nacional', value: 1.72 },
        { label: 'X', description: 'Empate', value: 3.40 },
        { label: '2', description: 'Gana Millonarios', value: 4.80 },
      ] },
      { type: 'OVER_UNDER', name: 'Más / Menos goles 2.5', position: 2, isPopular: true, odds: [
        { label: 'Más 2.5', description: 'Tres goles o más', value: 2.05 },
        { label: 'Menos 2.5', description: 'Dos goles o menos', value: 1.78 },
      ] },
      { type: 'BTTS', name: 'Ambos equipos marcan', position: 3, isPopular: true, odds: [
        { label: 'Sí', description: 'Marcan los dos', value: 1.95 },
        { label: 'No', description: 'Al menos uno no marca', value: 1.85 },
      ] },
      { type: 'DOUBLE_CHANCE', name: 'Doble oportunidad', position: 4, odds: [
        { label: '1X', description: 'Gana Nacional o empate', value: 1.22 },
        { label: '12', description: 'Gana cualquiera, sin empate', value: 1.30 },
        { label: 'X2', description: 'Gana Millonarios o empate', value: 2.00 },
      ] },
    ],
  },
  {
    code: 'LB-02',
    league: 'liga-betplay',
    home: 'América de Cali', away: 'Junior',
    startsInHours: -1.2, status: 'live', minute: 68, homeScore: 2, awayScore: 2,
    stadium: 'Pascual Guerrero', isPopular: true,
    markets: [
      { type: '1X2', name: 'Ganador del partido', position: 1, isPopular: true, odds: [
        { label: '1', description: 'Gana América de Cali', value: 2.30 },
        { label: 'X', description: 'Empate', value: 3.10 },
        { label: '2', description: 'Gana Junior', value: 2.90 },
      ] },
      { type: 'OVER_UNDER', name: 'Más / Menos goles 4.5', position: 2, odds: [
        { label: 'Más 4.5', description: 'Cinco goles o más', value: 3.60 },
        { label: 'Menos 4.5', description: 'Cuatro goles o menos', value: 1.28 },
      ] },
      { type: 'CORRECT_SCORE', name: 'Marcador exacto', position: 3, isPopular: true, odds: [
        { label: '2-2', description: 'Termina 2-2', value: 4.50 },
        { label: '3-2', description: 'Termina 3-2', value: 7.00 },
        { label: '2-3', description: 'Termina 2-3', value: 8.50 },
      ] },
    ],
  },
  {
    code: 'LB-03',
    league: 'liga-betplay',
    home: 'Deportivo Cali', away: 'Independiente Santa Fe',
    startsInHours: 3, status: 'scheduled', stadium: 'Deportivo Cali', isPopular: true,
    markets: [
      { type: '1X2', name: 'Ganador del partido', position: 1, isPopular: true, odds: [
        { label: '1', description: 'Gana Deportivo Cali', value: 2.45 },
        { label: 'X', description: 'Empate', value: 3.05 },
        { label: '2', description: 'Gana Santa Fe', value: 2.80 },
      ] },
      { type: 'BTTS', name: 'Ambos equipos marcan', position: 2, odds: [
        { label: 'Sí', description: 'Marcan los dos', value: 1.88 },
        { label: 'No', description: 'Al menos uno no marca', value: 1.90 },
      ] },
    ],
  },
  {
    code: 'LB-04',
    league: 'liga-betplay',
    home: 'Once Caldas', away: 'Deportes Tolima',
    startsInHours: 26, status: 'scheduled', stadium: 'Palogrande',
    markets: [
      { type: '1X2', name: 'Ganador del partido', position: 1, odds: [
        { label: '1', description: 'Gana Once Caldas', value: 2.20 },
        { label: 'X', description: 'Empate', value: 3.20 },
        { label: '2', description: 'Gana Tolima', value: 3.10 },
      ] },
    ],
  },
  {
    code: 'LB-05',
    league: 'liga-betplay',
    home: 'Independiente Medellín', away: 'Atlético Bucaramanga',
    startsInHours: -30, status: 'finished', homeScore: 1, awayScore: 3, stadium: 'Atanasio Girardot',
    markets: [
      { type: '1X2', name: 'Ganador del partido', position: 1, odds: [
        { label: '1', description: 'Gana Medellín', value: 2.05 },
        { label: 'X', description: 'Empate', value: 3.25 },
        { label: '2', description: 'Gana Bucaramanga', value: 3.40 },
      ] },
    ],
  },
  {
    code: 'CB-01',
    league: 'copa-betplay',
    home: 'Millonarios', away: 'Junior',
    startsInHours: 5, status: 'scheduled', stadium: 'El Campín', isPopular: true,
    markets: [
      { type: '1X2', name: 'Ganador del partido', position: 1, isPopular: true, odds: [
        { label: '1', description: 'Gana Millonarios', value: 1.95 },
        { label: 'X', description: 'Empate', value: 3.30 },
        { label: '2', description: 'Gana Junior', value: 3.60 },
      ] },
      { type: 'QUALIFY', name: 'Clasificación', position: 2, isPopular: true, odds: [
        { label: 'Millonarios', description: 'Pasa de ronda', value: 1.60 },
        { label: 'Junior', description: 'Pasa de ronda', value: 2.25 },
      ] },
    ],
  },
  {
    code: 'CB-02',
    league: 'copa-betplay',
    home: 'Atlético Nacional', away: 'Deportes Tolima',
    startsInHours: -52, status: 'finished', homeScore: 2, awayScore: 0, stadium: 'Atanasio Girardot',
    markets: [
      { type: 'QUALIFY', name: 'Clasificación', position: 1, odds: [
        { label: 'Atlético Nacional', description: 'Pasa de ronda', value: 1.35 },
        { label: 'Deportes Tolima', description: 'Pasa de ronda', value: 3.10 },
      ] },
    ],
  },
  {
    code: 'MU-01',
    league: 'mundial-2026',
    home: 'Colombia', away: 'Uruguay',
    startsInHours: 48, status: 'scheduled', stadium: 'Estadio Azteca', isPopular: true,
    markets: [
      { type: '1X2', name: 'Ganador del partido', position: 1, isPopular: true, odds: [
        { label: '1', description: 'Gana Colombia', value: 2.40 },
        { label: 'X', description: 'Empate', value: 3.00 },
        { label: '2', description: 'Gana Uruguay', value: 2.95 },
      ] },
      { type: 'DOUBLE_CHANCE', name: 'Doble oportunidad', position: 2, isPopular: true, odds: [
        { label: '1X', description: 'Gana Colombia o empate', value: 1.33 },
        { label: '12', description: 'Gana cualquiera, sin empate', value: 1.32 },
        { label: 'X2', description: 'Gana Uruguay o empate', value: 1.50 },
      ] },
      { type: 'OVER_UNDER', name: 'Más / Menos goles 2.5', position: 3, odds: [
        { label: 'Más 2.5', description: 'Tres goles o más', value: 2.35 },
        { label: 'Menos 2.5', description: 'Dos goles o menos', value: 1.60 },
      ] },
    ],
  },
  {
    code: 'MU-02',
    league: 'mundial-2026',
    home: 'Argentina', away: 'Brasil',
    startsInHours: 72, status: 'scheduled', stadium: 'MetLife Stadium', isPopular: true,
    markets: [
      { type: '1X2', name: 'Ganador del partido', position: 1, isPopular: true, odds: [
        { label: '1', description: 'Gana Argentina', value: 2.60 },
        { label: 'X', description: 'Empate', value: 3.15 },
        { label: '2', description: 'Gana Brasil', value: 2.65 },
      ] },
      { type: 'CORRECT_SCORE', name: 'Marcador exacto', position: 2, odds: [
        { label: '1-1', description: 'Termina 1-1', value: 6.00 },
        { label: '2-1', description: 'Termina 2-1', value: 8.00 },
        { label: '1-2', description: 'Termina 1-2', value: 8.50 },
      ] },
    ],
  },
  {
    code: 'LI-01',
    league: 'libertadores',
    home: 'Atlético Nacional', away: 'Argentina',
    startsInHours: 96, status: 'scheduled', stadium: 'Atanasio Girardot',
    markets: [
      { type: '1X2', name: 'Ganador del partido', position: 1, odds: [
        { label: '1', description: 'Gana Atlético Nacional', value: 2.75 },
        { label: 'X', description: 'Empate', value: 3.20 },
        { label: '2', description: 'Gana el visitante', value: 2.45 },
      ] },
    ],
  },
];

// Catálogo de mercados que la app sabe dibujar. Se usa en "Mercados populares".
const MARKET_TYPES = [
  { type: '1X2', name: 'Ganador del partido', icon: '🏁', hint: 'Local, empate o visitante' },
  { type: 'OVER_UNDER', name: 'Más / Menos goles', icon: '📈', hint: 'Total de goles del encuentro' },
  { type: 'BTTS', name: 'Ambos equipos marcan', icon: '🥅', hint: 'Si los dos equipos anotan' },
  { type: 'DOUBLE_CHANCE', name: 'Doble oportunidad', icon: '🛡️', hint: 'Dos resultados en una sola opción' },
  { type: 'QUALIFY', name: 'Clasificación', icon: '🎟️', hint: 'Qué equipo avanza de ronda' },
  { type: 'CORRECT_SCORE', name: 'Marcador exacto', icon: '🎯', hint: 'El resultado final exacto' },
];

// Aviso que la API adjunta a toda respuesta deportiva.
const DEMO_NOTICE =
  'Datos deportivos de demostración: marcadores, minutos y cuotas son ficticios y no ' +
  'corresponden a encuentros reales. VOKTER no acepta apuestas ni pagos.';

module.exports = { LEAGUES, TEAMS, MATCHES, MARKET_TYPES, DEMO_NOTICE };
