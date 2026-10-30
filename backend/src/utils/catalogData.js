// Catálogo real de la tienda (fotos en backend/public/catalogo, servidas en /api/media).
// Precios en pesos colombianos (COP). `price: null` = precio a consultar.
// Las fotos de calzado no existen todavía: esos artículos se publican sin imagen.

const img = (n) => `/api/media/catalogo/${String(n).padStart(2, '0')}.jpg`;

const CATALOG_CATEGORIES = [
  { name: 'Audio', slug: 'audio', icon: '🎧' },
  { name: 'Carga y energía', slug: 'carga-energia', icon: '🔌' },
  { name: 'Accesorios para celular', slug: 'celulares', icon: '📱' },
  { name: 'Gaming', slug: 'gaming', icon: '🎮' },
];

const CATALOG_EXPERTS = [
  {
    name: 'GOLD Tech', email: 'gold@vokter.com', role: 'expert',
    bio: 'Accesorios de tecnología al mejor precio: audio, cargadores, cables, power banks, gaming y soportes para celular, carro y moto.',
    skills: 'audifonos,manos libres,parlantes,diademas,bluetooth,cargadores,cables,power bank,gaming,consolas,teclados,mouse,fundas,soportes,celular,tecnologia', rating: 4.7,
  },
  {
    name: 'Star Home', email: 'starhome@vokter.com', role: 'expert',
    bio: 'Juegos de sábanas 100% algodón estampado de 320 hilos: sobresábana, sábana ajustable y fundas de almohada.',
    skills: 'hogar,sabanas,cama,algodon,dormitorio,ropa de cama,estampado', rating: 4.6,
  },
  {
    name: 'Urban Sport', email: 'urbansport@vokter.com', role: 'expert',
    bio: 'Conjuntos deportivos de chaqueta y pantalón para hombre y dama, en tallas de la S a la 4XL.',
    skills: 'ropa,deporte,conjuntos,sudaderas,chaquetas,pantalones,dama,hombre,tallas grandes', rating: 4.5,
  },
  {
    name: 'Paso Firme', email: 'pasofirme@vokter.com', role: 'expert',
    bio: 'Tenis y zapatos de referencias importadas para hombre, dama y unisex, con tallas del 35 al 44.',
    skills: 'calzado,tenis,zapatillas,sneakers,mocasines,running,dama,hombre,unisex', rating: 4.6,
  },
];

const GOLD = 'gold@vokter.com';
const STAR = 'starhome@vokter.com';
const SPORT = 'urbansport@vokter.com';
const SHOE_STORE = 'pasofirme@vokter.com';

