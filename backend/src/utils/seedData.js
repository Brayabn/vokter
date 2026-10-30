// Datos demo de VOKTER (ficticios). Se usan tanto en desarrollo como para
// inicializar la base de producción. No contienen datos personales reales.
//
// Modelo del catálogo: VOKTER es una TIENDA MULTIMARCA.
//   - User con role 'expert' = MARCA / vendedor (bio = relato de marca, skills = sus líneas de producto)
//   - Content                = ARTÍCULO del catálogo (tags = atributos buscables)
//   - Favorite               = lista de deseos del comprador
// VOKTER AI compara la consulta en lenguaje natural contra skills + bio de las
// marcas, así que los `skills` deben leerse como "qué vende esta marca".

const DEMO_PASSWORD = 'vokter123';

const CATEGORIES = [
  { name: 'Ropa', slug: 'ropa', icon: '👕' },
  { name: 'Tecnología', slug: 'tecnologia', icon: '💻' },
  { name: 'Calzado', slug: 'calzado', icon: '👟' },
  { name: 'Accesorios', slug: 'accesorios', icon: '⌚' },
  { name: 'Hogar', slug: 'hogar', icon: '🛋️' },
  { name: 'Deporte', slug: 'deporte', icon: '🏀' },
];

// Marcas de la tienda (User.role = 'expert'). Mismo correo @vokter.com y clave demo.
const EXPERTS = [
  {
    name: 'NØRD Audio', email: 'nord@vokter.com', role: 'expert',
    bio: 'Audio nórdico de precisión: audífonos y parlantes afinados para escuchar, no para presumir.',
    skills: 'audifonos,parlantes,audio,sonido,cancelacion de ruido,bluetooth,tecnologia', rating: 4.9,
  },
  {
    name: 'Atlas Wear', email: 'atlas@vokter.com', role: 'expert',
    bio: 'Ropa urbana de materiales honestos: algodón pima, lana y prendas pensadas para durar temporadas.',
    skills: 'ropa,camisetas,chaquetas,abrigos,lana,algodon,urbano', rating: 4.7,
  },
  {
    name: 'Solsticio', email: 'solsticio@vokter.com', role: 'expert',
    bio: 'Prendas ligeras de lino y algodón para climas cálidos, con tintes naturales y cortes amplios.',
    skills: 'ropa,lino,camisas,vestidos,verano,ligero,fresco', rating: 4.6,
  },
  {
    name: 'Kuro Tech', email: 'kuro@vokter.com', role: 'expert',
    bio: 'Periféricos y pantallas para quien trabaja o juega muchas horas frente a un escritorio.',
    skills: 'tecnologia,teclados,monitores,computo,escritorio,gaming,mecanico', rating: 4.8,
  },
  {
    name: 'Vantage Running', email: 'vantage@vokter.com', role: 'expert',
    bio: 'Calzado y equipo deportivo probado en asfalto y gimnasio, con foco en amortiguación y agarre.',
    skills: 'calzado,zapatillas,running,correr,deporte,entrenamiento,amortiguacion', rating: 4.7,
  },
  {
    name: 'Casa Tierra', email: 'casatierra@vokter.com', role: 'expert',
    bio: 'Muebles de madera maciza y cerámica hecha a mano para una casa que se siente habitada.',
    skills: 'hogar,muebles,madera,ceramica,cocina,decoracion,comedor', rating: 4.6,
  },
  {
    name: 'Meridian Time', email: 'meridian@vokter.com', role: 'expert',
    bio: 'Relojes minimalistas de acero y cuero: una sola pieza bien hecha en lugar de diez desechables.',
    skills: 'accesorios,relojes,acero,cuero,minimalista,regalo', rating: 4.9,
  },
  {
    name: 'Fjord Outdoor', email: 'fjord@vokter.com', role: 'expert',
    bio: 'Equipo técnico para lluvia, viento y montaña: membranas impermeables y costuras selladas.',
    skills: 'ropa,chaquetas,impermeable,lluvia,cortaviento,montana,outdoor,termico,mochilas', rating: 4.8,
  },
  {
    name: 'Lumen Studio', email: 'lumen@vokter.com', role: 'expert',
    bio: 'Iluminación y domótica sencilla: luz cálida, control desde el móvil y cero cables a la vista.',
    skills: 'hogar,tecnologia,iluminacion,lamparas,smart home,domotica,luz', rating: 4.5,
  },
  {
    name: 'Base Denim', email: 'base@vokter.com', role: 'expert',
    bio: 'Denim básico y bien cortado, en tres lavados y nada más. Jeans que no pasan de moda.',
    skills: 'ropa,jeans,denim,pantalones,basicos,mezclilla', rating: 4.6,
  },
];