// [imagen, título, precio, categoría, descripción, tags]
const GOLD_ITEMS = [
  // Audio
  [1, 'Manos libres Music Colores', 3800, 'audio', 'Audífonos de cable con conector 3.5 mm, micrófono y control de volumen. Varios colores.', 'manos libres,audifonos,cable,3.5,microfono'],
  [21, 'Manos libres Z1', 3500, 'audio', 'Audífonos de cable con conector 3.5 mm y control en línea.', 'manos libres,audifonos,cable,3.5'],
  [36, 'Manos libres W-01 Stereo', 3800, 'audio', 'Audífonos estéreo de cable, conector 3.5 mm y micrófono con control.', 'manos libres,audifonos,estereo,cable,3.5'],
  [37, 'Manos libres Samsung AKG', 3600, 'audio', 'Audífonos tipo in-ear afinados por AKG, conector 3.5 mm y control con micrófono.', 'manos libres,audifonos,samsung,akg,in-ear,3.5'],
  [30, 'Audífonos Space iPhone y Android', 3000, 'audio', 'Audífonos de cable compatibles con iPhone y Android.', 'audifonos,manos libres,iphone,android'],
  [2, 'Parlante S640', 13000, 'audio', 'Parlante portátil bluetooth con asa de transporte.', 'parlante,bluetooth,portatil,sonido'],
  [10, 'Parlante S410', 38000, 'audio', 'Parlante bluetooth con luces LED y asa de transporte.', 'parlante,bluetooth,luces,led,fiesta'],
  [25, 'Parlante FL828', 85000, 'audio', 'Parlante grande con luces, ideal para fiestas y eventos.', 'parlante,grande,fiesta,luces,bluetooth'],
  [52, 'Parlante S430', 75000, 'audio', 'Parlante bluetooth con iluminación RGB y asa trenzada.', 'parlante,bluetooth,rgb,luces,portatil'],
  [53, 'Parlante S520 Fly Sound 12"', 85000, 'audio', 'Parlante de 12 pulgadas con ruedas, manija extensible y aro de luz RGB.', 'parlante,12 pulgadas,ruedas,karaoke,fiesta,rgb'],
  [7, 'Diadema P9 tipo Apple', 52000, 'audio', 'Diadema inalámbrica bluetooth de copa cerrada con control integrado.', 'diadema,audifonos,bluetooth,inalambrico'],
  [8, 'Diadema Airpods Max', 52000, 'audio', 'Diadema bluetooth estilo Max con almohadillas acolchadas.', 'diadema,audifonos,bluetooth,inalambrico'],
  [22, 'Diadema Sony MDR XB450', 14500, 'audio', 'Diadema de cable con graves extra y conector 3.5 mm.', 'diadema,audifonos,sony,cable,bajos'],
  [23, 'Diadema Sony Bluetooth 450BT', 25000, 'audio', 'Diadema inalámbrica bluetooth con controles en el auricular.', 'diadema,audifonos,sony,bluetooth,inalambrico'],
  [40, 'Diadema N65BT', 32000, 'audio', 'Diadema inalámbrica bluetooth con radio FM y lector de memoria.', 'diadema,audifonos,bluetooth,radio,inalambrico'],
  [24, 'Cuellera bluetooth ZON-35', 18000, 'audio', 'Audífonos bluetooth tipo cuellera, cómodos para deporte.', 'cuellera,audifonos,bluetooth,deporte'],
  [9, 'Audífonos conducción ósea F805', 40000, 'audio', 'Audífonos bluetooth de oreja abierta por conducción ósea.', 'conduccion osea,audifonos,bluetooth,deporte,oreja abierta'],
  [41, 'Audífonos conducción ósea F-20', 38000, 'audio', 'Conducción ósea bluetooth 5.2, livianos y resistentes al sudor.', 'conduccion osea,audifonos,bluetooth,deporte,running'],
  [51, 'Balaca Pro Air', 35000, 'audio', 'Audífonos bluetooth deportivos de oreja abierta, 8 horas de reproducción.', 'balaca,audifonos,bluetooth,deporte,oreja abierta'],
  [38, 'Balaca Air Max imantada', 90000, 'audio', 'Diadema inalámbrica estilo Max con almohadillas imantadas y estuche.', 'balaca,diadema,audifonos,bluetooth,premium'],
  [28, 'Micrófono inalámbrico K9', 25000, 'audio', 'Micrófono de solapa inalámbrico para grabar video desde el celular.', 'microfono,inalambrico,solapa,video,celular'],
  // Gaming
  [39, 'Balaca gamer RGB', 63000, 'gaming', 'Diadema gamer con micrófono e iluminación azul.', 'diadema,gamer,gaming,microfono,rgb'],
  [70, 'Combo gamer T25', 45000, 'gaming', 'Teclado y mouse gamer con iluminación LED de colores.', 'combo,teclado,mouse,gamer,gaming,led'],
  [71, 'Consola retro blanca y verde', 75000, 'gaming', 'Consola retro HDMI con dos controles inalámbricos y miles de juegos clásicos.', 'consola,retro,juegos,controles,gaming'],
  [84, 'Proyector con juegos', 185000, 'gaming', 'Proyector portátil con apps de streaming, control remoto y dos controles para jugar.', 'proyector,juegos,consola,streaming,gaming'],
  // Tecnología
  [12, 'Teclado de cable', 13000, 'tecnologia', 'Teclado USB de oficina, conexión de cable.', 'teclado,cable,usb,oficina,computador'],
  [83, 'Combo teclado y mouse inalámbrico', 55000, 'tecnologia', 'Teclado compacto y mouse inalámbricos con receptor USB.', 'teclado,mouse,inalambrico,combo,oficina'],
  [61, 'Mouse inalámbrico', 12000, 'tecnologia', 'Mouse óptico inalámbrico 2.4 GHz de 1600 DPI.', 'mouse,inalambrico,computador,oficina'],
  [82, 'Mouse alámbrico SJ-100', 5500, 'tecnologia', 'Mouse óptico USB de cable.', 'mouse,cable,usb,computador'],
  [13, 'TV Stick Android TV', 55000, 'tecnologia', 'Convierte tu televisor en Smart TV con Android TV.', 'tv stick,android tv,smart tv,streaming'],
  [46, 'Watch One (onn) Google TV', 80000, 'tecnologia', 'Dispositivo de streaming HD con Google TV.', 'tv stick,google tv,streaming,smart tv'],
  [31, 'Antena TDT', 15000, 'tecnologia', 'Antena para televisión digital terrestre.', 'antena,tdt,television,digital'],
  [32, 'Codificador TDT', 48000, 'tecnologia', 'Decodificador de televisión digital terrestre con control remoto.', 'codificador,decodificador,tdt,television'],
  [15, 'Multipuerto USB', 19500, 'tecnologia', 'Hub USB de 4 puertos para computador.', 'multipuerto,hub,usb,computador'],
  // Carga y energía
  [3, 'Cable RCA 2x1', 4500, 'carga-energia', 'Cable de audio RCA 2 a 1.', 'cable,rca,audio'],
  [42, 'Cable tipo C 120W PX-214', 8500, 'carga-energia', 'Cable USB a tipo C de carga rápida 120W, 1.2 m, conector giratorio.', 'cable,tipo c,usb,carga rapida,120w'],
  [43, 'Cable Xiaomi tipo C / B8', 3500, 'carga-energia', 'Cable Xiaomi de 1.2 m, 2A. Tipo C a $3.500 y tipo B8 (micro USB) a $3.000.', 'cable,xiaomi,tipo c,micro usb,b8'],
  [92, 'Cable 2 en 1 PX-400', 13800, 'carga-energia', 'Cable tipo C y Lightning en uno, 3.5A, 1 m.', 'cable,2 en 1,tipo c,lightning,iphone'],
  [44, 'Cargador de carro 5A C209', 7500, 'carga-energia', 'Cargador de carro metálico con puerto USB y PD.', 'cargador,carro,plugin,usb,pd'],
  [26, 'Cargador de carro 38W', 9500, 'carga-energia', 'Cargador de carro de carga rápida 38W.', 'cargador,carro,plugin,carga rapida'],
  [45, 'Cargador de carro 67W R-01', 13000, 'carga-energia', 'Cargador de carro mini de doble puerto, Quick Charge 3.0 + PD 67W.', 'cargador,carro,plugin,67w,pd'],
  [54, 'Cargador tipo C 4.5A CG-06', 9000, 'carga-energia', 'Cargador de pared de carga rápida con cable tipo C.', 'cargador,tipo c,pared,carga rapida'],
  [81, 'Cargador tipo C 3A CG-16', 5800, 'carga-energia', 'Quick charger de 3A con cable incluido.', 'cargador,tipo c,pared,3a'],
  [55, 'Cargador 25W tipo C', 16000, 'carga-energia', 'Adaptador PD de 25W con salida USB-C.', 'cargador,25w,tipo c,pd'],
  [66, 'Cargador 67W tipo C Xiaomi', 20000, 'carga-energia', 'Adaptador Xiaomi PD de 67W con salida USB-C.', 'cargador,67w,xiaomi,tipo c,carga rapida'],
  [56, 'Cargador 67W tipo C con cable', 22000, 'carga-energia', 'Cargador Xiaomi de 67W con cable incluido.', 'cargador,67w,xiaomi,tipo c,cable'],
  [57, 'Cargador 4A y 20W tipo C CG-09', 7000, 'carga-energia', 'Cargador de 20W/4A con cable tipo C.', 'cargador,20w,tipo c,4a'],
  [58, 'Cargador 25W tipo C iPhone', 15000, 'carga-energia', 'Adaptador USB-C de 25W con cable USB-C a Lightning.', 'cargador,iphone,25w,lightning,tipo c'],
  [93, 'Cabeza iPhone 25W', 9000, 'carga-energia', 'Adaptador de pared USB-C de 25W para iPhone.', 'cargador,cabeza,iphone,25w,usb-c'],
  [29, 'Power bank 2300 mAh', 13000, 'carga-energia', 'Batería portátil compacta de 2300 mAh.', 'power bank,bateria,portatil'],
  [59, 'Power bank 5000 mAh MagSafe', 45000, 'carga-energia', 'Batería magnética para iPhone de 5000 mAh.', 'power bank,magsafe,iphone,bateria,inalambrica'],
  [60, 'Power bank 10.000 mAh', 45000, 'carga-energia', 'Batería portátil de 10.000 mAh con pantalla digital.', 'power bank,bateria,10000,portatil'],
  [69, 'Power bank 20.000 mAh', 55000, 'carga-energia', 'Batería portátil de 20.000 mAh para varias cargas.', 'power bank,bateria,20000,portatil'],
  // Accesorios para celular
  [4, 'Holder para carro chupa imán', 10000, 'celulares', 'Soporte magnético con ventosa para el carro.', 'holder,soporte,carro,iman,celular'],
  [27, 'Holder para carro de rejilla', 9500, 'celulares', 'Soporte para celular de rejilla de ventilación.', 'holder,soporte,carro,rejilla,celular'],
  [11, 'Soporte para moto manubrio XL', 13000, 'celulares', 'Soporte para celular de manubrio con funda protectora.', 'soporte,moto,manubrio,celular,gps'],
  [68, 'Soporte para moto manubrio 360° H-73', 15000, 'celulares', 'Soporte impermeable para manubrio, giro 360° y pantalla táctil.', 'soporte,moto,manubrio,impermeable,celular'],
  [67, 'Soporte para moto espejo XL+M3', 13000, 'celulares', 'Soporte para celular o GPS de montaje en el espejo.', 'soporte,moto,espejo,celular,gps'],
  [47, 'Funda de silicona Android', 5000, 'celulares', 'Funda de silicona para Samsung, Xiaomi y Motorola en 15 colores. El precio varía según la referencia.', 'funda,silicona,android,samsung,xiaomi,motorola,colores'],
  [85, 'Funda de silicona iPhone', 4500, 'celulares', 'Funda de silicona para iPhone en 15 colores. El precio varía según la referencia.', 'funda,silicona,iphone,colores'],
  [72, 'Funda Samsung lujo', 12000, 'celulares', 'Funda para Samsung con acabado escarchado y anillo magnético.', 'funda,samsung,lujo,magnetica'],
  [14, 'Protector de cargador', 7000, 'celulares', 'Protector de cable con personajes animados.', 'protector,cargador,cable,personajes'],
  [94, 'Protector de AirPods', 7000, 'celulares', 'Estuche de silicona para AirPods con diseños de personajes.', 'protector,airpods,estuche,personajes'],
];

const SHEET_DESIGNS = [
  [17, 'puntos aqua'], [18, 'estrellas azules'], [19, 'ondas beige'], [20, 'geométrico gris'],
  [33, 'ondas plata'], [34, 'círculos mostaza'], [35, 'geométrico verde'], [64, 'mosaico azul'],
  [65, 'flores lila'], [88, 'triángulos de colores'], [89, 'luna gris'], [90, 'memphis'],
  [91, 'círculos grises'], [99, 'hojas verdes'],
];

// [imagen, referencia, público, colores]
const TRACKSUITS = [
  [48, 'N8805', 'hombre', 'azul con beige, verde con gris, negro con caramelo'],
  [49, 'On 6976', 'hombre', 'azul, negro, beige'],
  [76, 'UA 6976', 'hombre', 'beige, negro, azul'],
  [77, 'Nike 6976', 'hombre', 'negro, azul, beige'],
  [75, '3508', 'hombre', 'negro, gris claro, azul petróleo, beige'],
  [96, '3503', 'hombre', 'negro, gris, azul'],
  [97, '2333', 'hombre', 'verde con negro, beige, azul petróleo'],
  [5, '2335', 'hombre', 'rojo con blanco, verde con beige, azul'],
  [80, 'H-88', 'dama', 'gris, crudo, beige, fucsia, negro'],
  [6, 'H-88 verde', 'dama', 'verde, turquesa, negro, beige'],
  [63, 'H-685', 'dama', 'negro, lila, verde, azul cielo, salmón'],
  [50, 'rosa palo', 'dama', 'rosa palo con pantalón negro'],
  [78, 'verde menta', 'dama', 'verde menta con pantalón negro'],
  [79, 'verde agua', 'dama', 'verde agua con negro'],
  [86, 'tres rayas lila', 'dama', 'lila'],
  [87, 'tres rayas azul petróleo', 'dama', 'azul petróleo'],
  [98, 'tres rayas verde oliva', 'dama', 'verde oliva'],
];