const DEMO_USER = {
  name: 'Usuario Demo', email: 'demo@vokter.com', role: 'user',
  bio: 'Cuenta de prueba para la evaluación técnica.',
};

// Artículos del catálogo. categorySlug / authorEmail se resuelven a ids al sembrar.
const CONTENTS = [
  // --- Ropa ---
  {
    title: 'Chaqueta impermeable Fjord Shell',
    description: 'Membrana de tres capas, costuras selladas y capucha ajustable. Aguanta un día entero de lluvia sin calarse y pesa menos de 400 g.',
    tags: 'chaqueta,impermeable,lluvia,cortaviento,outdoor,ropa',
    rating: 4.8, categorySlug: 'ropa', authorEmail: 'fjord@vokter.com',
  },
  {
    title: 'Abrigo de lana Atlas Heritage',
    description: 'Lana virgen compactada, forro interior y caída recta. Un abrigo de invierno para ciudad que combina con todo lo que ya tienes.',
    tags: 'abrigo,lana,invierno,termico,urbano,ropa',
    rating: 4.7, categorySlug: 'ropa', authorEmail: 'atlas@vokter.com',
  },
  {
    title: 'Camisa de lino Solsticio',
    description: 'Lino lavado a la piedra, cuello suave y corte amplio. Transpira en pleno calor y se ve bien incluso arrugada.',
    tags: 'camisa,lino,verano,ligero,fresco,ropa',
    rating: 4.6, categorySlug: 'ropa', authorEmail: 'solsticio@vokter.com',
  },
  {
    title: 'Jeans rectos Base Original',
    description: 'Denim de 13 oz con poco elastano, tiro medio y pierna recta. El par que te pones sin pensar un martes cualquiera.',
    tags: 'jeans,denim,pantalones,mezclilla,basicos,ropa',
    rating: 4.6, categorySlug: 'ropa', authorEmail: 'base@vokter.com',
  },
  {
    title: 'Camiseta de algodón pima Atlas',
    description: 'Algodón pima de 180 g, cuello reforzado y hombro cosido. Mantiene la forma después de cincuenta lavados.',
    tags: 'camiseta,algodon,basico,urbano,ropa',
    rating: 4.5, categorySlug: 'ropa', authorEmail: 'atlas@vokter.com',
  },

  // --- Tecnología ---
  {
    title: 'Audífonos NØRD Pulse con cancelación de ruido',
    description: 'Cancelación activa en dos modos, 40 horas de batería y estuche rígido. Pensados para vuelos largos y oficinas ruidosas.',
    tags: 'audifonos,cancelacion de ruido,bluetooth,audio,viaje,tecnologia',
    rating: 4.9, categorySlug: 'tecnologia', authorEmail: 'nord@vokter.com',
  },
  {
    title: 'Parlante portátil NØRD Field',
    description: 'Resistente al agua, 18 horas de reproducción y correa de transporte. Suena grave sin distorsionar a volumen alto.',
    tags: 'parlante,bluetooth,portatil,audio,resistente al agua,tecnologia',
    rating: 4.6, categorySlug: 'tecnologia', authorEmail: 'nord@vokter.com',
  },
  {
    title: 'Teclado mecánico Kuro K75',
    description: 'Formato 75%, switches lineales lubricados y carcasa de aluminio. Conexión por cable o inalámbrica a tres equipos.',
    tags: 'teclado,mecanico,gaming,escritorio,computo,tecnologia',
    rating: 4.8, categorySlug: 'tecnologia', authorEmail: 'kuro@vokter.com',
  },
  {
    title: 'Monitor Kuro View 27 pulgadas 2K',
    description: 'Panel IPS de 27 pulgadas a 1440p y 120 Hz, con brazo ajustable en altura y entrada USB-C de 90 W.',
    tags: 'monitor,pantalla,2k,escritorio,computo,tecnologia',
    rating: 4.7, categorySlug: 'tecnologia', authorEmail: 'kuro@vokter.com',
  },
  {
    title: 'Lámpara inteligente Lumen Arc',
    description: 'Luz regulable de 2200 K a 5000 K, control desde el móvil y rutinas por horario. Se instala sin obra y sin cables visibles.',
    tags: 'lampara,iluminacion,smart home,domotica,luz,tecnologia',
    rating: 4.5, categorySlug: 'tecnologia', authorEmail: 'lumen@vokter.com',
  },

  // --- Calzado ---
  {
    title: 'Zapatillas Vantage Air Run',
    description: 'Espuma de doble densidad, placa flexible y malla transpirable. Para rodajes diarios de 5 a 15 kilómetros en asfalto.',
    tags: 'zapatillas,running,correr,amortiguacion,calzado,deporte',
    rating: 4.7, categorySlug: 'calzado', authorEmail: 'vantage@vokter.com',
  },
  {
    title: 'Botas Fjord Trail',
    description: 'Caña media, suela de agarre profundo y forro impermeable. Montaña mojada, barro y piedra suelta sin torcer el tobillo.',
    tags: 'botas,montana,trekking,impermeable,calzado,outdoor',
    rating: 4.6, categorySlug: 'calzado', authorEmail: 'fjord@vokter.com',
  },

  // --- Accesorios ---
  {
    title: 'Reloj Meridian Steel 38',
    description: 'Caja de acero de 38 mm, cristal de zafiro y correa intercambiable de cuero. Sumergible hasta 50 metros.',
    tags: 'reloj,acero,minimalista,cuero,regalo,accesorios',
    rating: 4.9, categorySlug: 'accesorios', authorEmail: 'meridian@vokter.com',
  },
  {
    title: 'Mochila Fjord Daypack 22L',
    description: 'Tela reciclada repelente al agua, compartimento acolchado para portátil de 16 pulgadas y espalda ventilada.',
    tags: 'mochila,viaje,portatil,impermeable,outdoor,accesorios',
    rating: 4.7, categorySlug: 'accesorios', authorEmail: 'fjord@vokter.com',
  },

  // --- Hogar ---
  {
    title: 'Silla de comedor Casa Tierra Nordic',
    description: 'Roble macizo con aceite natural y asiento de rejilla tejida a mano. Se envía desarmada y se monta en diez minutos.',
    tags: 'silla,madera,muebles,comedor,decoracion,hogar',
    rating: 4.6, categorySlug: 'hogar', authorEmail: 'casatierra@vokter.com',
  },
  {
    title: 'Juego de cerámica Casa Tierra Barro',
    description: 'Seis piezas de barro esmaltado hechas a torno. Aptas para horno y lavavajillas; ninguna es exactamente igual a otra.',
    tags: 'ceramica,cocina,vajilla,decoracion,hogar',
    rating: 4.5, categorySlug: 'hogar', authorEmail: 'casatierra@vokter.com',
  },

  // --- Deporte ---
  {
    title: 'Esterilla de yoga Vantage Grip',
    description: 'Seis milímetros de caucho natural con superficie antideslizante incluso con sudor. Incluye correa de transporte.',
    tags: 'yoga,esterilla,entrenamiento,gimnasio,deporte',
    rating: 4.5, categorySlug: 'deporte', authorEmail: 'vantage@vokter.com',
  },
  {
    title: 'Balón de baloncesto Vantage Court',
    description: 'Cuero sintético con canales profundos para agarre en exterior. Talla 7, conserva la presión toda la temporada.',
    tags: 'balon,baloncesto,cancha,exterior,deporte',
    rating: 4.4, categorySlug: 'deporte', authorEmail: 'vantage@vokter.com',
  },
];

module.exports = { DEMO_PASSWORD, CATEGORIES, EXPERTS, DEMO_USER, CONTENTS };