// [título, precio, tallas, colores, público]
const SHOES = [
  ['HOKA Clifton 10', 240000, '36-44', 'azul, negro, blanco, verde', 'unisex'],
  ['HOKA Bondi 9', 270000, '36-44', 'blanco, negro, azul', 'unisex'],
  ['HOKA Skyflow', 270000, '37-44', 'blanco, negro, azul', 'unisex'],
  ['HOKA Gaviota', 260000, '36-44', 'blanco, negro, azul', 'unisex'],
  ['LV Skate Sneakers', 270000, '35-43', 'blanco, negro, rojo, azul, plateado', 'unisex'],
  ['LV Trainer', 180000, '35-44', 'blanco, negro, azul, verde, rojo', 'unisex'],
  ['Archlight Trainer', 270000, '36-40', 'blanco, negro', 'dama'],
  ['Under Armour Micro Valsetz', 230000, '36-44', 'negro, café, verde, gris', 'unisex'],
  ['Mocasín Skechers', 210000, '37-44', 'café, gris, negro, moca', 'hombre'],
  ['Valentino Garavani Diamante', 170000, '36-43', 'blanco, negro', 'unisex'],
  ['Valentino Garavani Open Sneaker', 190000, '36-40', 'blanco', 'dama'],
  ['Valentino Garavani VL7N Band', 210000, '37-43', 'blanco, negro', 'unisex'],
];

const CATALOG_CONTENTS = [
  ...GOLD_ITEMS.map(([n, title, price, categorySlug, description, tags]) => ({
    title, price, description, tags, categorySlug, imageUrl: img(n), rating: 4.5, authorEmail: GOLD,
  })),
  ...SHEET_DESIGNS.map(([n, design]) => ({
    title: `Juego de sábanas Star Home ${design}`,
    price: 149000,
    description: `Juego de sábanas 100% algodón estampado, 320 hilos, diseño ${design}. Incluye sobresábana, sábana ajustable y fundas de almohada. Tamaños sencillo (160x230), semidoble (180x230), doble (220x230) y king. Precio de promoción (antes $340.000).`,
    tags: 'sabanas,juego de cama,algodon,estampado,hogar,dormitorio',
    categorySlug: 'hogar', imageUrl: img(n), rating: 4.6, authorEmail: STAR,
  })),
  ...TRACKSUITS.map(([n, ref, audience, colors]) => ({
    title: `Conjunto deportivo ${audience} ${ref}`,
    price: null,
    description: `Conjunto de chaqueta y pantalón deportivo para ${audience}. Colores: ${colors}. ${audience === 'hombre' ? 'Tallas XL a 4XL.' : 'Tallas S a XL.'} Precio a consultar.`,
    tags: `conjunto,sudadera,chaqueta,pantalon,deporte,ropa,${audience}`,
    categorySlug: 'deporte', imageUrl: img(n), rating: 4.5, authorEmail: SPORT,
  })),
  ...SHOES.map(([title, price, sizes, colors, audience]) => ({
    title, price,
    description: `Tenis ${audience}. Tallas ${sizes}. Colores: ${colors}.`,
    tags: `tenis,zapatillas,calzado,sneakers,${audience}`,
    categorySlug: 'calzado', imageUrl: '', rating: 4.6, authorEmail: SHOE_STORE,
  })),
];

module.exports = { CATALOG_CATEGORIES, CATALOG_EXPERTS, CATALOG_CONTENTS };
